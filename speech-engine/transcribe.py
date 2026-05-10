import whisper
import sys
import os
import json

# Set ffmpeg path
os.environ["PATH"] += os.pathsep + r"E:\Accent-Robust Offline Hindi Speech-to-Text System Using Deep Learning\ffmpeg-8.0.1-essentials_build\bin"

try:
    # Load model
    model = whisper.load_model("base")

    # Get audio file path
    audio_path = sys.argv[1]
    audio_path = os.path.abspath(audio_path)

    # Transcribe
    result = model.transcribe(audio_path, task="transcribe", language=None)

    # ✅ ONLY JSON OUTPUT
    print(json.dumps({"text": result["text"]}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
