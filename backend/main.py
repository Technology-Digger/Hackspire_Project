# backend/main.py
import os
import tempfile
import shutil
import traceback
import subprocess
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration


# ✅ Universal ffmpeg setup (Hugging Face + Windows + Linux compatible)
ffmpeg_exe = shutil.which("ffmpeg")
if ffmpeg_exe:
    os.environ["FFMPEG_BINARY"] = ffmpeg_exe
    print("✅ FFmpeg found at:", ffmpeg_exe)
else:
    print("⚠️ FFmpeg not found. Please install or add it to PATH.")


# ✅ Create FastAPI app
app = FastAPI(title="🧬 Data Decoder Backend")


# ✅ CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend from any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ✅ Load models
device = "cuda" if torch.cuda.is_available() else "cpu"
whisper_model = whisper.load_model("base", device=device)
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
).to(device)


# 🎧 AUDIO → TEXT
@app.post("/audio-insights")
async def audio_insights(audio: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            shutil.copyfileobj(audio.file, tmp)
            audio_path = tmp.name

        result = whisper_model.transcribe(audio_path)
        text = result["text"]
        lang = result["language"]

        return {"insight_type": "audio", "text": text, "language": lang}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {e}")

    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)


# 🖼 IMAGE → INSIGHT
@app.post("/image-insights")
async def image_insights(image: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            shutil.copyfileobj(image.file, tmp)
            image_path = tmp.name

        raw_image = Image.open(image_path).convert("RGB")
        inputs = processor(raw_image, return_tensors="pt").to(device)
        out = blip_model.generate(**inputs, max_length=30)
        caption = processor.decode(out[0], skip_special_tokens=True)

        return {"insight_type": "image", "text": caption}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Image processing failed: {e}")

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)


# 🎥 VIDEO → INSIGHTS (audio transcription + frame captions)
@app.post("/video-insights")
async def video_insights(video: UploadFile = File(...)):
    """🎥 Upload a video, get transcript + frame captions + insights."""
    try:
        # Save uploaded video temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            shutil.copyfileobj(video.file, tmp)
            video_path = tmp.name

        # Ensure ffmpeg exists
        ffmpeg_cmd = shutil.which("ffmpeg")
        if not ffmpeg_cmd:
            raise HTTPException(status_code=500, detail="FFmpeg not found on server environment")

        # Extract audio for Whisper
        audio_path = video_path.replace(".mp4", "_audio.mp3")
        subprocess.run(
            [ffmpeg_cmd, "-y", "-i", video_path, "-vn", "-acodec", "mp3", audio_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # Transcribe audio → text
        transcript = whisper_model.transcribe(audio_path)
        text = transcript["text"]
        lang = transcript["language"]

        # Extract key frames (1 every 10 seconds)
        frame_dir = tempfile.mkdtemp()
        frame_pattern = os.path.join(frame_dir, "frame_%03d.jpg")
        subprocess.run(
            [ffmpeg_cmd, "-i", video_path, "-vf", "fps=1/10", frame_pattern],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        # Generate captions for frames
        captions = []
        for frame_file in sorted(os.listdir(frame_dir)):
            frame_path = os.path.join(frame_dir, frame_file)
            try:
                raw_image = Image.open(frame_path).convert("RGB")
                inputs = processor(raw_image, return_tensors="pt").to(device)
                out = blip_model.generate(**inputs, max_length=30)
                caption = processor.decode(out[0], skip_special_tokens=True)
                captions.append(caption)
            except Exception:
                continue

        # Merge insights
        combined_summary = f"🗣 Transcript summary:\n{text[:600]}...\n\n🖼 Visual insights:\n" + " | ".join(captions)

        return {
            "insight_type": "video",
            "language": lang,
            "transcript_snippet": text[:1000],
            "frame_captions": captions,
            "summary": combined_summary,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Video processing failed: {e}")

    finally:
        for path in [video_path, audio_path]:
            if os.path.exists(path):
                os.remove(path)
