import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import WaveSurfer from "wavesurfer.js";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#d1d5db",
      progressColor: "#ef4444",
      barWidth: 3,
      height: 90
    });

    return () => wavesurfer.current.destroy();

  }, []);

  const uploadAudio = async (audioFile) => {

    const formData = new FormData();
    formData.append("audio", audioFile);

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/speech/upload",
        formData
      );

      setTranscription(res.data.transcription);

    } catch (error) {

      alert("Error uploading audio");

    }

    setLoading(false);

  };

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setAudioURL(url);

    wavesurfer.current.load(url);

  };

  const handleUpload = () => {

    if (!file) {
      alert("Please select an audio file");
      return;
    }

    uploadAudio(file);

  };

  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav"
      });

      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      wavesurfer.current.load(url);

      const audioFile = new File([audioBlob], "recorded.wav");

      uploadAudio(audioFile);

    };

    mediaRecorder.start();
    setRecording(true);

  };

  const stopRecording = () => {

    mediaRecorderRef.current.stop();
    setRecording(false);

  };

  const downloadText = () => {

    const element = document.createElement("a");

    const file = new Blob([transcription], { type: "text/plain" });

    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";

    document.body.appendChild(element);
    element.click();

  };

  return (

    <div className={darkMode ? "dark app" : "app"}>

      {/* NAVBAR */}

      <nav className="navbar">

        <h2>Awaaz Setu</h2>

        <div className="nav-links">

          <a href="#home">Home</a>
          <a href="#speech">Features</a>
          <a href="#about">About</a>

          <button
            className="dark-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            🌙
          </button>

        </div>

      </nav>


      {/* HERO */}

      <section id="home" className="hero">

        <h1>🎤 Awaaz Setu</h1>
        <p>Offline Speech‑to‑Text System</p>

      </section>


      {/* SPEECH TOOL */}

      <section id="speech" className="transcription-section">

        <h2>Speech to Text</h2>

        <div className="card glass">

          <h3>Upload Audio</h3>

          <input type="file" onChange={handleFileChange} />

          <button onClick={handleUpload}>
            Transcribe File
          </button>

          <hr />

          <h3>Record from Microphone</h3>

          {!recording ? (

            <button onClick={startRecording}>
              🎙 Start Recording
            </button>

          ) : (

            <button className="recording-btn" onClick={stopRecording}>
              🔴 Recording...
            </button>

          )}

          <div ref={waveformRef} className="waveform"></div>

          {audioURL && (
            <audio controls className="audio-player">
              <source src={audioURL} />
            </audio>
          )}

          {loading && <p>Processing audio...</p>}

          <div className="result">

            <h3>Result</h3>

            <p>{transcription}</p>

            {transcription && (
              <button onClick={downloadText}>
                Download Text
              </button>
            )}

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer id="about" className="footer">

        Awaaz Setu 2026.001

      </footer>

    </div>

  );

}

export default App;
