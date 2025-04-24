import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const Dropzone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;

  &:hover {
    border-color: #646cff;
    background-color: #f8f9fa;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-top: 1rem;
`;

const ImageUploader = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  });

  return (
    <div>
      <Dropzone {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select</p>
      </Dropzone>
      {preview && <PreviewImage src={preview} alt="Preview" />}
    </div>
  );
};

export default ImageUploader;