
import React from 'react';
import { Download, Trash2 } from 'lucide-react';

const PhotoGrid = ({ photos, onDelete, onDownload }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.url}
            alt={photo.caption || 'Trip photo'}
            className="w-full h-64 object-cover rounded-lg"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="font-medium">{photo.caption}</p>
              <p className="text-sm opacity-75">By {photo.uploadedBy}</p>
              
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => onDownload(photo)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Download size={16} className="text-white" />
                </button>
                
                {photo.canDelete && (
                  <button
                    onClick={() => onDelete(photo)}
                    className="p-2 rounded-full bg-red-500/60 hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
