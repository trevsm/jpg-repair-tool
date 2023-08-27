interface FileUploaderProps {
  onFileChange: (file: File) => void;
}
export const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      onFileChange(file);
    }
  };

  return <input type="file" onChange={handleImageChange} />;
};
