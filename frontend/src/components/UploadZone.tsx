import { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

interface UploadZoneProps {
  accept: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  preview?: string;
}

const UploadZone = ({ accept, file, onFileSelect, preview }: UploadZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="glass-card rounded-2xl p-8 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-smooth cursor-pointer"
        >
          <label className="flex flex-col items-center gap-4 cursor-pointer">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="p-4 rounded-full bg-primary/10 text-primary"
            >
              <Upload className="w-8 h-8" />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-medium">Drop your file here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-6 space-y-4"
        >
          {preview && (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain bg-black/20"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onFileSelect(null)}
              className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadZone;
