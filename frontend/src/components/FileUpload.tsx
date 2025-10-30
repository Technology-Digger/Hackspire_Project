import { Upload, X, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const FileUpload = ({
  accept,
  icon,
  title,
  description,
}: {
  accept: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [insight, setInsight] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // detect backend endpoint dynamically
  const endpoint =
    accept.includes("image") ? "image-insights" : "audio-insights";

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append(endpoint.includes("image") ? "image" : "audio", file);

      // call backend
      const res = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      setProgress(50);

      if (!res.ok) throw new Error("Backend request failed");
      const data = await res.json();
      setProgress(100);
      setUploadComplete(true);
      setInsight(data.text || "No insights returned");

      console.log("✅ Insight:", data);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Failed to analyze file. Make sure backend is running on port 8000.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const clearFile = () => {
    setFile(null);
    setInsight(null);
    setUploadComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <motion.div
      className="glass-panel p-8 rounded-3xl h-full flex flex-col"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-primary">{icon}</div>
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all flex-1 
        flex items-center justify-center min-h-[200px]
        ${isDragging ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50"}
        ${isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          disabled={isLoading}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-3">
                <p className="text-foreground font-medium">{file.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="no-file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-3"
            >
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-foreground font-medium">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports: {accept.split(",").join(", ")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            {progress < 30 && "Uploading file..."}
            {progress >= 30 && progress < 60 && "Processing with AI..."}
            {progress >= 60 && progress < 100 && "Generating insights..."}
            {progress === 100 && "Complete!"}
          </p>
        </motion.div>
      )}

      {/* Success message */}
      {uploadComplete && insight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center text-primary"
        >
          <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground italic">{insight}</p>
        </motion.div>
      )}

      {/* Analyze button */}
      {file && !isLoading && !uploadComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Button variant="hero" className="w-full" size="lg" onClick={handleAnalyze}>
            Analyze with AI
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
