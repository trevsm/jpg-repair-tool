interface HexGridViewProps {
  hexData: string[];
  offset: number;
}
export function HexGridView({ hexData, offset }: HexGridViewProps) {
  const scrollCount = 10;
  const colCount = 16;
  const rowCount = 40;
  const lightText = "#eaeaea";
  const bc = "#cecece";

  const StickyHeader = () => (
    <>
      <div
        className="sticky sticky-top"
        style={{
          border: `1px solid ${bc}`,
          textAlign: "center",
        }}
      >
        Address
      </div>
      {Array.from({ length: colCount }).map((_, colIndex) => (
        <div
          key={`header-${colIndex}`}
          className="sticky sticky-top"
          style={{
            borderTop: `1px solid ${bc}`,
            borderRight: `1px solid ${bc}`,
            borderBottom: `1px solid ${bc}`,
            textAlign: "center",
          }}
        >
          {colIndex.toString(16).padStart(2, "0").toUpperCase()}
        </div>
      ))}
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
          paddingLeft: "5px",
          borderRight: "1px solid" + bc,
          borderBottom: "1px solid" + bc,
          borderLeft: `1px solid ${bc}`,
        }}
      >
        {(offset * scrollCount + rowIndex)
          .toString(16)
          .padStart(6, "0")
          .toUpperCase()}
      </div>
    ));

  const hexValues = hexData
    .slice(
      offset * scrollCount * colCount,
      offset * scrollCount * colCount + rowCount * colCount
    )
    .map((hex, idx) => (
      <div
        key={idx}
        style={{
          color: hex === "00" ? lightText : "#000",
          borderRight: "1px solid" + bc,
          borderBottom: "1px solid" + bc,
          gridColumnStart: (idx % colCount) + 2, // +1 to adjust for address column
        }}
      >
        {hex}
      </div>
    ));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `80px repeat(${colCount}, 24px)`,
      }}
    >
      <StickyHeader />
      <AddressValues />
      {hexValues}
    </div>
  );
}
