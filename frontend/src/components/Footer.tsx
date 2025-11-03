import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="glass-card border-t border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            Crafted with
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            precision by
            <span className="font-semibold gradient-text">Fork Experts</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
