import whisper
import sys
import os
import json

# Tell Python where ffmpeg is located
os.environ["PATH"] += os.pathsep + r"D:\Accent-Robust Offline Hindi Speech-to-Text System Using Deep Learning\ffmpeg-8.0.1-essentials_build\bin"

# Load model
model = whisper.load_model("base")

# Get audio file path
audio_path = sys.argv[1]

# Transcribe audio
result = model.transcribe(audio_path)

# Print result
print(json.dumps({"text": result["text"]}))
