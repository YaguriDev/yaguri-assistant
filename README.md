# Yaguri Assistant

**Yaguri Assistant** is a Windows-based voice-controlled automation assistant built in TypeScript. It uses offline speech recognition and text-to-speech (TTS) engines to listen to commands, execute actions, and provide voice feedback. The project leverages native modules and pre-trained models for accurate and responsive performance.
The project was written out of boredom and a lot can be changed and improved.

---

## Features

- **Offline speech recognition** using Vosk API.
- **Offline TTS** using Piper with ONNX models.
- **Voice-activated commands** with customizable trigger words.
- **Command execution**: open applications, type text, send messages, etc.
- **Cross-device audio input**: supports multiple microphones.
- **Queue system for TTS**: prevents overlapping speech.
- Configurable via `options.json`.

---

## Technical Stack

- **Node.js + TypeScript** – main runtime and language.
- **Vosk API (`vosk` npm package)** – offline speech recognition.
- **Piper TTS** – offline speech synthesis using ONNX models.
- **nut.js** – automation library for keyboard and clipboard actions.
- **node-record-lpcm16** – audio recording from Windows DirectShow devices.
- **child_process (`spawn`)** – run ffmpeg, ffplay, Piper, and other external processes.

---

## Models and Binaries

1. **Vosk speech recognition models**

   - Located in `src/models/`.
   - Pre-trained Russian model (`vosk-ru`) used for offline recognition.
   - Model files loaded directly by the application.
   - More models available from the official Vosk site:
     - [Vosk Models](https://alphacephei.com/vosk/models)

2. **Piper TTS models (ONNX)**

   - Located in `src/tts/`.
   - Each voice has a corresponding ONNX model file.
   - TTS is generated as temporary WAV files, which are played via ffplay.
   - More models available from the huggingface:
     - [ONNX Models](https://huggingface.co/rhasspy/piper-voices/tree/main)
     - Need download xx_XX-name-level.onnx and xx_XX-name-level.onnx.json files.

3. **Binaries**

   - **ffmpeg.exe**: audio capture and conversion.
   - **ffplay.exe**: play WAV files for TTS.
   - **piper.exe**: runs the TTS engine.

> Note: binaries are not included in the repository due to size limitations. Users need to download them separately or use prebuilt releases if provided.

---

## Installation

> Note: You can download prebuilt release with binaries, but you'll still need to run npm install in the directory.

1. Install [Node.js >= 19](https://nodejs.org/).
2. Clone the repository:

```bash
git clone https://github.com/YaguriDev/yaguri-assistant.git
cd yaguri-assistant
```

3. Install dependencies:

```bash
npm install
```

4. Place required binaries and models in the appropriate folders:

```
src/
├─ bin/
│  ├─ ffmpeg.exe
│  └─ ffplay.exe
├─ tts/
│  ├─ piper.exe
│  ├─ ...pipers ddls
│  ├─ <voice>.onnx.json
│  └─ <voice>.onnx
└─ models/
   └─ <model>/
```

---

## Configuration

- Default configuration is stored in `src/config/default_options.json`.
- User-specific options are saved in `options.json` after first launch.
- Configurable fields:

```json
{
  "model": "<model>",
  "voice": "<voice>",
  "triggerWord": "слушай",
  "mic": "Microphone Name",
  "commands": {
    "open": {
      "aliases": ["открой", "запуск", "запусти"],
      "args": {
        "notepad": {
          "aliases": ["блокнот", "текстовый редактор"],
          "action": "notepad.exe"
        }
      }
    }
  }
}
```

- Commands, aliases, and TTS responses can be customized.

---

## Usage

### Start via Node.js

```bash
npx tsx index.ts
```

- On first run, you will be prompted to select a microphone if not configured.
- The assistant will listen for the trigger word, e.g., `слушай`, and process recognized commands.

### Start via Windows Batch (optional)

- A simple `start.bat` (in directory):

```bat
@echo off
cd /d %~dp0
echo [INFO] Make sure you have run "npm install" in this directory before first start.
echo [INFO] Starting Yaguri Assistant...
npx tsx index.ts
pause
```

---

## Logging

- All logs are printed to the console via a simple logger.
- Debug mode can be enabled in `options.json` by setting `"debug": true`.
- Vosk internal logs can be suppressed via `setLogLevel(-1)`.

---

## Notes

- **Dependencies**: `ffi-napi`, `node-record-lpcm16`, `vosk`, `nut.js`.
- **Native modules** require Windows build tools (Visual Studio + C++ workload) for npm installation.
- **Recommended Node version**: 19.x for stable native module compilation.
