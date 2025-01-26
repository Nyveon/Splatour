# Splatour 

3D Gaussian splatting map-making, immersive multimedia scene composition and virtual tour viewer and editor for the web.

*Currently in Alpha.*

## Made with

Static site with React + Typescript and Three.js.

### Web

- Github Pages - Hosting
- [Vite](https://vite.dev/guide/) - Build tool
- [COI Serviceworker](https://github.com/gzuidhof/coi-serviceworker) - Workaround for CORS headers
- [fflate](https://github.com/101arrowz/fflate) - Client-side zip compression

### React

- [React Router](https://reactrouter.com/en/main) - Path routing
- [React Device Detect](https://github.com/duskload/react-device-detect#readme) - Device type detection
- [Emotion](https://emotion.sh/docs/introduction) - CSS-in-JS styled componentss
- [React Joystick Component](https://github.com/elmarti/react-joystick-component#readme) - Joystick component
- [Zustand](https://github.com/pmndrs/zustand) - Shared state management
- [Headless UI](https://headlessui.com/react) - Modals and dropdowns

### 3D

- [GaussianSplats3D](https://github.com/mkkellogg/GaussianSplats3D) - Gaussian Splat renderer. Absolutely essential, thanks @mkkellogg!
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) - Three.js as react components
- [Drei](https://drei.docs.pmnd.rs/getting-started/introduction) - Extra Three.js components


### Resources

- [Feather Icons](https://github.com/feathericons/react-feather) - Icon images
- [Roboto](https://fonts.google.com/specimen/Roboto) - Font


## Instructions

Currently deployed at: <https://thesis.eri.cl>

1. Install
2. Run local
3. Build
4. Run preview

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Other Resources

### Learning

- [React.dev learn](https://react.dev/learn)
- [The Odin Project React course](https://www.theodinproject.com/paths/full-stack-javascript/courses/react)
- [First person camera](https://www.youtube.com/watch?v=oqKzxPMLWxo)

### Inspirations

- [Inspiration: Laboratorio31 exhibition](https://current-exhibition.com/laboratorio31/)
- [Laboratorio31 Interview](https://radiancefields.com/gaussian-splatting-brings-art-exhibitions-online-with-yulei)

### Capturing

- [Laboratorio31 Gaussian Splatting](https://medium.com/@heyulei/capture-images-for-gaussian-splatting-81d081bbc826)
- [Interior scan path for Gaussian Splats](https://www.youtube.com/watch?v=2ZX_5bOdKjo)

### Datasets

- [Khachkar videos](https://drive.google.com/drive/u/1/folders/1T7olQ1MWyAnDPSOB5TnkdjeKj-EzXFvL)
