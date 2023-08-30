import { useEffect, useRef, useState } from "react";
import hexDataToDataURL from "../tools/hexDataToDataURL";

interface ImagePreviewProps {
  hexData: string[];
  onPixelClick: (hexPosition: number) => void;
  hexDataMaxLength: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  hexData,
  onPixelClick,
  hexDataMaxLength,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = 1000;

  const canvasHexMaxLength = canvasRef.current
    ? canvasWidth * canvasRef.current?.height * 3
    : 0;

  const ratio = hexDataMaxLength / canvasHexMaxLength;

  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dataURL = hexDataToDataURL(hexData);
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const newHeight = canvasWidth / aspectRatio;
      canvas.width = canvasWidth;
      canvas.height = newHeight;

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear existing canvas
      ctx.drawImage(img, 0, 0, canvasWidth, newHeight); // draw new image
    };
  }, [hexData]);

  const handleCalculatePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const position = 3 * (Math.ceil(y) * canvas.width + Math.ceil(x));

      onPixelClick(position * ratio);
    }
  };

  useEffect(() => {
    const onMouseDown = () => setMouseDown(true);
    const onMouseUp = () => setMouseDown(false);

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div style={{ width: canvasWidth }}>
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          if (mouseDown) handleCalculatePosition(e);
        }}
        onClick={handleCalculatePosition}
      />
    </div>
  );
};
