import { useEffect, useState } from "react";

type ReliefLayerProps = {
    map: mapboxgl.Map | null;
};

const ReliefLayer = ({ map }: ReliefLayerProps) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (!map) return;

        const addLayers = () => {
            if (map.getSource("relief-elevation")) return;

            map.addSource("relief-elevation", {
                type: "raster",
                url: "mapbox://hugones45.7ne6b1su",
                tileSize: 256,
                minzoom: 7,
                maxzoom: 10
            });

            map.addLayer({
                id: "relief-layer",
                type: "raster",
                source: "relief-elevation",
                // minzoom: 7,
                // maxzoom: 10,
                paint: {
                    "raster-opacity": opacity,
                },
            });
        };

        const updateOpacity = (newOpacity: number) => {
            if (map.getLayer("relief-layer")) {
                map.setPaintProperty("relief-layer", "raster-opacity", newOpacity);
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

            if (map.getLayer("relief-layer")) map.removeLayer("relief-layer");
            if (map.getSource("relief-elevation")) map.removeSource("relief-elevation");
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
                <label htmlFor="relief-opacity" style={{ display: "block", marginBottom: 6 }}>
                    Relief Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                    id="relief-opacity"
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

export default ReliefLayer;
