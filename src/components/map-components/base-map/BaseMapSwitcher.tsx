// components/BaseMapSwitcher.tsx
type BaseMapSwitcherProps = {
    currentStyle: string;
    onChange: (style: string) => void;
    onBeforeChange?: () => void; // Optional cleanup callback
};

const BaseMapSwitcher = ({ currentStyle, onChange, onBeforeChange }: BaseMapSwitcherProps) => {
    const styles = [
        {
            id: "satellite",
            label: "🛰️",
            title: "Satellite",
            styleUrl: "mapbox://styles/mapbox/satellite-streets-v12",
        },
        {
            id: "dark",
            label: "🌙",
            title: "Dark",
            styleUrl: "mapbox://styles/mapbox/dark-v11",
        },
        {
            id: "outdoors",
            label: "🌲",
            title: "Outdoors",
            styleUrl: "mapbox://styles/mapbox/outdoors-v12",
        },
    ];


    const roundButtonStyle = (active: boolean): React.CSSProperties => ({
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        backgroundColor: active ? "#4a90e2" : "#fff",
        boxShadow: active ? "0 0 8px #4a90e2" : "0 0 5px rgba(0,0,0,0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        userSelect: "none",
        fontSize: 20,
    });

    return (
        <div
            style={{
                position: "absolute",
                bottom: 30,
                right: 20,
                zIndex: 1,
                display: "flex",
                gap: 12,
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: 12,
                padding: 8,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
        >
            {styles.map((s) => (
                <button
                    key={s.id}
                    title={s.title}
                    style={roundButtonStyle(currentStyle === s.styleUrl)}
                    onClick={() => {
                        if (onBeforeChange) onBeforeChange();
                        onChange(s.styleUrl);
                    }}
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
};

export default BaseMapSwitcher;