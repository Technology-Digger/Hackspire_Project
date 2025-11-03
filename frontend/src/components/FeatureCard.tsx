import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  type: "image" | "audio" | "video";
  icon: LucideIcon;
  title: string;
  description: string;
  backgroundClass: string;
  index: number;
  onClick: () => void;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  backgroundClass,
  index,
  onClick,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="relative group"
    >
      <Button
        variant="feature"
        onClick={onClick}
        className="w-full h-[400px] flex flex-col items-center justify-center p-8 cursor-pointer relative overflow-hidden"
      >
        {/* Animated background */}
        <div className={`absolute inset-0 ${backgroundClass}`}>
          {/* Image grid animation */}
          {title.includes("Image") && (
            <div className="absolute inset-0 opacity-20 overflow-hidden">
              <div className="grid grid-cols-4 gap-2 animate-pan">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audio waveform animation */}
          {title.includes("Audio") && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary animate-pulse-wave"
                  style={{
                    height: `${Math.random() * 100 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Video play frames animation */}
          {title.includes("Video") && (
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full p-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-secondary/30 to-primary/30 rounded animate-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "2s",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-2xl glass-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-12 h-12 text-primary group-hover:text-secondary transition-colors" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="mt-4 px-6 py-2 glass-card rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to Open →
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-xl" />
        </div>
      </Button>
    </motion.div>
  );
};
