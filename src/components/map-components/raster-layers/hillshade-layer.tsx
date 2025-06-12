import { useEffect, useState } from "react";

type HillShadeLayerProps = {
    map: mapboxgl.Map | null;
};

const HillShadeLayer = ({ map }: HillShadeLayerProps) => {
    const [opacity, setOpacity] = useState(0.4);

    useEffect(() => {
        if (!map) return;

        const addLayers = () => {
            if (map.getSource("hillshade-source")) return; // Prevent double-adding

            // Add hillshade source
            map.addSource("hillshade-source", {
                type: "raster",
                url: "mapbox://hugones45.2cjb2hox",
                tileSize: 256,
                minzoom: 7,
                maxzoom: 10
            });

            // Add hillshade layer
            map.addLayer({
                id: "hillshade-layer",
                type: "raster",
                source: "hillshade-source",
                // minzoom: 7,
                // maxzoom: 10,
                paint: {
                    "raster-opacity": opacity,
                },
            });
        };

        const updateOpacity = (newOpacity: number) => {
            if (map.getLayer("hillshade-layer")) {
                map.setPaintProperty("hillshade-layer", "raster-opacity", newOpacity);
            }
        };

        const onStyleLoad = () => {
            addLayers();
        };

        if (map.isStyleLoaded()) {
            addLayers();
        } else {
            map.once("style.load", onStyleLoad);
        }

        // Update opacity when it changes
        updateOpacity(opacity);

        return () => {
            map.off("style.load", onStyleLoad);

            if (map.getLayer("hillshade-layer")) map.removeLayer("hillshade-layer");
            if (map.getSource("hillshade-source")) map.removeSource("hillshade-source");
        };
    }, [map, opacity]);

    const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOpacity(parseFloat(event.target.value));
    };

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: 70,
                    right: 20,
                    zIndex: 10,
                    backgroundColor: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    fontSize: "14px",
                    userSelect: "none",
                    width: "160px",
                }}
            >
                <label htmlFor="hillshade-opacity" style={{ display: "block", marginBottom: 6 }}>
                    Shadow Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                    id="hillshade-opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={handleOpacityChange}
                    style={{ width: "100%" }}
                />
            </div>
        </>
    );
};

export default HillShadeLayer;
