import { useEffect, useState } from "react";
import { HexGridView } from "./HexGridView";
import { FileUploader } from "./FileUploader";
import { ImagePreview } from "./ImagePreview";

import "./App.css";

const App = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[] | null>(null);
  const [offset, setOffset] = useState(0);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);

    const hexReader = new FileReader();
    hexReader.onloadend = (e) => {
      if (e.target?.result) {
        const buffer = e.target.result as ArrayBuffer;
        const hexArray = Array.from(new Uint8Array(buffer)).map((byte) =>
          byte.toString(16).padStart(2, "0")
        );
        setHexData(hexArray);
      }
    };
    hexReader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const onScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setOffset((prevOffset) => prevOffset + 1);
      } else {
        setOffset((prevOffset) =>
          prevOffset === 0 ? prevOffset : prevOffset - 1
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
        {imageSrc && <ImagePreview imageSrc={imageSrc} />}
      </div>
    </div>
  );
};

export default App;
