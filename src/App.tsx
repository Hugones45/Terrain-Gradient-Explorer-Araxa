import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";

import BaseMap from "./components/map-components/base-map/base-map";
import RasterLayers from "./components/map-components/raster-layers/relief-layer";

function App() {
  // const mapContainerRef = useRef<HTMLDivElement>(null);
  // const mapRef = useRef<mapboxgl.Map | null>(null);

  // useEffect(() => {
  //   if (!mapContainerRef.current) return;

  //   mapboxgl.accessToken = 'pk.eyJ1IjoiaHVnb25lczQ1IiwiYSI6ImNtYXpraXRjbzBrdDMycm9zMmxwd2k0aXQifQ.MA5kSdrN7NC2imLV3TdWcQ';

  //   mapRef.current = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //     center: [-46.940186, -19.582844],
  //     zoom: 9,
  //     style: 'mapbox://styles/mapbox/streets-v12'
  //   });

  //   mapRef.current.on('load', () => {
  //     // Base DEM raster (tileset moderno via URL)
  //     mapRef.current?.addSource('minas-gerais-dem', {
  //       type: 'raster',
  //       url: 'mapbox://hugones45.7ne6b1su', // Substitua pelo seu tileset ID
  //       tileSize: 256
  //     });

  //     mapRef.current?.addLayer({
  //       id: 'elevation-colored-layer',
  //       type: 'raster',
  //       source: 'minas-gerais-dem',
  //       paint: {
  //         'raster-opacity': 0.9
  //       }
  //     });

  //     // Hillshade raster (tileset moderno via URL)
  //     mapRef.current?.addSource('minas-gerais-hillshade', {
  //       type: 'raster',
  //       url: 'mapbox://hugones45.2cjb2hox', // Substitua pelo seu tileset ID
  //       tileSize: 256
  //     });

  //     mapRef.current?.addLayer({
  //       id: 'hillshade-layer',
  //       type: 'raster',
  //       source: 'minas-gerais-hillshade',
  //       paint: {
  //         'raster-opacity': 0.5,
  //         'raster-hue-rotate': 0
  //       }
  //     });
  //   });

  //   return () => {
  //     mapRef.current?.remove();
  //     mapRef.current = null;
  //   };
  // }, []);

  return (
    <>
      <BaseMap />

    </>
  );
}

export default App;





