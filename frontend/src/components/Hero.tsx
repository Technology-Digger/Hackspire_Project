import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dna } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'var(--gradient-primary)' }}
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'var(--gradient-secondary)' }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Dna className="w-12 h-12 text-primary animate-glow-pulse" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text">
              Data Decoder
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Transforming Unstructured Data into{" "}
            <span className="text-primary font-semibold">Human Insights</span>
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Harness the power of advanced AI to decode images and audio files into
            meaningful, actionable insights with cutting-edge technology.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="pt-8"
          >
            <Button
              variant="hero"
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-12 py-6 h-auto"
            >
              Analyze Your Data
            </Button>
          </motion.div>

          {/* Stats or features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {[
              { label: "AI Models", value: "Advanced" },
              { label: "Processing", value: "Real-time" },
              { label: "Accuracy", value: "High-precision" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-panel p-6 rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-primary text-2xl font-bold mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};