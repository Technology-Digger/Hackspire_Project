import { motion } from "framer-motion";
import { Dna } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-b border-border/50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="text-primary"
          >
            <Dna className="w-8 h-8" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              Data Decoder
            </h1>
            <p className="text-sm text-muted-foreground">
              Transforming Unstructured Data into Human Insights
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
