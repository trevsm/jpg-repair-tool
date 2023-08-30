import { useEffect, useState } from "react";
import { HexGridView } from "./components/HexGridView";
import { FileUploader } from "./components/FileUploader";
import { ImagePreview } from "./components/ImagePreview";
import "./App.css";

export const scrollCount = 5;

const App = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[] | null>(null);
  const [offset, setOffset] = useState(0);

  const handleSetOffset = (setter: number | ((prev: number) => number)) => {
    setOffset((prevOffset) => {
      if (!hexData) return 0;

      let newOffset: number;

      if (typeof setter === "function") {
        newOffset = setter(prevOffset);
      } else {
        newOffset = setter;
      }

      newOffset = Math.floor(newOffset / 16) * 16;

      return Math.max(0, Math.min(newOffset, hexData.length - 40 * 16));
    });
  };

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
      if (!hexData) return;
      if (e.deltaY > 0) {
        handleSetOffset((prevOffset) => prevOffset + 16 * scrollCount);
      } else {
        handleSetOffset((prevOffset) => prevOffset - 16 * scrollCount);
      }
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, [hexData]);

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
        {hexData && (
          <HexGridView
            hexData={hexData}
            offset={offset}
            setOffset={handleSetOffset}
          />
        )}
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
