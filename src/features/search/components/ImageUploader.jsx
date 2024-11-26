// src/features/search/components/ImageUploader.jsx
import React from 'react';
import { Image, X } from 'lucide-react';

const ImageUploader = ({
  selectedImage,
  imageDescription,
  onImageSelect,
  onImageRemove
}) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  };

  if (!selectedImage) {
    return (
      <div
        onClick={() => document.getElementById('file-upload').click()}
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50"
      >
        <Image size={48} className="text-slate-400 mb-2" />
        <p className="text-sm text-slate-600">Click to upload an image</p>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="w-full max-h-64 object-contain rounded-lg"
        />
        <button
          onClick={onImageRemove}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>
      {imageDescription && (
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">{imageDescription}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;