export default function Minimap({
  position,
  heightPercentage,
  blocklines,
  setOffset,
}: {
  position: number; // 0 - 1
  heightPercentage: number; // 0 - 1
  blocklines?: {
    label: string;
    position: number; // 0 - 1
    realOffset: number;
  }[];
  setOffset: (offset: number) => void;
}) {
  const barHeight = heightPercentage * 100 > 0.5 ? heightPercentage * 100 : 0.5;
  const scale = 100 / (100 + barHeight / 2);
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
          background: "lightblue",
          height: `${barHeight}%`,
          width: "100%",
          border: "1px solid black",
          borderLeft: "none",
          borderRight: "none",
        }}
      />
      {blocklines?.map(({ label, position }) => {
        const topPosition = position * 100;
        return (
          <div
            key={label + position}
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
            <div
              style={{
                position: "absolute",
                top: "-8px",
                left: "calc(100% + 5px)",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
