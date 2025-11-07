import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleGalleryUploadProps {
  onImagesUploaded?: () => void;
  maxFiles?: number;
  galleryId?: number | null;
}

const SimpleGalleryUpload = ({ onImagesUploaded, maxFiles = 50, galleryId = null }: SimpleGalleryUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type?: 'success' | 'error'; message?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (selectedFiles.length + imageFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (selectedFiles.length + imageFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus({ type: 'error', message: 'Please select at least one image to upload' });
      return;
    }

    setUploading(true);
    setUploadStatus({});
    const formData = new FormData();
    
    // Append files - simple upload, no categories
    selectedFiles.forEach((file) => {
      formData.append('images[]', file);
      formData.append('categories[]', 'other'); // Default category
      formData.append('descriptions[]', ''); // No description
    });
    
    // Add gallery_id if provided
    if (galleryId !== null && galleryId !== undefined) {
      formData.append('gallery_id', galleryId.toString());
    }

    try {
      const response = await fetch('/api/upload-gallery-images.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus({ 
          type: 'success', 
          message: `${result.uploaded_count} image${result.uploaded_count !== 1 ? 's' : ''} uploaded successfully!` 
        });
        setSelectedFiles([]);
        if (onImagesUploaded) {
          onImagesUploaded();
        }
      } else {
        const errorMsg = result.message || result.debug || 'Upload failed';
        setUploadStatus({ type: 'error', message: errorMsg });
        console.error('Upload error:', result);
      }
    } catch (error) {
      console.error('Upload error caught:', error);
      setUploadStatus({ 
        type: 'error', 
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-electric-blue transition-colors cursor-pointer bg-black/20"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-white/50 mb-4" />
        <p className="text-lg font-medium text-white mb-2">
          Drop images here or click to select
        </p>
        <p className="text-sm text-white/70">
          Select multiple images (up to {maxFiles} files)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Selected Images ({selectedFiles.length})
            </h3>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-sm text-white/70 hover:text-white"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xs text-white/70 mt-1 truncate" title={file.name}>
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={uploadImages}
              disabled={uploading || selectedFiles.length === 0}
              className="px-6 py-2 bg-electric-blue text-deep-purple rounded-lg hover:bg-electric-blue/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-deep-purple"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploadStatus.message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          uploadStatus.type === 'success' 
            ? 'bg-green-500/20 text-green-200 border border-green-500/50' 
            : 'bg-red-500/20 text-red-200 border border-red-500/50'
        }`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}
    </div>
  );
};

export default SimpleGalleryUpload;

