import React, { useMemo } from "react";
import { rowCount } from ".";

export function HexValues({
  hexData,
  offset,
  selectedIndex,
  setSelectedIndex,
  fileOutline,
}: {
  hexData: string[];
  offset: number;
  selectedIndex: number | null;
  setSelectedIndex: (index: number) => void;
  fileOutline?: {
    title: string;
    indexes: {
      values: number[];
      highlightOnly?: boolean;
      color?: string;
    };
    match: string[];
  }[];
}) {
  const endOffset = offset + rowCount * 16;
  const lightText = "#00000030";

  // Pre-calculate matching sequences for the given range
  const sequenceInfos = useMemo(() => {
    const infos = new Map<number, any>();
    if (!fileOutline) return infos;

    for (const { indexes, match } of fileOutline) {
      const matchLength = match.length;
      for (const index of indexes.values) {
        if (index >= offset && index < endOffset) {
          for (let i = 0; i < matchLength; i++) {
            infos.set(index + i, {
              isStart: i === 0,
              isEnd: i === matchLength - 1,
              color: indexes.color,
            });
          }
        }
      }
    }
    return infos;
  }, [fileOutline, offset, endOffset]);

  return hexData.slice(offset, endOffset).map((hex, idx) => {
    const globalIndex = offset + idx;
    const sequenceInfo = sequenceInfos.get(globalIndex);

    const activeBg = sequenceInfo?.color ? sequenceInfo.color : "#8888ff";
    const backgroundColor =
      selectedIndex === globalIndex
        ? "#00ff64"
        : sequenceInfo
        ? activeBg
        : idx % 2 !== 0
        ? "#fff"
        : "#eaeaea";

    return (
      <div
        key={idx}
        style={{
          color: hex === "00" ? lightText : "#000",
          backgroundColor,
          gridColumnStart: (idx % 16) + 3,
          cursor: "default",
        }}
        tabIndex={0}
        onFocus={() => setSelectedIndex(globalIndex)}
      >
        {hex}
      </div>
    );
  });
}
