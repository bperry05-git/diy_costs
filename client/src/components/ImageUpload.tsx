import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  onImageUpload: (base64: string) => void;
  onError: (message: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - matching server limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export default function ImageUpload({ onImageUpload, onError }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. The image will be compressed automatically.`);
      return true; // Still return true as we'll compress it
    }

    return true;
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!validateFile(file)) {
        event.target.value = "";
        return;
      }

      try {
        setIsCompressing(true);
        const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
        console.log('Original file size:', file.size / 1024 / 1024, 'MB');
        console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');

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

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
        onError("Failed to compress image. Please try uploading a smaller image or a different format.");
        setPreview(null);
      } finally {
        setIsCompressing(false);
      }
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
              {isCompressing ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
                  <p className="text-sm text-muted-foreground">Compressing image...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG or WebP (MAX. 10MB)
                  </p>
                </>
              )}
            </div>
          )}
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isCompressing}
          />
        </label>
      </div>
    </div>
  );
}
