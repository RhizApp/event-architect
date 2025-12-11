"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface AssetUploadProps {
  label: string;
  name: string;
  description?: string;
}

export function AssetUpload({ label, name, description }: AssetUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to S3/Blob here.
      // For now, use local object URL for preview and base64 for submission if needed, 
      // or just assume the form action handles the file input directly.
      // Since we are using a Server Action with FormData, the file input itself works!
      setPreview(URL.createObjectURL(file));
    }
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-white block">{label}</label>
        {preview && (
            <button type="button" onClick={clear} className="text-xs text-red-400 hover:text-red-300">
                Remove
            </button>
        )}
      </div>
      
      <div 
        onClick={() => inputRef.current?.click()}
        className={`
          relative h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
          ${preview ? 'border-brand-500/50 bg-black' : 'border-surface-700 bg-surface-900/30 hover:border-surface-500 hover:bg-surface-800'}
        `}
      >
        <input 
            ref={inputRef}
            type="file" 
            name={name}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
        />

        {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-surface-500 group-hover:text-surface-300 transition-colors">
                <Upload size={24} className="mb-2" />
                <span className="text-xs">Click to upload</span>
            </div>
        )}
      </div>
      
      {description && <p className="text-xs text-surface-500">{description}</p>}
    </div>
  );
}
