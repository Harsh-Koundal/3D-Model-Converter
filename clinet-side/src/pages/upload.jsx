import React, { useState } from 'react';
import { Upload, X, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImageUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Please select a JPG, JPEG, or PNG image');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setSuccess(false);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5025/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadedImage(data.data);
        setSuccess(true);
        setError(null);
      } else {
        setError(data.message || 'Failed to upload image');
        setSuccess(false);
      }
      navigate(`/view/${data.id}`);
    } catch (err) {
      setError('Network error: Unable to upload image');
      setSuccess(false);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImage(null);
    setError(null);
    setSuccess(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <ImageIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Image
            </h1>
            <p className="text-gray-600">
              Upload your image to Cloudinary storage
            </p>
          </div>

          {/* Upload Area */}
          {!previewUrl && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop your image here, or
              </p>
              <label className="inline-block">
                <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                  Browse Files
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: JPG, JPEG, PNG (Max 5MB)
              </p>
            </div>
          )}

          {/* Preview Area */}
          {previewUrl && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-gray-50"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedFile && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">File name:</span> {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">File size:</span>{' '}
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {!uploadedImage && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium" 
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              )}
            </div>
          )}

          {/* Success Message */}
          {success && uploadedImage && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-800 font-medium">
                  Image uploaded successfully!
                </p>
                <p className="text-sm text-green-700 mt-1 break-all">
                  URL: {uploadedImage.url}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Another Button */}
          {uploadedImage && (
            <button
              onClick={handleRemove}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Upload Another Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}