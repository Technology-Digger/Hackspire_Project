import { motion } from "framer-motion";
import { Image, Music, Video } from "lucide-react";
import Header from "@/components/Header";
import InsightCard from "@/components/InsightCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Tabs defaultValue="image" className="space-y-8">
            <TabsList className="glass-card w-full justify-start p-2 border border-border/50">
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-gradient-neon data-[state=active]:text-white transition-smooth"
              >
                <Image className="w-4 h-4 mr-2" />
                Image Insights
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="data-[state=active]:bg-gradient-neon data-[state=active]:text-white transition-smooth"
              >
                <Music className="w-4 h-4 mr-2" />
                Audio Transcription
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="data-[state=active]:bg-gradient-neon data-[state=active]:text-white transition-smooth"
              >
                <Video className="w-4 h-4 mr-2" />
                Video Transcription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="mt-8">
              <InsightCard
                title="Image → Insights"
                icon={<Image className="w-5 h-5" />}
                accept="image/jpeg,image/png,image/jpg"
                endpoint="/image-insights"
                resultLabel="AI-Generated Description"
              />
            </TabsContent>

            <TabsContent value="audio" className="mt-8">
              <InsightCard
                title="Audio → Text"
                icon={<Music className="w-5 h-5" />}
                accept="audio/mpeg,audio/wav,audio/mp3"
                endpoint="/audio-insights"
                resultLabel="Transcript"
              />
            </TabsContent>

            <TabsContent value="video" className="mt-8">
              <InsightCard
                title="Video → Text"
                icon={<Video className="w-5 h-5" />}
                accept="video/mp4,video/quicktime,video/mov"
                endpoint="/video-insights"
                resultLabel="Transcript"
              />
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>Powered by AI • Secure • Fast Processing</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
