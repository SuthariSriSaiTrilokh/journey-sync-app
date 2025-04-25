
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTrip } from '../../contexts/TripContext';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { useToast } from '../../hooks/use-toast';
import { Upload, Download, Trash2, MapPin, User } from 'lucide-react';

const Photos: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTrip, addPhoto } = useTrip();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Find the trip with the given ID
  const trip = tripId ? trips.find((t) => t.id === tripId) : currentTrip;

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create a preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile || !user) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // In a real app, you would upload the file to a server here
      // For this demo, we'll just use the file preview URL
      const newPhoto = {
        url: previewUrl || '',
        caption: caption,
        location: location,
        uploadedBy: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        date: new Date().toISOString(),
      };

      addPhoto(newPhoto);
      
      toast({
        title: 'Success',
        description: 'Photo uploaded successfully.',
      });
      
      // Reset form
      setCaption('');
      setLocation('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowUploadModal(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = (url: string, caption: string) => {
    // In a real app, you would create a direct download link
    const link = document.createElement('a');
    link.href = url;
    link.download = caption || 'tripmates-photo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Photo downloaded',
      description: 'The photo has been saved to your device.',
    });
  };

  const handleDelete = (photoId: string) => {
    // In a real app, you would delete the photo from the server
    toast({
      title: 'Feature not implemented',
      description: 'Photo deletion will be available soon.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">{trip.name} - Photos</h2>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center"
            >
              <Upload size={16} className="mr-2" />
              Upload Photo
            </button>
          </div>
          
          {trip.photos.length === 0 ? (
            <div className="p-6 text-center">
              <div className="py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera size={24} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
                <p className="text-gray-600 mb-6">Be the first to add photos to this trip!</p>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary flex items-center mx-auto"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trip.photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative h-48 sm:h-64">
                    <img 
                      src={photo.url} 
                      alt={photo.caption || 'Trip photo'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    {photo.caption && (
                      <p className="text-gray-800 font-medium mb-2">{photo.caption}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <User size={14} className="mr-1" />
                      <span>Captured by {photo.uploadedBy.name}</span>
                    </div>
                    
                    {photo.location && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin size={14} className="mr-1" />
                        <span>{photo.location}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-2">
                      <button 
                        onClick={() => handleDownload(photo.url, photo.caption || '')}
                        className="text-tripmates-blue hover:text-tripmates-darkBlue p-2"
                      >
                        <Download size={18} />
                      </button>
                      
                      {photo.uploadedBy.id === user?.id && (
                        <button 
                          onClick={() => handleDelete(photo.id)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Upload Photo</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                    Photo
                  </label>
                  
                  {previewUrl ? (
                    <div className="mt-1 relative h-48 rounded-md overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 text-gray-600 hover:text-gray-900"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-tripmates-blue hover:text-tripmates-darkBlue"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                    Caption
                  </label>
                  <input
                    id="caption"
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                    placeholder="Add a caption..."
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                    placeholder="Where was this taken?"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className={`btn-primary flex justify-center ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Photos;
