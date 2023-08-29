import { useEffect, useMemo, useState } from "react";
import { HexGridView } from "./components/HexGridView";
import { FileUploader } from "./components/FileUploader";
import { ImagePreview } from "./components/ImagePreview";
import { getIndex } from "./tools/getIndex";
import { fileFormatCodes } from "./fileFormatCodes";
import "./App.css";

export const scrollCount = 20;

const App = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[] | null>(null);
  const [offset, setOffset] = useState(0);

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

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);

    const hexReader = new FileReader();
    hexReader.onloadend = (e) => {
      if (e.target?.result) {
        setOffset(0);
        const buffer = e.target.result as ArrayBuffer;
        const hexArray = Array.from(new Uint8Array(buffer)).map((byte) =>
          byte.toString(16).padStart(2, "0")
        );
        setHexData(hexArray);
      }
    };
    hexReader.readAsArrayBuffer(file);
  };

  const handlePixelClick = (hexPosition: number) => {
    const row = Math.floor(hexPosition / 16) * 16;
    setOffset(row);
  };

  useEffect(() => {
    const onScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setOffset((prevOffset) => prevOffset + 16 * scrollCount);
      } else {
        setOffset((prevOffset) =>
          prevOffset <= 0 ? 0 : prevOffset - 16 * scrollCount
        );
      }
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, []);

  return (
    <div className="App">
      <FileUploader onFileChange={handleFile} />
      <div
        style={{
          display: "flex",
          maxHeight: "fit-content",
          padding: "10px",
          gap: "10px",
        }}
      >
        {hexData && <HexGridView hexData={hexData} offset={offset} />}
        {imageSrc && (
          <ImagePreview
            imageSrc={imageSrc}
            onPixelClick={handlePixelClick}
            hexDataMaxLength={hexData?.length || 0}
          />
        )}
      </div>
    </div>
  );
};

export default App;
