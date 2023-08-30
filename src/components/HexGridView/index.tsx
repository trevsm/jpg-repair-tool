import { useMemo, useState } from "react";
import Minimap from "../Minimap";
import { AddressValues } from "./AddressValues";
import { AsciiValues } from "./AsciiValues";
import { HexValues } from "./HexValues";
import { StickyHeader } from "./StickyHeader";
import { useKeyboardEvents } from "./useKeyboardEvents";
import { fileFormatCodes } from "../../fileFormatCodes";
import { getIndex } from "../../tools/getIndex";
import { get16 } from "../../tools/misc";

interface HexGridViewProps {
  hexData: string[];
  offset: number;
  setOffset: (offset: number) => void;
  setHexData: (hexData: string[]) => void;
  fileType: string;
}

export const rowCount = 40;

export function HexGridView({
  hexData,
  offset,
  setOffset,
  setHexData,
  fileType,
}: HexGridViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useKeyboardEvents({
    hexData,
    setHexData,
    selectedIndex,
    setSelectedIndex,
  });

  const fileOutline = useMemo(
    () =>
      fileFormatCodes
        .find((fileFormat) => fileFormat.types.includes(fileType))
        ?.codes.map((code) => ({
          title: code.title + `[${code.match.join("")}]`,
          indexes: {
            values: getIndex(hexData, code.match),
            highlightOnly: code?.highlightOnly,
            color: code?.color,
          },
          match: code.match,
        })),
    [hexData]
  );

  const blocklines = fileOutline
    ?.flatMap(({ title, indexes }) =>
      indexes.values.map((index) => ({
        label: title,
        position: index / hexData.length,
        realOffset: index,
        highlightOnly: indexes.highlightOnly,
        color: indexes.color,
      }))
    )
    .sort((a, b) => a.position - b.position);

  return (
    <div style={{ display: "flex", gap: "20px", height: "fit-content" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `80px 24px repeat(${16}, 24px) 24px 150px`,
        }}
      >
        <StickyHeader />
        <AddressValues offset={offset} />
        <HexValues
          hexData={hexData}
          offset={offset}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          fileOutline={fileOutline}
        />
        <AsciiValues offset={offset} hexData={hexData} />
      </div>
      <Minimap
        position={offset / get16(hexData.length)}
        heightPercentage={(rowCount * 16) / get16(hexData.length)}
        blocklines={blocklines}
        setOffset={setOffset}
      />
    </div>
  );
}
