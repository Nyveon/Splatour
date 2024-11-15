import { Alpine as AlpineType } from 'alpinejs'
import GS3dScene from './js/maps/GS3dScene'
import GS3dMap from './js/maps/GS3dMap'
import GS3dViewer from './js/maps/GS3dViewer'

declare global {
    var Alpine: AlpineType
    var GS3dScene: typeof GS3dScene
    var GS3dMap: typeof GS3dMap
    var GS3dViewer: typeof GS3dViewer
    var successToast: (message: string) => void
    var warningToast: (message: string) => void
    var copyToClipboard: (valueName: string, value: string, type: string) => void
}