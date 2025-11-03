import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import axios from "axios";
import type { FeatureType } from "./Dashboard";

interface FeatureWorkspaceProps {
  featureType: FeatureType;
  onClose: () => void;
}

const API_BASE_URL = "https://technology-digger-data-decoder-backend.hf.space";

export const FeatureWorkspace = ({ featureType, onClose }: FeatureWorkspaceProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) return;

      const validTypes = {
        image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
        video: ["video/mp4", "video/webm", "video/quicktime"],
      };

      if (featureType && !validTypes[featureType].includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: `Please upload a valid ${featureType} file.`,
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);

      // Preview for image/video
      if (featureType === "image" || featureType === "video") {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(selectedFile.name);
      }
    },
    [featureType, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    },
    [handleFileChange]
  );

  const handleGenerate = async () => {
    if (!file || !featureType) return;

    setIsLoading(true);
    setInsights(null);

    try {
      const formData = new FormData();
      formData.append(featureType, file); // ✅ fixed key (was "file")

      const endpoint = `${API_BASE_URL}/${featureType}-insights`;
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🧠 smartly pick best available response field
      const result =
        response.data.text ||
        response.data.summary ||
        response.data.insights ||
        "Analysis complete!";

      // ✨ typewriter effect
      let currentText = "";
      for (let i = 0; i < result.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentText += result[i];
        setInsights(currentText);
      }

      toast({
        title: "Success!",
        description: "Insights generated successfully.",
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setInsights(null);
  };

  const getTitle = () => {
    const titles = {
      image: "Image Analysis",
      audio: "Audio Processing",
      video: "Video Intelligence",
    };
    return featureType ? titles[featureType] : "";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.05),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onClose} className="group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold gradient-text">{getTitle()}</h1>
          <ThemeToggle />
        </div>

        {/* Main workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`glass-card p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isDragging ? "border-primary bg-primary/5 scale-105" : "border-border"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Upload
                  className={`w-16 h-16 ${
                    isDragging ? "text-primary animate-bounce" : "text-muted-foreground"
                  }`}
                />
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">
                    {isDragging ? "Drop your file here" : "Drag & drop your file"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      className="hidden"
                      accept={
                        featureType === "image"
                          ? "image/*"
                          : featureType === "audio"
                          ? "audio/*"
                          : "video/*"
                      }
                    />
                    <Button variant="default" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Preview */}
            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-card p-6 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Preview</h3>
                    <Button variant="ghost" size="icon" onClick={handleReset}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {featureType === "image" && preview && (
                    <img src={preview} alt="Preview" className="w-full rounded-lg" />
                  )}
                  {featureType === "video" && preview && (
                    <video src={preview} controls className="w-full rounded-lg" />
                  )}
                  {featureType === "audio" && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-2">Audio file loaded:</p>
                      <p className="font-medium">{file?.name}</p>
                    </div>
                  )}
                  <Button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Insights
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Insights Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Insights
            </h3>

            <div className="min-h-[400px] relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Analyzing your data...</p>
                  </div>
                </div>
              )}

              {insights && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-invert max-w-none"
                >
                  <p className="text-foreground whitespace-pre-wrap">{insights}</p>
                </motion.div>
              )}

              {!insights && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <p className="text-muted-foreground">
                    Upload a file and click "Generate Insights" to see AI analysis
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
