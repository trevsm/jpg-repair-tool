import { fastHexToInt } from "../../tools/fastHexToInt";
import { rowCount } from ".";

export const AsciiValues = ({
  offset,
  hexData,
}: {
  offset: number;
  hexData: string[];
}) => {
  const preComputedStyle = (rowIdx: number) =>
    ({
      color: "#000",
      gridColumnStart: 20,
      gridRowStart: rowIdx + 2,
      whiteSpace: "pre",
    } as React.CSSProperties);

  const endOffset = offset + rowCount * 16;
  const jsx = [];

  for (let i = offset; i < endOffset; i += 16) {
    const chars = [];

    for (let j = i; j < i + 16 && j < hexData.length; j++) {
      const charCode = fastHexToInt(hexData[j]);
      chars.push(
        charCode >= 32 && charCode <= 126 ? String.fromCharCode(charCode) : "."
      );
    }

    const rowIdx = (i - offset) / 16;
    jsx.push(
      <div key={`ascii-${rowIdx}`} style={preComputedStyle(rowIdx)}>
        {chars.join("")}
      </div>
    );
  }

  return jsx;
};
