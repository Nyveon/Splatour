# Supermarket demo

Open `/#/supermarket` in Splatour, or open this folder in the editor.

The floor is leveled to Y = 0. The scene scale is `4.183147085455832`, chosen so
the mean floor-to-camera height across all 363 capture positions equals the
viewer's standard standing height of 1.70 m. Camera positions are converted into
the model's coordinates using Nerfstudio's saved dataparser transform and scale
(`0.20199528365084685`) before calibration.

This assumes the average capture height represents 1.70 m; it is not a surveyed
measurement. The scene and its ground barriers are scaled together. Viewer eye
height remains at its standard setting.

`map.json` loads `supermarket-lod.rad`, generated from `supermarket.spz`
(1,346,550 splats, SH degree 3). After replacing the source, regenerate it with
`npm run build:lod -- Supermarket/supermarket.spz` from the repo root.
The original `supermarket.ply` remains local. Scene placement and scale are saved
in `map.json`.
