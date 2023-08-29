import { useEffect, useRef, useState } from "react";

interface ImagePreviewProps {
  imageSrc: string;
  onPixelClick: (hexPosition: number) => void;
  hexDataMaxLength: number;
}

const jpgHeader = 200 * 16;

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  onPixelClick,
  hexDataMaxLength,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = 1000;

  const canvasHexMaxLength = 1000 * 748 * 3;
  const ratio = (hexDataMaxLength - jpgHeader) / canvasHexMaxLength;

  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const newHeight = canvasWidth / aspectRatio;
        canvas.width = canvasWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, 0, 0, canvasWidth, newHeight);
      };
    }
  }, [imageSrc]);

  const handleCalculatePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const position = 3 * (Math.floor(y) * canvas.width + Math.floor(x));

      onPixelClick(position * ratio + jpgHeader);
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
