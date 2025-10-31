import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, Star, Camera } from 'lucide-react';
import ArtistImageUpload from './ArtistImageUpload';

const ArtistProfile = ({ artistId, artistName, isAdmin = false }) => {
  const [images, setImages] = useState([]);
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryLabels = {
    profile: 'Profile Picture',
    stage: 'On Stage',
    studio: 'In Studio',
    fans: 'With Fans',
    behind_scenes: 'Behind the Scenes',
    other: 'Other'
  };

  const categoryIcons = {
    profile: Star,
    stage: Camera,
    studio: Camera,
    fans: Camera,
    behind_scenes: Camera,
    other: ImageIcon
  };

  useEffect(() => {
    fetchImages();
  }, [artistId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/get-artist-images.php?artist_id=${artistId}`);
      const result = await response.json();

      if (result.success) {
        setImages(result.data.images);
        setImagesByCategory(result.data.images_by_category);
        setProfilePicture(result.data.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/delete-artist-image.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: imageId })
      });

      const result = await response.json();

      if (result.success) {
        fetchImages();
      } else {
        alert('Failed to delete image: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const handleImagesUploaded = () => {
    setShowUpload(false);
    fetchImages();
  };

  const getFilteredImages = () => {
    if (selectedCategory === 'all') {
      return images;
    }
    return imagesByCategory[selectedCategory] || [];
  };

  const getCategoryCount = (category) => {
    return imagesByCategory[category]?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {profilePicture && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
          <div className="relative inline-block">
            <img
              src={`/${profilePicture.filepath}`}
              alt={profilePicture.alt_text}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
            />
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1">
              <Star className="h-4 w-4" />
            </div>
          </div>
          {profilePicture.description && (
            <p className="text-sm text-gray-600 mt-2">{profilePicture.description}</p>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Manage Images</h3>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>{showUpload ? 'Cancel' : 'Add Images'}</span>
            </button>
          </div>

          {showUpload && (
            <ArtistImageUpload
              artistId={artistId}
              onImagesUploaded={handleImagesUploaded}
            />
          )}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Gallery</h3>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({images.length})
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key];
            const count = getCategoryCount(key);
            if (count === 0) return null;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 ${
                  selectedCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label} ({count})</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {getFilteredImages().map((image) => {
            const Icon = categoryIcons[image.category];
            return (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={`/${image.filepath}`}
                    alt={image.alt_text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {isAdmin && (
                      <button
                        onClick={() => handleImageDelete(image.id)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="absolute top-2 left-2">
                  <div className="flex items-center space-x-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                    <Icon className="h-3 w-3" />
                    <span>{categoryLabels[image.category]}</span>
                  </div>
                </div>

                {image.is_profile_picture && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-blue-600 text-white p-1 rounded-full">
                      <Star className="h-3 w-3" />
                    </div>
                  </div>
                )}

                {image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
                    <p className="text-xs truncate">{image.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {getFilteredImages().length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="mx-auto h-12 w-12 mb-4" />
            <p>No images found for this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;