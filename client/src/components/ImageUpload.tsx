import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (base64: string) => void;
  onError: (message: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({ onImageUpload, onError }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!validateFile(file)) {
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const base64 = reader.result as string;
          setPreview(base64);
          onImageUpload(base64.split(",")[1]);
        } catch (error) {
          onError("Failed to process image. Please try again.");
          setPreview(null);
        }
      };

      reader.onerror = () => {
        onError("Failed to read image file. Please try again.");
        setPreview(null);
      };

      reader.readAsDataURL(file);
    },
    [onImageUpload, onError]
  );

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 relative"
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG or WebP (MAX. 5MB)
              </p>
            </div>
          )}
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
