import { motion } from "framer-motion";
import { useState } from "react";
import { Image, Mic, Video } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { FeatureWorkspace } from "./FeatureWorkspace";
import { ThemeToggle } from "./ThemeToggle";

export type FeatureType = "image" | "audio" | "video" | null;

export const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);

  const features = [
    {
      type: "image" as const,
      icon: Image,
      title: "Image → Insights",
      description: "Extract insights from images using advanced AI",
      backgroundClass: "animate-pan bg-[length:200%_200%] bg-gradient-to-br from-primary/10 via-card to-secondary/10",
    },
    {
      type: "audio" as const,
      icon: Mic,
      title: "Audio → Insights",
      description: "Analyze audio files for valuable data",
      backgroundClass: "bg-card",
    },
    {
      type: "video" as const,
      icon: Video,
      title: "Video → Insights",
      description: "Process video content with AI intelligence",
      backgroundClass: "bg-card",
    },
  ];

  if (activeFeature) {
    return (
      <FeatureWorkspace
        featureType={activeFeature}
        onClose={() => setActiveFeature(null)}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,217,255,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(153,69,255,0.05),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold gradient-text mb-4">
            Select Your Feature
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose a data type to begin AI-powered analysis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.type}
              {...feature}
              index={index}
              onClick={() => setActiveFeature(feature.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
