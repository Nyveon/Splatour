import feather from 'feather-icons';
import GS3dMap from "./maps/GS3dMap.ts";
import GS3dViewer from "./maps/GS3dViewer.ts";
import Alpine from 'alpinejs'

Alpine.data('gs3dviewer', (mapdata: GS3dMap) => new GS3dViewer(
    GS3dMap.deserializeFromJSON(mapdata), true)
);

window.Alpine = Alpine;
Alpine.start()

feather.replace();
