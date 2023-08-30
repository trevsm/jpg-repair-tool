interface MinimapProps {
  position: number; // 0 - 1
  heightPercentage: number; // 0 - 1
  blocklines?: {
    label: string;
    position: number; // 0 - 1
    realOffset: number;
  }[];
  setOffset: (offset: number) => void;
}

export default function Minimap({
  position,
  heightPercentage,
  blocklines,
  setOffset,
}: MinimapProps) {
  const barHeight = heightPercentage * 100 > 1 ? heightPercentage * 100 : 1;
  const scale = 100 / (100 + barHeight);
  const topPosition = position * scale * 100;

  return (
    <div
      style={{
        width: "70px",
        position: "relative",
        background: "#f5faff",
        border: "1px solid black",
        marginRight: "100px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${topPosition}%`,
          background: "lightgreen",
          height: `${barHeight}%`,
          width: "100%",
        }}
      />
      {blocklines?.map(({ label, position, realOffset }, index) => {
        const topPosition = position * 100;
        const topButtonPosition = `-8px - ${index * 10}px`; // Staggered offset for each button
        return (
          <div
            key={`${label}${position}`}
            style={{
              position: "absolute",
              top: `${topPosition}%`,
              background: "blue",
              height: "1px",
              width: "100%",
              fontSize: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: topButtonPosition,
                left: "calc(100% + 5px)",
                padding: "0",
                fontSize: "7px",
              }}
              onClick={() => setOffset(realOffset - 16 * 20)}
            >
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
