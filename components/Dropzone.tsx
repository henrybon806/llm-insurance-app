import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import './dropzoneStyles.css';

export function Dropzone({ onDrop }: { onDrop: (files: File[]) => void }) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="dropzone"
    >
      <input className='input' {...getInputProps()} />
      {isDragActive ? (
        <p>Drop files here...</p>
      ) : (
        <p>Drag & drop .pdf, .docx, or .txt files here</p>
      )}
    </div>
  );
}