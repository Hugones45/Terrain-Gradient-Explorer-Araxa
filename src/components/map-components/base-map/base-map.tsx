// components/BaseMap.tsx
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from "react";
import ReliefLayer from "../raster-layers/relief-layer";
import SlopeLayer from "../raster-layers/slope-layer";
import HillShadeLayer from "../raster-layers/hillshade-layer";
import ContourLines from "../vector-layers/contour-lines";
import BaseMapSwitcher from "./BaseMapSwitcher";

const BaseMap = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [showRelief, setShowRelief] = useState(false);
    const [showSlope, setShowSlope] = useState(false);
    const [showHillshade, setShowHillshade] = useState(false);
    const [showContours, setShowContours] = useState(false);
    const [baseMapStyle, setBaseMapStyle] = useState('mapbox://styles/mapbox/satellite-streets-v12');

    const resetAllLayers = () => {
        setShowRelief(false);
        setShowSlope(false);
        setShowHillshade(false);
        setShowContours(false);
    };

    // Initialize the map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-46.940186, -19.582844],
            zoom: 9,
            minZoom: 7,
            maxZoom: 16,
            style: baseMapStyle,
            accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
        });

        mapRef.current = map;

        map.on('load', () => {
            setMapLoaded(true);
        });

        return () => {
            map.remove();
        };
    }, []);

    // Update base map style when changed
    useEffect(() => {
        if (mapRef.current && mapLoaded) {
            mapRef.current.setStyle(baseMapStyle);
        }
    }, [baseMapStyle, mapLoaded]);

    // Re-add custom layers after style is reset
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const handleStyleLoad = () => {
            if (showRelief) ReliefLayer({ map });
            if (showSlope) SlopeLayer({ map });
            if (showHillshade) HillShadeLayer({ map });
            if (showContours) ContourLines({ map });
        };

        map.on("style.load", handleStyleLoad);

        return () => {
            map.off("style.load", handleStyleLoad);
        };
    }, [showRelief, showSlope, showHillshade, showContours]);

    // ✅ Fixed toggle logic
    const toggleRelief = () => {
        setShowRelief(prev => {
            const newState = !prev;
            if (newState) {
                setShowSlope(false);
                setShowHillshade(false);
            } else {
                setShowHillshade(false);
            }
            return newState;
        });
    };

    const toggleSlope = () => {
        setShowSlope(prev => {
            const newState = !prev;
            if (newState) {
                setShowRelief(false);
                setShowHillshade(false);
            } else {
                setShowHillshade(false);
            }
            return newState;
        });
    };

    const toggleHillshade = () => {
        setShowHillshade(prev => !prev);
    };

    const toggleContours = () => {
        setShowContours(prev => !prev);
    };

    const roundButtonStyle = (active: boolean): React.CSSProperties => ({
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: active ? '#4a90e2' : '#fff',
        boxShadow: active ? '0 0 8px #4a90e2' : '0 0 5px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        userSelect: 'none',
        fontSize: 20,
    });

    return (
        <>
            <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />

            {/* Raster Layer Buttons - Top Right */}
            <div style={{
                position: 'absolute',
                top: 10,
                right: 19,
                zIndex: 1,
                display: 'flex',
                gap: 12,
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: 12,
                padding: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
                <button
                    aria-label="Relief"
                    onClick={toggleRelief}
                    style={roundButtonStyle(showRelief)}
                    title="Relief"
                >
                    🏔️
                </button>
                <button
                    aria-label="Slope"
                    onClick={toggleSlope}
                    style={roundButtonStyle(showSlope)}
                    title="Slope"
                >
                    📐
                </button>
                <button
                    aria-label="Hillshade"
                    onClick={toggleHillshade}
                    style={roundButtonStyle(showHillshade)}
                    title="Hillshade"
                >
                    🌑
                </button>
            </div>

            {/* Contour Lines Button - Top Left */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 1,
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: 12,
                padding: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
                <button
                    aria-label="Contour Lines"
                    onClick={toggleContours}
                    style={roundButtonStyle(showContours)}
                    title="Contour Lines"
                >
                    🗻
                </button>
            </div>

            {mapLoaded && mapRef.current && (showRelief || showSlope) && (
                showRelief ? <ReliefLayer map={mapRef.current} /> : <SlopeLayer map={mapRef.current} />
            )}

            {mapLoaded && mapRef.current && showHillshade && (
                <HillShadeLayer map={mapRef.current} />
            )}

            {mapLoaded && mapRef.current && showContours && (
                <ContourLines map={mapRef.current} />
            )}

            <BaseMapSwitcher
                currentStyle={baseMapStyle}
                onBeforeChange={resetAllLayers}
                onChange={setBaseMapStyle}
            />
        </>
    );
};

export default BaseMap;
