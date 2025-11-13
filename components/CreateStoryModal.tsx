import React, { useState, useRef } from 'react';
import { XMarkIcon, PhotoIcon } from '../constants';

interface CreateStoryModalProps {
  onClose: () => void;
  onCreate: (file: File) => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onCreate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onCreate(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary rounded-xl shadow-xl w-full max-w-md relative border border-border-color">
         <div className="flex justify-between items-center p-4 border-b border-border-color">
            <h2 className="text-xl font-bold text-text-primary">Add to Your Story</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {!previewUrl ? (
              <div 
                className="border-2 border-dashed border-border-color rounded-lg h-80 flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:bg-background-tertiary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoIcon className="w-16 h-16 text-text-secondary/50 mb-2"/>
                <p className="font-semibold">Select an image or video</p>
                <p className="text-sm">Content will disappear after 24 hours.</p>
              </div>
            ) : (
                <div className="w-full h-80 flex items-center justify-center bg-black rounded-lg overflow-hidden">
                    {file?.type.startsWith('image/') ? (
                        <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                        <video src={previewUrl} controls autoPlay muted className="max-h-full max-w-full" />
                    )}
                </div>
            )}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
          
          <div className="p-4 bg-background-secondary rounded-b-xl border-t border-border-color">
            <button 
              type="submit" 
              disabled={!file}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;