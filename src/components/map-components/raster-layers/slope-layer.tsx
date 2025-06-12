import { useEffect, useState } from "react";

type SlopeLayerProps = {
    map: mapboxgl.Map | null;
};

const SlopeLayer = ({ map }: SlopeLayerProps) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (!map) return;

        const addLayers = () => {
            if (map.getSource("slope-elevation")) return; // Prevent double-adding

            map.addSource("slope-elevation", {
                type: "raster",
                url: "mapbox://hugones45.dt9it6ll",
                tileSize: 256,
                minzoom: 7,
                maxzoom: 10,
            });

            map.addLayer({
                id: "slope-layer",
                type: "raster",
                source: "slope-elevation",
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
            {/* Opacity control - top right */}
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

            {/* Legend - bottom left */}
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    zIndex: 10,
                    backgroundColor: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    fontSize: "14px",
                    userSelect: "none",
                    width: "190px",
                    lineHeight: 1.3,
                }}
            >
                <strong style={{ display: "block", marginBottom: 8 }}>Slope</strong>

                <LegendItem color="#004d00" label="Flat (0–3%)" />
                <LegendItem color="#339933" label="Gentle Rolling (3–8%)" />
                <LegendItem color="#66cc66" label="Rolling (8–20%)" />
                <LegendItem color="#e6d8ad" label="Strong Rolling (20–45%)" />
                <LegendItem color="#ff9900" label="Moderately Mountainous (45–55%)" />
                <LegendItem color="#cc0000" label="Steep (>75%)" />
            </div>
        </>
    );
};

type LegendItemProps = {
    color: string;
    label: string;
};

const LegendItem = ({ color, label }: LegendItemProps) => (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
            style={{
                display: "inline-block",
                width: 18,
                height: 18,
                backgroundColor: color,
                border: "1px solid #ccc",
                marginRight: 8,
            }}
        />
        <span>{label}</span>
    </div>
);

export default SlopeLayer;
