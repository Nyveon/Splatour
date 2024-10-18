import { Alpine as AlpineType } from 'alpinejs'
import GS3dMap from './js/maps/GS3dMap'
import GS3dViewer from './js/maps/GS3dViewer'

declare global {
  var Alpine: AlpineType
  var GS3dMap: typeof GS3dMap
  var GS3dViewer: typeof GS3dViewer
}