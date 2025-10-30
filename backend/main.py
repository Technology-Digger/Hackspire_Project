# backend/main.py
import os
import tempfile
import shutil
import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

app = FastAPI(title="🧬 Data Decoder Backend")

# ✅ Allow frontend to connect (Lovable usually runs on 8080)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add ffmpeg to PATH (you keep ffmpeg.exe in Hackspire folder)
os.environ["PATH"] += os.pathsep + r"D:\Hackspire"

device = "cuda" if torch.cuda.is_available() else "cpu"

# ✅ Load AI models
whisper_model = whisper.load_model("base", device=device)
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
).to(device)


@app.post("/audio-insights")
async def audio_insights(audio: UploadFile = File(...)):
    """🎧 Upload an audio file and get its text transcription."""
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


@app.post("/image-insights")
async def image_insights(image: UploadFile = File(...)):
    """🖼 Upload an image and get a caption-like text insight."""
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


@app.get("/")
async def root():
    return {"message": "✅ Data Decoder backend running successfully!"}
