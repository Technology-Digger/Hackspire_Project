import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileUpload } from "@/components/FileUpload";
import { InsightCard } from "@/components/InsightCard";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Image, Music } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// ✅ Use relative path so Vite proxy applies and no CORS issues occur
const API_BASE_URL = "";

interface InsightResult {
  insight: string;
  language?: string;
}

const Index = () => {
  const [imageInsight, setImageInsight] = useState<InsightResult | null>(null);
  const [audioInsight, setAudioInsight] = useState<InsightResult | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [imageComplete, setImageComplete] = useState(false);
  const [audioComplete, setAudioComplete] = useState(false);
  const analysisRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToAnalysis = () => {
    analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 🖼 Image Upload Handler
  const handleImageUpload = async (file: File) => {
    setImageLoading(true);
    setImageInsight(null);
    setImageProgress(0);
    setImageComplete(false);

    const progressInterval = setInterval(() => {
      setImageProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append("image", file); // ✅ backend expects "image"

    try {
      const response = await axios.post(`${API_BASE_URL}/image-insights`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setImageProgress(100);

      setImageInsight({
        insight:
          response.data.text ||
          response.data.caption ||
          response.data.insight ||
          "No insight generated",
      });

      setImageComplete(true);

      toast({
        title: "✨ Image analyzed successfully",
        description: "AI has generated insights from your image",
      });
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Image analysis error:", error);
      setImageProgress(0);
      toast({
        title: "❌ Analysis failed",
        description: "Failed to analyze image. Make sure backend is running on port 8000.",
        variant: "destructive",
      });
    } finally {
      setImageLoading(false);
    }
  };

  // 🎧 Audio Upload Handler
  const handleAudioUpload = async (file: File) => {
    setAudioLoading(true);
    setAudioInsight(null);
    setAudioProgress(0);
    setAudioComplete(false);

    const progressInterval = setInterval(() => {
      setAudioProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append("audio", file); // ✅ backend expects "audio"

    try {
      const response = await axios.post(`${API_BASE_URL}/audio-insights`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setAudioProgress(100);

      setAudioInsight({
        insight:
          response.data.text ||
          response.data.transcription ||
          response.data.insight ||
          "No transcription generated",
        language: response.data.language || response.data.detected_language,
      });

      setAudioComplete(true);

      toast({
        title: "🎵 Audio analyzed successfully",
        description: "AI has transcribed your audio file",
      });
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Audio analysis error:", error);
      setAudioProgress(0);
      toast({
        title: "❌ Analysis failed",
        description: "Failed to analyze audio. Make sure backend is running on port 8000.",
        variant: "destructive",
      });
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Force dark mode by default */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (!document.documentElement.classList.contains('dark')) {
              document.documentElement.classList.add('dark');
            }
          `,
        }}
      />

      <ThemeToggle />
      <Hero onGetStarted={scrollToAnalysis} />

      {/* Analysis Section */}
      <section ref={analysisRef} className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Start Analyzing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your files and let AI transform them into actionable insights
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full"
          >
            <FileUpload
              accept="image/*"
              icon={<Image className="w-8 h-8" />}
              title="Image to Insights"
              description="Upload an image to generate AI-powered captions"
              onFileSelect={handleImageUpload}
              isLoading={imageLoading}
              progress={imageProgress}
              uploadComplete={imageComplete}
            />

            {imageLoading && <LoadingAnimation message="Analyzing image..." />}
            {imageInsight && <InsightCard insight={imageInsight.insight} type="image" />}
          </motion.div>

          {/* Audio Upload */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col h-full"
          >
            <FileUpload
              accept="audio/*"
              icon={<Music className="w-8 h-8" />}
              title="Audio to Insights"
              description="Upload audio to get AI transcription and language detection"
              onFileSelect={handleAudioUpload}
              isLoading={audioLoading}
              progress={audioProgress}
              uploadComplete={audioComplete}
            />

            {audioLoading && <LoadingAnimation message="Transcribing audio..." />}
            {audioInsight && (
              <InsightCard
                insight={audioInsight.insight}
                language={audioInsight.language}
                type="audio"
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Built by <span className="text-primary font-semibold">Fork Experts</span> 💙
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
