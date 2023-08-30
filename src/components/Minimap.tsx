interface MinimapProps {
  position: number; // 0 - 1
  heightPercentage: number; // 0 - 1
  blocklines?: {
    label: string;
    position: number; // 0 - 1
    realOffset: number;
    highlightOnly?: boolean;
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

  let lastPosition = -1;
  let groupLabel = "";
  let labelCount = 0;
  const groupThreshold = 1; // 10% proximity threshold
  const buttonGroups: any[] = [];
  const lines: any[] = [];

  if (blocklines) {
    blocklines.forEach(({ label, position, realOffset, highlightOnly }) => {
      const topPosition = position * 100;
      if (highlightOnly) return;

      // For rendering individual lines
      lines.push({ position: topPosition });

      // For button grouping logic
      if (
        lastPosition >= 0 &&
        Math.abs(topPosition - lastPosition) <= groupThreshold
      ) {
        labelCount++;
        if (labelCount <= 1) {
          groupLabel = `${groupLabel}, ${label}`;
        } else if (labelCount === 2) {
          groupLabel = `${groupLabel}, ...more`;
        }
        buttonGroups[buttonGroups.length - 1].label = groupLabel;
      } else {
        labelCount = 1;
        groupLabel = label;
        buttonGroups.push({
          label: groupLabel,
          position: topPosition,
          realOffset,
        });
      }

      lastPosition = topPosition;
    });
  }

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
      {lines.map(({ position }, index) => (
        <div
          key={`line-${index}`}
          style={{
            position: "absolute",
            top: `${position}%`,
            background: "blue",
            height: "1px",
            width: "100%",
          }}
        />
      ))}

      {buttonGroups.map(({ label, position, realOffset }, index) => (
        <div
          key={`${label}${position}`}
          style={{
            position: "absolute",
            top: `${position}%`,
            width: "100%",
            whiteSpace: "nowrap",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: `-8px`,
              left: "calc(100% + 5px)",
              padding: "0",
              fontSize: "10px",
            }}
            onClick={() => setOffset(realOffset - 16 * 20)}
          >
            {label}
          </button>
        </div>
      ))}
    </div>
  );
}
