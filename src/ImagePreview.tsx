interface ImagePreviewProps {
  imageSrc: string;
}
export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc }) => {
  const maxHeight = "800px";
  return <img src={imageSrc} alt="Uploaded preview" style={{ maxHeight }} />;
};
