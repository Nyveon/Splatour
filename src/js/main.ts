import feather from 'feather-icons';
import GS3dMap from "./maps/GS3dMap.ts";
import GS3dViewer from "./maps/GS3dViewer.ts";
import Alpine from 'alpinejs'

window.GS3dMap = GS3dMap;
window.GS3dViewer = GS3dViewer;


/**
 * Alpine.js directive to render Feather icons
 * Replaces data-feather
 * Reasoning: x-if and similar would mean having to do feather.replace() every time the element is added to the DOM
 */
Alpine.directive('feather', (el: HTMLElement, { expression }: { expression: string }) => {
    const icons = feather.icons as Record<string, { toSvg: () => string }>;

    if (typeof expression !== 'string' || !icons[expression]) {
        console.warn(`Invalid feather icon name: ${expression}`);
        return;
    }

    const svgString = icons[expression].toSvg();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgString;
    const icon = tempDiv.firstElementChild as SVGElement | null;

    el.classList.add('feather');

    if (icon) {
        el.appendChild(icon);
    }

    // if (icon && el.parentNode) {
    //     for (const attr of el.attributes) {
    //         if (attr.name === 'x-feather') {
    //             continue;
    //         }

    //         icon.setAttribute(attr.name, attr.value);
    //     }

    //     el.parentNode.replaceChild(icon, el);
    // } else {
    //     console.warn('Could not replace element, icon or parentNode is null');
    // }
});


window.Alpine = Alpine;
Alpine.start()



