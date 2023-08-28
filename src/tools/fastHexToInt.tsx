export function fastHexToInt(hex: string) {
  let val = 0;

  for (let i = 0; i < hex.length; i++) {
    const char = hex.charCodeAt(i);
    val *= 16;
    if (char >= 48 && char <= 57) val += char - 48; // 0-9
    else if (char >= 65 && char <= 70) val += char - 55; // A-F
    else if (char >= 97 && char <= 102) val += char - 87; // a-f
  }

  return val;
}
