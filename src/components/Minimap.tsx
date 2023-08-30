interface MinimapProps {
  position: number; // 0 - 1
  heightPercentage: number; // 0 - 1
  blocklines?: {
    label: string;
    position: number; // 0 - 1
    realOffset: number;
    highlightOnly?: boolean;
    color?: string;
  }[];
  setOffset: (offset: number) => void;
}

export default function Minimap({
  position,
  heightPercentage,
  blocklines,
  setOffset,
}: MinimapProps) {
  const barHeight = heightPercentage * 100 > 0.5 ? heightPercentage * 100 : 0.5;
  const topPosition = position * 100;

  let lastPosition = -1;
  let groupLabel = "";
  let labelCount = 0;
  const groupThreshold = 1; // 10% proximity threshold
  const buttonGroups: any[] = [];
  const lines: any[] = [];

  if (blocklines) {
    blocklines.forEach(
      ({ label, position, realOffset, highlightOnly, ...rest }) => {
        const topPosition = position * 100;
        const color = rest?.color || "blue";
        if (highlightOnly) return;

        // For rendering individual lines
        lines.push({ position: topPosition, color });

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
      }
    );
  }

  return (
    <div
      style={{
        width: "70px",
        position: "relative",
        background: "#e8e8e8",
        border: "1px solid black",
        marginRight: "100px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${topPosition}%`,
          width: "100%",
          height: `${barHeight}%`,
          paddingLeft: "2px",
          paddingRight: "2px",
          display: "flex",
        }}
      >
        <div
          style={{
            background: "#fff",
            width: "100%",
            height: `100%`,
            border: "1px solid black",
          }}
        />
      </div>
      {lines.map(({ position, color }, index) => (
        <div
          key={`line-${index}`}
          style={{
            position: "absolute",
            top: `${position}%`,
            background: color,
            height: "1px",
            width: "100%",
          }}
        />
      ))}

      {buttonGroups.map(({ label, position, realOffset }) => (
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
