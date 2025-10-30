import { motion } from "framer-motion";
import { Sparkles, Languages, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface InsightCardProps {
  insight: string;
  language?: string;
  type: "image" | "audio";
}

export const InsightCard = ({ insight, language, type }: InsightCardProps) => {
  // Split insight into words for staggered animation
  const words = insight.split(" ");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="mt-6"
    >
      <Card className="glass-panel border-primary/20 overflow-hidden">
        <CardHeader className="relative pb-4">
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{ background: 'var(--gradient-primary)' }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <div className="flex items-center gap-3 relative z-10">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                delay: 0.2,
              }}
            >
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </motion.div>
            
            <div>
              <motion.h4
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-semibold text-lg"
              >
                {type === "image" ? "Image Insights" : "Audio Transcription"}
              </motion.h4>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Zap className="w-3 h-3" />
                <span>AI-powered analysis</span>
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Animated text reveal */}
          <motion.div
            className="bg-background/50 rounded-xl p-5 border border-border/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p className="text-foreground leading-relaxed">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.03,
                    duration: 0.3,
                  }}
                  className="inline-block mr-1"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Language detection */}
          {language && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-primary/10"
            >
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Detected language: <span className="text-primary">{language}</span>
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};