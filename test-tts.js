
require("dotenv").config({ path: "./.env" });

const fs = require("fs");

async function testTTS() {
    const response = await fetch(
        "https://api.vachana.ai/api/v1/tts/inference",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key-ID": process.env.GNANI_API_KEY
            },
            body: JSON.stringify({
                text: "नमस्ते, मैं आशा बोल रही हूँ। बताइए, मैं आपकी किस प्रकार सहायता कर सकती हूँ?",
                voice: "Nalini",
                model: "timbre-v2.5",
                language: "hi-IN",
                speed: 1.0,
                audio_config: {
                    sample_rate: 48000,
                    num_channels: 1,
                    sample_width: 2,
                    encoding: "linear_pcm",
                    container: "wav"
                }
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("TTS failed:", response.status, error);
        return;
    }

    const audio = Buffer.from(await response.arrayBuffer());

    fs.mkdirSync("audio", { recursive: true });
    fs.writeFileSync("audio/timbre-test.wav", audio);

    console.log("TTS successful!");
    console.log("HTTP status:", response.status);
    console.log("Audio size:", audio.length, "bytes");
    console.log("Saved: audio/timbre-test.wav");
}

testTTS().catch(error => {
    console.error("Request failed:", error.message);
});
