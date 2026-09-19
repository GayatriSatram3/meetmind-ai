const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const { pipeline } = require("@xenova/transformers");
const { WaveFile } = require("wavefile");

const ffmpegPath = require("ffmpeg-static");

let transcriber = null;

const convertToWav = (inputPath) => {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(
            path.dirname(inputPath),
            `${path.basename(
                inputPath,
                path.extname(inputPath)
            )}-converted.wav`
        );

        const ffmpeg = spawn(ffmpegPath, [
            "-i",
            inputPath,

            // Convert to mono
            "-ac",
            "1",

            // Whisper expects 16 kHz
            "-ar",
            "16000",

            // PCM 16-bit WAV
            "-sample_fmt",
            "s16",

            "-y",
            outputPath,
        ]);

        let errorOutput = "";

        ffmpeg.stderr.on(
            "data",
            (data) => {
                errorOutput += data.toString();
            }
        );

        ffmpeg.on("error", (error) => {
            reject(error);
        });

        ffmpeg.on("close", (code) => {
            if (code !== 0) {
                reject(
                    new Error(
                        `FFmpeg failed: ${errorOutput}`
                    )
                );

                return;
            }

            resolve(outputPath);
        });
    });
};

const transcribeAudio = async (audioPath) => {
    let convertedPath = null;

    try {
        // -----------------------------
        // Load Whisper model
        // -----------------------------

        if (!transcriber) {
            console.log(
                "🎙️ Loading Whisper model..."
            );

            transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-small.en"
);

            console.log(
                "✅ Whisper model loaded"
            );
        }

        // -----------------------------
        // Convert audio to WAV
        // -----------------------------

        console.log(
            "🔄 Converting audio to 16kHz mono WAV..."
        );

        convertedPath =
            await convertToWav(audioPath);

        console.log(
            "✅ Audio converted successfully"
        );

        // -----------------------------
        // Read WAV
        // -----------------------------

        const buffer =
            fs.readFileSync(convertedPath);

        const wav =
            new WaveFile(buffer);

        // Whisper expects Float32 audio
        wav.toBitDepth("32f");

        // Make sure sample rate is 16kHz
        wav.toSampleRate(16000);

        let audioData =
            wav.getSamples();

        // If audio is multi-channel,
        // select the first channel.
        if (Array.isArray(audioData)) {
            audioData = audioData[0];
        }

        // -----------------------------
        // Transcribe
        // -----------------------------

        console.log(
            "🎧 Transcribing audio..."
        );

        const result =
            await transcriber(audioData, {
                chunk_length_s: 30,
                stride_length_s: 5,
            });

        console.log(
            "✅ Transcription completed"
        );

        return result.text.trim();

    } catch (error) {
        console.error(
            "Audio transcription error:",
            error
        );

        throw new Error(
            "Failed to transcribe audio"
        );

    } finally {

        // -----------------------------
        // Delete converted WAV
        // -----------------------------

        if (
            convertedPath &&
            fs.existsSync(convertedPath)
        ) {
            fs.unlinkSync(
                convertedPath
            );

            console.log(
                "🗑️ Converted WAV deleted"
            );
        }
    }
};

module.exports = {
    transcribeAudio,
};