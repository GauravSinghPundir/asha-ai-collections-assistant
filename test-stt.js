
require("dotenv").config({ path: "./.env" });

const fs = require("fs");

async function testSTT() {
    const audio = fs.readFileSync("./audio/timbre-test.wav");

    const form = new FormData();

    form.append(
        "audio_file",
        new Blob([audio], { type: "audio/wav" }),
        "timbre-test.wav"
    );

    form.append("model", "prisma-v3.0");
    form.append("language_code", "hi-IN");

    const response = await fetch(
        "https://api.vachana.ai/stt/v3",
        {
            method: "POST",
            headers: {
                "X-API-Key-ID": process.env.GNANI_API_KEY
            },
            body: form
        }
    );

    if (!response.ok) {
        console.error("STT failed:", response.status);
        console.error(await response.text());
        return;
    }

    const result = await response.json();

    console.log("STT successful!");
    console.log("Transcript:", result.transcript);
    console.log("Detected language:", result.detected_language_code);
    console.log("Processing time:", result.processing_time);
}

testSTT().catch(error => {
    console.error("Request failed:", error.message);
});
