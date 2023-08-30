export const fileFormatCodes: {
  types: string[];
  codes: {
    title: string;
    match: string[];
    highlightOnly?: boolean;
  }[];
}[] = [
  {
    types: ["jpg", "jpeg"],
    codes: [
      {
        title: "Start of image",
        match: ["ff", "d8"],
      },
      {
        title: "Application marker",
        match: ["ff", "e0"],
      },
      {
        title: "Quantization table",
        match: ["ff", "db"],
      },
      {
        title: "Start of frame",
        match: ["ff", "c0"],
      },
      {
        title: "Huffman table",
        match: ["ff", "c4"],
      },
      {
        title: "Start of scan",
        match: ["ff", "da"],
      },
      {
        title: "End of image",
        match: ["ff", "d9"],
      },
      {
        title: "Bad Escape",
        match: ["ff", "!00"],
        // highlightOnly: true,
      },
    ],
  },
];
