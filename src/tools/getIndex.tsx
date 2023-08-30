export function getIndex(
  hexArray: string[] | null,
  hexMatch: string[]
): number[] {
  const indexes: number[] = [];
  hexArray?.forEach((hex, index) => {
    if (hex === hexMatch[0]) {
      let match = true;
      for (let i = 1; i < hexMatch.length; i++) {
        if (hexMatch[i] === "*") {
          match = true;
        } else if (hexMatch[i][0] === "!") {
          if (hexArray[index + i] === hexMatch[i].slice(1)) {
            match = false;
            break;
          }
        } else if (hexArray[index + i] !== hexMatch[i]) {
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
