# Splatour 

3D Gaussian Splatting map-making, immersive multimedia scene composition and virtual tour viewer and editor for the web.

Check out the demo at: [maps.eri.cl](https://maps.eri.cl/)


## Usage

*⚠ This project is currently in Alpha, and development is on hold until March 2025.*

1. Access the Editor at [maps.eri.cl](https://maps.eri.cl/#/editor). *(⚠ Editor requires a Chromium browser)*
2. Create an empty folder on your computer to store your project.
3. Click on the "Create" button in the Editor and select the folder you created.
4. Import and edit Gaussian Splat scenes, 3D models, and web content.
5. Save your project, and if you wish, export it as a static site.

For more details about each step, refer to internal documentation available by clicking on the **question mark icons** in the Editor.


## Development

### Resources & Technology

Static site with React + Typescript and Three.js.

#### Web

- [Github Pages](https://pages.github.com/) - Hosting
- [Vite](https://vite.dev/guide/) - Build tool
- [COI Serviceworker](https://github.com/gzuidhof/coi-serviceworker) - Workaround for CORS headers
- [fflate](https://github.com/101arrowz/fflate) - Client-side zip compression

#### React

- [React Router](https://reactrouter.com/en/main) - Path routing
- [React Device Detect](https://github.com/duskload/react-device-detect#readme) - Device type detection
- [Emotion](https://emotion.sh/docs/introduction) - CSS-in-JS styled componentss
- [React Joystick Component](https://github.com/elmarti/react-joystick-component#readme) - Joystick component
- [Zustand](https://github.com/pmndrs/zustand) - Shared state management
- [Headless UI](https://headlessui.com/react) - Modals and dropdowns

#### 3D

- [GaussianSplats3D](https://github.com/mkkellogg/GaussianSplats3D) - Gaussian Splat renderer. Absolutely essential, thanks @mkkellogg!
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) - Three.js as react components
- [Drei](https://drei.docs.pmnd.rs/getting-started/introduction) - Extra Three.js components
- [R3F-Perf](https://github.com/utsuboco/r3f-perf) - Benchmarking performance


#### Images

- [Feather Icons](https://github.com/feathericons/react-feather) - Icon images
- [Roboto](https://fonts.google.com/specimen/Roboto) - Font


#### Inspirations

- [Laboratorio31 exhibition](https://current-exhibition.com/laboratorio31/)
- [Laboratorio31 Interview](https://radiancefields.com/gaussian-splatting-brings-art-exhibitions-online-with-yulei)
- [Laboratorio31 Gaussian Splatting](https://medium.com/@heyulei/capture-images-for-gaussian-splatting-81d081bbc826)
- [Interior scan path for Gaussian Splats](https://www.youtube.com/watch?v=2ZX_5bOdKjo)


### Deployment

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

## Contributing