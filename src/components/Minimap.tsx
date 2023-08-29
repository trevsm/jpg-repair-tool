export default function Minimap({
  position,
  heightPercentage,
}: {
  position: number; // 0 - 1
  heightPercentage: number; // 0 - 1
}) {
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
    </div>
  );
}
