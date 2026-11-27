import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { paymentsApi } from '../../features/payments/paymentsApi';

/**
 * ImageUpload Component
 *
 * Cloudinary-backed image uploader with preview and progress indicator.
 */
const ImageUpload = ({ onUploadSuccess, folder = 'venueaura/uploads', label = 'Upload Photo', initialImage = '' }) => {
  const [preview, setPreview] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    // Set local preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      setError(null);
      const res = await paymentsApi.uploadImage(file, folder);
      if (res?.url) {
        setPreview(res.url);
        if (onUploadSuccess) onUploadSuccess(res.url);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) onUploadSuccess('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-text uppercase tracking-wider">{label}</label>}

      <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-4 bg-neutral-50/50 flex flex-col items-center justify-center text-center">
        {preview ? (
          <div className="relative w-full h-44 rounded-xl overflow-hidden group">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 hover:bg-white text-text text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-lg shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Uploading to Cloudinary...
              </div>
            )}
          </div>
        ) : (
          <div
            className="cursor-pointer py-6 w-full flex flex-col items-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center mb-2">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
            </div>
            <p className="text-xs font-semibold text-text">Click to upload photo</p>
            <p className="text-[10px] text-text-muted mt-0.5">PNG, JPG or WEBP (Max 5MB)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
