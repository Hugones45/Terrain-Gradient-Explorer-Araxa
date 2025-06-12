import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

type ContourLinesProps = {
    map: mapboxgl.Map | null;
};

const ContourLines = ({ map }: ContourLinesProps) => {
    const [opacity, setOpacity] = useState<number>(1);
    const [color, setColor] = useState<string>("#FF0000");
    const [elevationFilter, setElevationFilter] = useState<number>(847);
    const [exactElevation, setExactElevation] = useState<string>(""); // new input as string

    useEffect(() => {
        if (!map) return;

        const sourceId = "contour-lines";
        const baseLayerId = "contour-lines-layer";
        const hoverLayerId = "contour-lines-hover";

        let popup: mapboxgl.Popup | null = null;

        const popupHandler = (e: mapboxgl.MapLayerMouseEvent) => {
            const feature = e.features?.[0];
            if (!feature) return;

            const elev = feature.properties?.ELEV ?? "Desconhecido";

            if (popup) {
                popup.remove();
            }

            popup = new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<strong>Elevação:</strong> ${elev} m`)
                .addTo(map);
        };

        const loadLayer = async () => {
            try {
                const response = await fetch("/contour-lines.geojson");
                const geojson = await response.json();

                if (!map.getSource(sourceId)) {
                    map.addSource(sourceId, {
                        type: "geojson",
                        data: geojson,
                    });
                }

                if (!map.getLayer(baseLayerId)) {
                    map.addLayer({
                        id: baseLayerId,
                        type: "line",
                        source: sourceId,
                        paint: {
                            "line-color": color,
                            "line-width": 2,
                            "line-opacity": opacity,
                        },
                        // Initial filter will be applied later via useEffect
                        filter: [">=", ["coalesce", ["get", "ELEV"], 0], elevationFilter],
                    });
                }

                if (!map.getLayer(hoverLayerId)) {
                    map.addLayer({
                        id: hoverLayerId,
                        type: "line",
                        source: sourceId,
                        paint: {
                            "line-color": color,
                            "line-width": 6,
                            "line-opacity": 1,
                        },
                        filter: ["==", "ID", ""],
                    });
                }

                map.moveLayer(hoverLayerId);
                map.moveLayer(baseLayerId);

                map.on("click", baseLayerId, popupHandler);

                map.on("mouseenter", baseLayerId, () => {
                    map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", baseLayerId, () => {
                    map.getCanvas().style.cursor = "";
                    if (map.getLayer(hoverLayerId)) {
                        map.setFilter(hoverLayerId, ["==", "ID", ""]);
                    }
                    if (popup) {
                        popup.remove();
                        popup = null;
                    }
                });

                map.on("mousemove", baseLayerId, (e) => {
                    const feature = e.features?.[0];
                    if (!feature) return;

                    const id = feature.properties?.ID ?? "";
                    if (map.getLayer(hoverLayerId)) {
                        map.setFilter(hoverLayerId, ["==", "ID", id]);
                    }
                });
            } catch (error) {
                console.error("Erro ao carregar curvas de nível:", error);
            }
        };

        if (map.isStyleLoaded()) {
            loadLayer();
        } else {
            map.once("load", loadLayer);
        }

        const onStyleData = () => {
            if (map.getLayer(hoverLayerId)) map.moveLayer(hoverLayerId);
            if (map.getLayer(baseLayerId)) map.moveLayer(baseLayerId);
        };

        map.on("sourcedata", onStyleData);

        return () => {
            map.off("sourcedata", onStyleData);
            map.off("click", baseLayerId, popupHandler);
            map.off("mouseenter", baseLayerId, () => { });
            map.off("mouseleave", baseLayerId, () => { });
            map.off("mousemove", baseLayerId, () => { });
            if (map.getLayer(hoverLayerId)) map.removeLayer(hoverLayerId);
            if (map.getLayer(baseLayerId)) map.removeLayer(baseLayerId);
            if (map.getSource(sourceId)) map.removeSource(sourceId);
            if (popup) {
                popup.remove();
                popup = null;
            }
        };
    }, [map]);

    // Update color and opacity
    useEffect(() => {
        if (!map) return;
        if (map.getLayer("contour-lines-layer")) {
            map.setPaintProperty("contour-lines-layer", "line-opacity", opacity);
            map.setPaintProperty("contour-lines-layer", "line-color", color);
        }
        if (map.getLayer("contour-lines-hover")) {
            map.setPaintProperty("contour-lines-hover", "line-color", color);
        }
    }, [map, opacity, color]);

    // Update filters (combine min elevation and exact elevation)
    useEffect(() => {
        if (!map) return;

        if (!map.getLayer("contour-lines-layer")) return;

        // If exactElevation is set and is a valid number, filter by exact elevation
        const exactVal = parseFloat(exactElevation);
        let filter: any;

        if (!isNaN(exactVal) && exactElevation !== "") {
            // Filter exact elevation
            filter = ["==", ["coalesce", ["get", "ELEV"], -9999], exactVal];
        } else {
            // Filter by min elevation
            filter = [">=", ["coalesce", ["get", "ELEV"], 0], elevationFilter];
        }

        map.setFilter("contour-lines-layer", filter);
    }, [map, elevationFilter, exactElevation]);

    return (
        <div
            style={{
                position: "absolute",
                top: 70,
                left: 10,
                zIndex: 9999,
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                userSelect: "none",
                width: 220,
            }}
        >
            <label>
                Opacity:
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    style={{ width: "100%" }}
                />
            </label>

            <label style={{ marginTop: 12, display: "block" }}>
                Color:
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: "100%", marginTop: 4 }}
                />
            </label>

            <label style={{ marginTop: 12, display: "block" }}>
                Min Elevation: {elevationFilter} m
                <input
                    type="range"
                    min={0}
                    max={1345}
                    step={1}
                    value={elevationFilter}
                    onChange={(e) => setElevationFilter(Number(e.target.value))}
                    style={{ width: "100%" }}
                    disabled={exactElevation !== ""}
                />
            </label>

            <label style={{ marginTop: 12, display: "block" }}>
                Exact Elevation:
                <input
                    type="number"
                    placeholder="Type elevation"
                    value={exactElevation}
                    onChange={(e) => setExactElevation(e.target.value)}
                    style={{ width: "100%", marginTop: 4 }}
                    min={0}
                    max={1345}
                />
            </label>

            <button
                onClick={() => {
                    setElevationFilter(0);
                    setExactElevation("");
                    if (map?.getLayer("contour-lines-layer")) {
                        map.setFilter("contour-lines-layer", null);
                    }
                }}
                style={{
                    marginTop: 8,
                    width: "100%",
                    padding: "6px 0",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    fontWeight: "bold",
                }}
            >
                Reset Filter
            </button>
        </div>
    );
};

export default ContourLines;
