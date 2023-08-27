import { useEffect, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[] | null>(null);

  const scrollCount = 10;
  const rowCount = 40;
  const colCount = 30;
  const maxHeight = "800px";

  const lightText = "#eaeaea";
  const bc = "#cecece";

  const totalRows = hexData ? Math.ceil(hexData.length / colCount) : 0;
  console.log("totalRows", totalRows);

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
      <div
        style={{
          display: "flex",
          maxHeight: "fit-content",
        }}
      >
        {hexData && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${colCount}, 24px) 24px`,
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
                    color: hex === "00" ? lightText : "#000",
                    borderRight: "1px solid" + bc,
                    borderBottom: "1px solid" + bc,
                    borderTop: idx < colCount ? "1px solid" + bc : "none",
                    borderLeft:
                      idx % colCount === 0 ? "1px solid" + bc : "none",
                    gridColumnStart: (idx % colCount) + 1,
                  }}
                >
                  {hex}
                </div>
              ))}
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div
                key={`line-${rowIndex}`}
                style={{
                  color: "#000",
                  gridColumnStart: colCount + 1,
                  gridRowStart: rowIndex + 1,
                  paddingLeft: "5px",
                }}
              >
                {offset * scrollCount + rowIndex + 1}
              </div>
            ))}
          </div>
        )}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Uploaded preview"
            style={{
              maxHeight,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
