import React, { useState, useRef } from 'react';
import { XMarkIcon } from '../constants';

interface CreatePostModalProps {
  onClose: () => void;
  onCreate: (caption: string, file: File) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onCreate }) => {
  const [caption, setCaption] = useState('');
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
      onCreate(caption, file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary rounded-xl shadow-xl w-full max-w-lg relative animate-fade-in-up border border-border-color">
        <button onClick={onClose} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center p-4 border-b border-border-color text-text-primary">Create New Post</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {!previewUrl ? (
              <div 
                className="border-2 border-dashed border-border-color rounded-lg h-64 flex flex-col items-center justify-center text-text-secondary cursor-pointer hover:bg-background-tertiary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <p>Click to select an image or video</p>
                <p className="text-sm">Max file size: 50MB</p>
              </div>
            ) : (
                <div className="w-full h-64 flex items-center justify-center bg-black rounded-lg overflow-hidden">
                    {file?.type.startsWith('image/') ? (
                        <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                        <video src={previewUrl} controls className="max-h-full max-w-full" />
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

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={4}
              className="w-full mt-4 bg-background-tertiary border-border-color rounded-lg p-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div className="p-4 bg-background-primary/50 rounded-b-xl">
            <button 
              type="submit" 
              disabled={!file}
              className="w-full bg-gradient-to-r from-accent to-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;