import { useEffect, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[] | null>(null);

  const rowCount = 40;
  const colCount = 40;
  const scrollCount = 5;

  const [offset, setOffset] = useState(0);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
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
    }
  };

  useEffect(() => {
    // on scroll down of window
    const onScroll = (e: WheelEvent) => {
      // if scroll up increase offset
      if (e.deltaY > 0) {
        setOffset((prevOffset) => {
          return prevOffset + 1;
        });
      } else {
        setOffset((prevOffset) => {
          if (prevOffset === 0) return prevOffset;
          return prevOffset - 1;
        });
      }
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, []);

  return (
    <div className="App">
      <input type="file" onChange={handleImageChange} />
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Uploaded preview"
          style={{ maxWidth: "300px", marginTop: "20px" }}
        />
      )}
      {hexData && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${colCount}, 24px)`,
            marginTop: "20px",
          }}
        >
          {hexData
            .slice(
              offset * scrollCount * colCount,
              offset * scrollCount * colCount + rowCount * colCount
            )
            .map((hex, idx) => (
              <div
                key={idx}
                style={{
                  color: hex === "00" ? `#00000050` : "#000",
                }}
              >
                {hex}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
