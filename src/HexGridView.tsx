import { fastHexToInt } from "./tools/fastHexToInt";

interface HexGridViewProps {
  hexData: string[];
  offset: number;
}
export function HexGridView({ hexData, offset }: HexGridViewProps) {
  const rowCount = 40;
  const lightText = "#00000030";
  const lightBg = "#00000015";

  const StickyHeader = () => (
    <>
      <div className="sticky sticky-top">Offset</div>
      {Array.from({ length: 16 }).map((_, colIndex) => (
        <div key={`header-${colIndex}`} className="sticky sticky-top">
          {colIndex.toString(16).padStart(2, "0").toUpperCase()}
        </div>
      ))}
      <div className="sticky sticky-top">ASCII</div>
    </>
  );

  const AddressValues = () =>
    Array.from({ length: rowCount }).map((_, rowIndex) => (
      <div
        key={`line-${rowIndex}`}
        style={{
          color: "#000",
          gridColumnStart: 1,
          gridRowStart: rowIndex + 2,
        }}
      >
        {(offset / 16 + rowIndex).toString(16).padStart(8, "0").toUpperCase()}
      </div>
    ));

  const HexValues = () =>
    hexData.slice(offset, offset + rowCount * 16).map((hex, idx) => (
      <div
        key={idx}
        style={{
          color: hex === "00" ? lightText : "#000",
          backgroundColor: idx % 2 !== 0 ? "#fff" : lightBg,
          gridColumnStart: (idx % 16) + 2,
        }}
      >
        {hex}
      </div>
    ));

  const AsciiValues = () => {
    const endOffset = offset + rowCount * 16;
    const jsx = [];

    for (let i = offset; i < endOffset; i += 16) {
      const chars = [];

      for (let j = i; j < i + 16 && j < hexData.length; j++) {
        const charCode = fastHexToInt(hexData[j]);
        chars.push(
          charCode >= 0x20 && charCode <= 0x7e
            ? String.fromCharCode(charCode)
            : "."
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

  const preComputedStyle = (rowIdx: number) =>
    ({
      color: "#000",
      gridColumnStart: 18,
      gridRowStart: rowIdx + 2,
      whiteSpace: "pre",
    } as React.CSSProperties);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `80px repeat(${16}, 24px) 150px`,
      }}
    >
      <StickyHeader />
      <AddressValues />
      <HexValues />
      <AsciiValues />
    </div>
  );
}
