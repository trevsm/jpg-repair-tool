export const fileFormatCodes: {
  types: string[];
  codes: {
    title: string;
    match: string[];
    highlightOnly?: boolean;
    color?: string;
  }[];
}[] = [
  {
    types: ["jpg", "jpeg"],
    codes: [
      {
        title: "Bad Escape",
        color: "#FF0000", // Bright red
        match: ["ff", "!00"],
      },
      {
        title: "Good Escape",
        match: ["ff", "00"],
        highlightOnly: true,
        color: "#0000FF", // Bright blue
      },
      {
        title: "Start of Image",
        match: ["ff", "d8"],
        color: "#FF9900", // Vivid orange
      },
      {
        title: "Application Marker",
        match: ["ff", "e0"],
        color: "#FFFF00", // Bright yellow
      },
      {
        title: "APP1",
        match: ["ff", "e1"],
        color: "#00FF00", // Bright green
      },
      {
        title: "APP2",
        match: ["ff", "e2"],
        color: "#00CC66", // Emerald green
      },
      {
        title: "DQT (Define Quantization Table)",
        match: ["ff", "db"],
        color: "#FF66FF", // Bright pink
      },
      {
        title: "SOF0 (Start of Frame, Baseline DCT)",
        match: ["ff", "c0"],
        color: "#33CCFF", // Cyan
      },
      {
        title: "DHT (Define Huffman Table)",
        match: ["ff", "c4"],
        color: "#FF33CC", // Magenta
      },
      {
        title: "SOS (Start of Scan)",
        match: ["ff", "da"],
        color: "#3366FF", // Royal blue
      },
      {
        title: "EOI (End of Image)",
        match: ["ff", "d9"],
        color: "#9933FF", // Bright purple
      },
      {
        title: "COM (Comment)",
        match: ["ff", "fe"],
        color: "#FF3399", // Dark pink
      },
      {
        title: "DRI (Define Restart Interval)",
        match: ["ff", "dd"],
        color: "#CCCCCC", // Silver
      },
      {
        title: "RSTn (Restart)",
        match: ["ff", "d0-ff", "d7"], // RST0 to RST7
        color: "#CC6600", // Dark orange
      },
      {
        title: "SOF2 (Progressive DCT)",
        match: ["ff", "c2"],
        color: "#FF99CC", // Pastel pink
      },
      {
        title: "JFIF Marker",
        match: ["4a", "46", "49", "46", "00"], // ASCII for JFIF followed by null byte
        color: "#66FFCC", // Teal
      },
    ],
  },
  {
    types: ["png"],
    codes: [
      {
        title: "PNG Signature",
        match: ["89", "50", "4e", "47", "0d", "0a", "1a", "0a"],
        color: "#FF9900", // Vivid orange
      },
      {
        title: "IHDR",
        match: ["49", "48", "44", "52"], // ASCII for IHDR
        color: "#FF0000", // Bright red
      },
      {
        title: "PLTE",
        match: ["50", "4c", "54", "45"], // ASCII for PLTE
        color: "#00FF00", // Bright green
      },
      {
        title: "IDAT",
        match: ["49", "44", "41", "54"], // ASCII for IDAT
        color: "#0000FF", // Bright blue
      },
      {
        title: "IEND",
        match: ["49", "45", "4e", "44"], // ASCII for IEND
        color: "#9933FF", // Bright purple
      },
      {
        title: "tEXt",
        match: ["74", "45", "58", "74"], // ASCII for tEXt
        color: "#FF33CC", // Magenta
      },
      {
        title: "iTXt",
        match: ["69", "54", "58", "74"], // ASCII for iTXt
        color: "#FF66FF", // Bright pink
      },
      {
        title: "zTXt",
        match: ["7a", "54", "58", "74"], // ASCII for zTXt
        color: "#33CCFF", // Cyan
      },
      {
        title: "gAMA",
        match: ["67", "41", "4d", "41"], // ASCII for gAMA
        color: "#CC6600", // Dark orange
      },
      {
        title: "cHRM",
        match: ["63", "48", "52", "4d"], // ASCII for cHRM
        color: "#66FFCC", // Teal
      },
      {
        title: "sRGB",
        match: ["73", "52", "47", "42"], // ASCII for sRGB
        color: "#3366FF", // Royal blue
      },
      {
        title: "iCCP",
        match: ["69", "43", "43", "50"], // ASCII for iCCP
        color: "#FFFF00", // Bright yellow
      },
    ],
  },
];
