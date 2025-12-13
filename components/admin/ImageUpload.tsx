'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Link } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null, preview: string) => void;
  label?: string;
  helpText?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Görsel',
  helpText = 'PNG, JPG, WEBP - Max 10MB',
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState(value || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file, previewUrl);
      setShowUrlInput(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim());
      onChange(null, urlInput.trim());
      setShowUrlInput(false);
      setUrlInput('');
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange(null, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={() => {
              // Görsel yüklenemezse placeholder göster
              setPreview('');
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-100"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Kaldır
            </button>
          </div>
        </div>
      ) : showUrlInput ? (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 text-sm"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
            >
              Ekle
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-xl hover:border-primary/50 transition-colors">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 flex flex-col items-center justify-center gap-2"
          >
            <Upload size={28} className="text-slate-400" />
            <span className="text-sm text-slate-500">Görsel Seç</span>
            <span className="text-xs text-slate-400">{helpText}</span>
          </button>
          <div className="border-t border-slate-200 px-4 py-3 flex justify-center">
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-sm text-slate-500 hover:text-primary flex items-center gap-1"
            >
              <Link size={14} />
              veya URL ile ekle
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
