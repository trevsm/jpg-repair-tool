import { useEffect, useState } from "react";
import { HexGridView, rowCount } from "./components/HexGridView";
import { FileUploader } from "./components/FileUploader";
import { ImagePreview } from "./components/ImagePreview";
import { get16 } from "./tools/misc";
import "./App.css";

export const scrollCount = 5;

const magicNumbers = {
  jpeg: ["ff", "d8", "ff"],
  png: ["89", "50", "4e", "47"],
};

const identifyFileType = (hexArray: string[]) => {
  for (const [type, signature] of Object.entries(magicNumbers)) {
    if (signature.every((byte, index) => hexArray[index] === byte)) {
      return type;
    }
  }
  return "unknown";
};

const App = () => {
  const [fileType, setFileType] = useState<string | null>(null);
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

      newOffset = get16(newOffset);
      const maxOffset = get16(hexData.length) - rowCount * 16;

      return Math.max(0, Math.min(newOffset, maxOffset));
    });
  };

  const handleFile = (file: File) => {
    const hexReader = new FileReader();
    hexReader.onloadend = (e) => {
      if (e.target?.result) {
        setOffset(0);
        const buffer = e.target.result as ArrayBuffer;
        const hexArray = Array.from(new Uint8Array(buffer)).map((byte) =>
          byte.toString(16).padStart(2, "0")
        );
        const identifiedType = identifyFileType(hexArray);

        setFileType(identifiedType);
        setHexData(hexArray);
      }
    };
    hexReader.readAsArrayBuffer(file);
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
            setHexData={setHexData}
            fileType={fileType || ""}
          />
        )}
        {hexData && (
          <ImagePreview
            hexData={hexData}
            onPixelClick={handleSetOffset}
            hexDataMaxLength={hexData?.length || 0}
          />
        )}
      </div>
    </div>
  );
};

export default App;
