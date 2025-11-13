import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { XMarkIcon } from '../constants';

interface EditProfileModalProps {
    currentUser: User;
    onClose: () => void;
    onUpdate: (data: {
        name: string;
        bio: string;
        musicUrl: string;
        avatarFile?: File;
        coverFile?: File;
    }) => void;
}

const ImageInput: React.FC<{ label: string; currentImageUrl?: string; onFileChange: (file: File) => void; }> = ({ label, currentImageUrl, onFileChange }) => {
    const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
            onFileChange(file);
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-background-tertiary overflow-hidden flex-shrink-0">
                    {preview && <img src={preview} alt="Preview" className="w-full h-full object-cover" />}
                </div>
                <button type="button" onClick={() => inputRef.current?.click()} className="text-sm bg-background-tertiary hover:bg-border-color text-text-primary font-semibold py-1 px-3 rounded-md transition-colors">
                    Change
                </button>
            </div>
            <input type="file" ref={inputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
    );
}


const EditProfileModal: React.FC<EditProfileModalProps> = ({ currentUser, onClose, onUpdate }) => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [musicUrl, setMusicUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | undefined>();
    const [coverFile, setCoverFile] = useState<File | undefined>();
    const [coverPreview, setCoverPreview] = useState<string | undefined>(currentUser.coverPhoto);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(currentUser.name);
        setBio(currentUser.bio || '');
        setMusicUrl(currentUser.profileMusicUrl || '');
    }, [currentUser]);

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverPreview(URL.createObjectURL(file));
            setCoverFile(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ name, bio, musicUrl, avatarFile, coverFile });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-background-secondary rounded-xl shadow-xl w-full max-w-lg relative animate-fade-in-up border border-border-color">
                <button onClick={onClose} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary z-10">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-center p-4 border-b border-border-color text-text-primary">Edit Profile</h2>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Cover Photo</label>
                            <div 
                                className="h-32 rounded-md bg-background-tertiary bg-cover bg-center relative cursor-pointer group"
                                style={{backgroundImage: `url(${coverPreview})`}}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                                    <p className="text-white font-semibold opacity-0 group-hover:opacity-100">Change Cover</p>
                                </div>
                            </div>
                            <input type="file" ref={coverInputRef} accept="image/*" className="hidden" onChange={handleCoverFileChange}/>
                        </div>

                        <ImageInput label="Profile Picture" currentImageUrl={currentUser.avatar} onFileChange={setAvatarFile} />
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-1 bg-background-tertiary border-border-color rounded-md p-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-text-secondary">Bio</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full mt-1 bg-background-tertiary border-border-color rounded-md p-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>

                        <div>
                            <label htmlFor="music" className="block text-sm font-medium text-text-secondary">Profile Music URL</label>
                            <input
                                id="music"
                                type="text"
                                value={musicUrl}
                                onChange={(e) => setMusicUrl(e.target.value)}
                                placeholder="e.g., https://example.com/song.mp3"
                                className="w-full mt-1 bg-background-tertiary border-border-color rounded-md p-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-background-primary/50 rounded-b-xl flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-background-tertiary hover:bg-border-color text-text-primary font-bold py-2 px-4 rounded-lg transition-opacity">
                            Cancel
                        </button>
                        <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-opacity">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;