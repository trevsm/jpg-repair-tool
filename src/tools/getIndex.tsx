export function getIndex(
  hexArray: string[] | null,
  hexMatch: string[]
): number[] {
  const indexes: number[] = [];
  hexArray?.forEach((hex, index) => {
    if (hex === hexMatch[0]) {
      // try to match the rest of the hexMatch
      let match = true;
      for (let i = 1; i < hexMatch.length; i++) {
        if (hexArray[index + i] !== hexMatch[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        indexes.push(index);
      }
    }
  });
  return indexes;
}
