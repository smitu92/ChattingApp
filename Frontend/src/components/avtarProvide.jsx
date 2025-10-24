// src/components/AvatarUploader.jsx
import React, { useState, useRef } from 'react';
import '../../../index.css';

const AvatarUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
    }
  };

  const handlePrimaryButtonClick = () => {
    if (file && !isUploading) {
      // If a file is selected and not uploading, perform the upload
      setIsUploading(true);
      const uploadInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(uploadInterval);
            setIsUploading(false);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 200);
    } else {
      // Otherwise, open the file selector
      fileInputRef.current.click();
    }
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getButtonText = () => {
    if (isUploading) {
      return `Uploading...`;
    }
    return file ? 'Upload' : 'Add';
  };

  return (
    <div className="avatar-uploader-container">
      {/* The main circular file drop area */}
      <div className="file-drop-area">
        <svg className="absolute w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#E0E0E0"
            strokeWidth="10"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#6B9080"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>

        {/* Content inside the circle */}
        <div className="flex flex-col items-center justify-center text-center p-4">
          {isUploading ? (
            <p className="progress-text">{progress}%</p>
          ) : (
            <p className="upload-text">
              {file ? 'File ready to upload' : 'Drag and drop your avatar here.'}
            </p>
          )}
        </div>
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*"
        className="hidden" 
      />
      
      {/* The single primary button below the circle */}
      <button
        onClick={handlePrimaryButtonClick}
        className="mt-6 px-8 py-3 bg-[#6B9080] text-white font-bold rounded-full shadow-lg hover:bg-[#3A5243] transition-colors"
      >
        {getButtonText()}
      </button>

      {/* Placeholder for optional actions */}
      {file && !isUploading && (
        <button className="change-file-button">
          Change image
        </button>
      )}
      {file && !isUploading && (
        <button className="change-file-button">
          Crop image
        </button>
      )}
    </div>
  );
};

export default AvatarUploader;