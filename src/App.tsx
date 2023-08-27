import { useEffect, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hexData, setHexData] = useState<string[] | null>(null);

  const scrollCount = 10;
  const rowCount = 40;
  const colCount = 16;
  const maxHeight = "800px";

  const lightText = "#eaeaea";
  const bc = "#cecece";

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
          padding: "10px",
          gap: "10px",
        }}
      >
        {hexData && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `80px repeat(${colCount}, 24px)`,
            }}
          >
            <div
              className="sticky sticky-top"
              style={{
                border: `1px solid ${bc}`,
                textAlign: "center",
              }}
            >
              Address
            </div>
            {Array.from({ length: colCount }).map((_, colIndex) => (
              <div
                key={`header-${colIndex}`}
                className="sticky sticky-top"
                style={{
                  borderTop: `1px solid ${bc}`,
                  borderRight: `1px solid ${bc}`,
                  borderBottom: `1px solid ${bc}`,
                  textAlign: "center",
                }}
              >
                {colIndex.toString(16).padStart(2, "0").toUpperCase()}
              </div>
            ))}

            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div
                key={`line-${rowIndex}`}
                style={{
                  color: "#000",
                  gridColumnStart: 1,
                  gridRowStart: rowIndex + 2,
                  paddingLeft: "5px",
                  borderRight: "1px solid" + bc,
                  borderBottom: "1px solid" + bc,
                  borderLeft: `1px solid ${bc}`,
                }}
              >
                {(offset * scrollCount + rowIndex)
                  .toString(16)
                  .padStart(6, "0")
                  .toUpperCase()}
              </div>
            ))}
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
                    gridColumnStart: (idx % colCount) + 2, // +1 to adjust for address column
                  }}
                >
                  {hex}
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
