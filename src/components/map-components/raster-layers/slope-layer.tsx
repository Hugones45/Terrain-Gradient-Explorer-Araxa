import { useEffect, useState } from "react";

type SlopeLayerProps = {
    map: mapboxgl.Map | null;
};

const SlopeLayer = ({ map }: SlopeLayerProps) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (!map) return;

        const addLayers = () => {
            if (map.getSource("slope-elevation")) return; // Prevent double-adding on re-renders

            map.addSource("slope-elevation", {
                type: "raster",
                url: "mapbox://hugones45.dt9it6ll",
                tileSize: 256,
                minzoom: 7,
                maxzoom: 10
            });

            map.addLayer({
                id: "slope-layer",
                type: "raster",
                source: "slope-elevation",
                // minzoom: 7,
                // maxzoom: 10,
                paint: {
                    "raster-opacity": opacity,
                },
            });
        };

        const updateOpacity = (newOpacity: number) => {
            if (map.getLayer("slope-layer")) {
                map.setPaintProperty("slope-layer", "raster-opacity", newOpacity);
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

        updateOpacity(opacity);

        return () => {
            map.off("style.load", onStyleLoad);

            if (map.getLayer("slope-layer")) map.removeLayer("slope-layer");
            if (map.getSource("slope-elevation")) map.removeSource("slope-elevation");
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
                <label htmlFor="slope-opacity" style={{ display: "block", marginBottom: 6 }}>
                    Slope Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                    id="slope-opacity"
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

export default SlopeLayer;
