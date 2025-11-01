import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import UploadZone from "./UploadZone";
import axios from "axios";

interface InsightCardProps {
  title: string;
  icon: React.ReactNode;
  accept: string;
  endpoint: string;
  resultLabel: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const InsightCard = ({ title, icon, accept, endpoint, resultLabel }: InsightCardProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setResult("");

    if (selectedFile && accept.includes("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview("");
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();

      // ✅ match backend parameter name
      let fieldName = "file";
      if (endpoint.includes("image")) fieldName = "image";
      else if (endpoint.includes("audio")) fieldName = "audio";
      else if (endpoint.includes("video")) fieldName = "video";

      formData.append(fieldName, file);

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Backend Response:", response.data);

      // ✅ handle different backend keys
      setResult(
        response.data.text ||
        response.data.transcript_snippet ||
        response.data.summary ||
        "No result returned"
      );

      toast({
        title: "Success!",
        description: "Analysis completed successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview("");
    setResult("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 space-y-6 hover:shadow-neon-blue transition-smooth"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-neon text-white">
          {icon}
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <UploadZone
        accept={accept}
        file={file}
        onFileSelect={handleFileSelect}
        preview={preview}
      />

      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!file || loading}
          className="flex-1 bg-gradient-neon hover:shadow-neon-blue transition-smooth font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
        {file && (
          <Button
            onClick={handleClear}
            variant="outline"
            className="border-border/50 hover:border-destructive hover:text-destructive transition-smooth"
          >
            Clear
          </Button>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-primary">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold">{resultLabel}</h3>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InsightCard;
