import { useMemo } from "react";
import { fastHexToInt } from "../tools/fastHexToInt";
import Minimap from "./Minimap";
import { fileFormatCodes } from "../fileFormatCodes";
import { getIndex } from "../tools/getIndex";

interface HexGridViewProps {
  hexData: string[];
  offset: number;
  setOffset: (offset: number) => void;
}
export function HexGridView({ hexData, offset, setOffset }: HexGridViewProps) {
  const rowCount = 40;
  const lightText = "#00000030";
  const lightBg = "#00000015";

  const fileOutline = useMemo(
    () =>
      fileFormatCodes
        .find((fileFormat) => fileFormat.types.includes("jpg"))
        ?.codes.map((code) => ({
          title: code.title,
          indexes: getIndex(hexData, code.match),
        })),
    [hexData]
  );

  const blocklines = fileOutline?.flatMap(({ title, indexes }) =>
    indexes.map((index) => ({
      label: title,
      position: index / hexData.length,
      realOffset: index,
    }))
  );

  const StickyHeader = () => (
    <>
      <div className="sticky sticky-top">Offset</div>
      <div className="sticky sticky-top"></div>
      {Array.from({ length: 16 }).map((_, colIndex) => (
        <div key={`header-${colIndex}`} className="sticky sticky-top">
          {colIndex.toString(16).padStart(2, "0").toUpperCase()}
        </div>
      ))}
      <div className="sticky sticky-top"></div>
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

  const HexValues = () => {
    const endOffset = offset + rowCount * 16;

    const getMatchingSequenceInfo = (globalIndex: number) => {
      for (const { indexes } of fileOutline ?? []) {
        for (const index of indexes) {
          if (globalIndex >= index && globalIndex < index + 2) {
            // Adjust the length based on the match length
            return {
              isStart: globalIndex === index,
              isEnd: globalIndex === index + 1, // Adjust based on the match length
            };
          }
        }
      }
      return null;
    };

    return hexData.slice(offset, endOffset).map((hex, idx) => {
      const globalIndex = offset + idx;
      const sequenceInfo = getMatchingSequenceInfo(globalIndex);

      const activeBorder = "blue";
      const activeBg = "#8888ff";

      const borderColor = sequenceInfo
        ? activeBorder
        : idx % 2 !== 0
        ? "#fff"
        : "#eaeaea";
      const backgroundColor = sequenceInfo
        ? activeBg
        : idx % 2 !== 0
        ? "#fff"
        : "#eaeaea";
      const borderLeftColor = sequenceInfo?.isStart
        ? activeBorder
        : sequenceInfo?.isEnd
        ? activeBg
        : "white";
      const borderRightColor = sequenceInfo?.isEnd
        ? activeBorder
        : sequenceInfo?.isStart
        ? activeBg
        : "white";

      return (
        <div
          key={idx}
          style={{
            color: hex === "00" ? lightText : "#000",
            backgroundColor,
            gridColumnStart: (idx % 16) + 3,
          }}
        >
          <div
            style={{
              borderTopColor: borderColor,
              borderBottomColor: borderColor,
              borderLeftColor: borderLeftColor,
              borderRightColor: borderRightColor,
              borderStyle: "solid",
              borderWidth: "1px",
            }}
          >
            {hex}
          </div>
        </div>
      );
    });
  };

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
      gridColumnStart: 20,
      gridRowStart: rowIdx + 2,
      whiteSpace: "pre",
    } as React.CSSProperties);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `80px 24px repeat(${16}, 24px) 24px 150px`,
        }}
      >
        <StickyHeader />
        <AddressValues />
        <HexValues />
        <AsciiValues />
      </div>
      <Minimap
        position={offset / hexData.length}
        heightPercentage={(rowCount * 16) / hexData.length}
        blocklines={blocklines}
        setOffset={setOffset}
      />
    </div>
  );
}
