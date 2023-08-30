export default function hexDataToDataURL(hexData: string[]): string {
  const binary = hexData
    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
    .join("");
  const base64 = window.btoa(binary);
  return `data:image/jpeg;base64,${base64}`;
}
