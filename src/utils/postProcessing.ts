import type { PostProcessingSettings } from "@/model/PostProcessing";
import {
	HalfFloatType,
	NoBlending,
	NoToneMapping,
	RawShaderMaterial,
	Vector2,
	WebGLRenderTarget,
	type Camera,
	type Scene,
	type WebGLRenderer,
} from "three";
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js";

const vertexShader = `precision highp float;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

const meterShader = `precision highp float;
uniform sampler2D image;
varying vec2 vUv;
void main() {
 vec4 sampleColor = texture2D(image, vUv);
 float luminance = dot(sampleColor.rgb, vec3(.2126, .7152, .0722));
 float weight = mix(.15, 1., exp(-8. * dot(vUv - .5, vUv - .5)));
 gl_FragColor = vec4(clamp((log2(max(luminance, .00024414)) + 12.) / 16., 0., 1.),
  weight, luminance > .0001 && sampleColor.a > .01 ? 1. : 0., 1.);
}`;

const outputShader = `precision highp float;
uniform sampler2D image;
uniform float exposure;
uniform float contrast;
uniform float saturation;
uniform vec3 whiteBalance;
varying vec2 vUv;
#include <tonemapping_pars_fragment>
#include <colorspace_pars_fragment>
void main() {
 vec3 color = max(texture2D(image, vUv).rgb, vec3(0.)) * whiteBalance * exposure;
 float luminance = dot(color, vec3(.2126, .7152, .0722));
 color = max(mix(vec3(luminance), color, saturation), vec3(0.));
 color = sRGBTransferOETF(vec4(NeutralToneMapping(color), 1.)).rgb;
 gl_FragColor = vec4(clamp((color - .5) * contrast + .5, 0., 1.), 1.);
}`;

/** Center-weighted, 10–90% trimmed log histogram, measured before exposure. */
export function meterExposure(pixels: Uint8Array): number | undefined {
	const histogram = new Float64Array(64);
	let total = 0;
	for (let i = 0; i < pixels.length; i += 4) {
		if (pixels[i + 2] < 128) continue;
		const weight = pixels[i + 1] / 255;
		histogram[Math.min(63, Math.floor(pixels[i] / 4))] += weight;
		total += weight;
	}
	if (total < 1) return undefined;
	let cumulative = 0,
		sum = 0,
		kept = 0;
	for (let bin = 0; bin < 64; bin++) {
		const next = cumulative + histogram[bin];
		const weight = Math.max(
			0,
			Math.min(next, total * 0.9) - Math.max(cumulative, total * 0.1)
		);
		sum += weight * (-12 + ((bin + 0.5) / 64) * 16);
		kept += weight;
		cumulative = next;
	}
	// Neutral's toe subtracts about .04; .22 becomes approximately .18 gray.
	return kept > 0 ? Math.log2(0.22) - sum / kept : undefined;
}

export class ScenePostProcessor {
	private hdr = new WebGLRenderTarget(1, 1, { type: HalfFloatType });
	private meter = new WebGLRenderTarget(64, 36, { depthBuffer: false });
	private meterMaterial = new RawShaderMaterial({
		vertexShader,
		fragmentShader: meterShader,
		uniforms: { image: { value: this.hdr.texture } },
		depthTest: false,
		depthWrite: false,
		blending: NoBlending,
	});
	private outputMaterial = new RawShaderMaterial({
		vertexShader,
		fragmentShader: outputShader,
		uniforms: {
			image: { value: this.hdr.texture },
			toneMappingExposure: { value: 1 },
			exposure: { value: 1 },
			contrast: { value: 1 },
			saturation: { value: 1 },
			whiteBalance: { value: [1, 1, 1] },
		},
		depthTest: false,
		depthWrite: false,
		blending: NoBlending,
	});
	private quad = new FullScreenQuad(this.outputMaterial);
	private size = new Vector2();
	private pixels = new Uint8Array(64 * 36 * 4);
	private elapsed = 0.25;
	private pending = false;
	private disposed = false;
	private meteringFailed = false;
	private sceneId = "";
	private generation = 0;
	private ready = false;
	private correction = 0;
	private exposure: number | undefined;

	render(
		gl: WebGLRenderer,
		scene: Scene,
		camera: Camera,
		settings: PostProcessingSettings,
		sceneId: string,
		delta: number
	) {
		let loading = false,
			splats = false;
		scene.traverseVisible((object) => {
			loading ||= object.userData.splatLoading === true;
			splats ||= object.userData.splatReady === true;
		});
		const ready = splats && !loading;
		if (sceneId !== this.sceneId || ready !== this.ready) {
			this.generation++;
			if (sceneId !== this.sceneId) this.correction = 0;
			this.sceneId = sceneId;
			this.ready = ready;
			this.elapsed = 0.25;
		}
		const correction = settings.autoExposure
			? Math.max(
					-settings.exposureRange,
					Math.min(settings.exposureRange, this.correction)
				)
			: 0;
		const target = settings.exposure + correction;
		this.exposure ??= settings.exposure;
		if (ready)
			this.exposure +=
				(target - this.exposure) *
				(1 -
					Math.exp(
						(-Math.min(delta, 0.1) * 3) /
							(settings.autoExposure ? settings.adaptationTime : 0.15)
					));
		const uniforms = this.outputMaterial.uniforms;
		uniforms.exposure.value = 2 ** this.exposure;
		uniforms.contrast.value = settings.contrast;
		uniforms.saturation.value = settings.saturation;
		const gains = [
			2 ** (settings.temperature * 0.25 + settings.tint * 0.125),
			2 ** (-settings.tint * 0.25),
			2 ** (-settings.temperature * 0.25 + settings.tint * 0.125),
		];
		const normalization =
			gains[0] * 0.2126 + gains[1] * 0.7152 + gains[2] * 0.0722;
		uniforms.whiteBalance.value = gains.map((value) => value / normalization);
		gl.getDrawingBufferSize(this.size);
		if (this.hdr.width !== this.size.x || this.hdr.height !== this.size.y)
			this.hdr.setSize(this.size.x, this.size.y);
		const previousTarget = gl.getRenderTarget(),
			previousToneMapping = gl.toneMapping,
			previousAutoClear = gl.autoClear;
		try {
			gl.autoClear = true;
			gl.toneMapping = NoToneMapping;
			gl.setRenderTarget(this.hdr);
			gl.render(scene, camera);
			this.elapsed += delta;
			if (
				ready &&
				settings.autoExposure &&
				!this.pending &&
				!this.meteringFailed &&
				this.elapsed >= 0.25
			) {
				this.elapsed = 0;
				this.quad.material = this.meterMaterial;
				gl.setRenderTarget(this.meter);
				this.quad.render(gl);
				this.pending = true;
				const generation = this.generation;
				void gl
					.readRenderTargetPixelsAsync(this.meter, 0, 0, 64, 36, this.pixels)
					.then(() => {
						if (this.disposed || generation !== this.generation) return;
						const measured = meterExposure(this.pixels);
						if (measured !== undefined) this.correction = measured;
					})
					.catch((error) => {
						this.meteringFailed = true;
						this.correction = 0;
						console.warn(
							"Auto exposure unavailable; using scene exposure",
							error
						);
					})
					.finally(() => {
						this.pending = false;
						if (this.disposed) this.meter.dispose();
					});
			}
			this.quad.material = this.outputMaterial;
			gl.setRenderTarget(previousTarget);
			this.quad.render(gl);
		} finally {
			gl.setRenderTarget(previousTarget);
			gl.toneMapping = previousToneMapping;
			gl.autoClear = previousAutoClear;
		}
	}

	dispose() {
		this.disposed = true;
		this.hdr.dispose();
		if (!this.pending) this.meter.dispose();
		this.meterMaterial.dispose();
		this.outputMaterial.dispose();
		this.quad.dispose();
	}
}
