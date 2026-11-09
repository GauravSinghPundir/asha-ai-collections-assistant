const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

console.log("Gnani API key loaded:", Boolean(process.env.GNANI_API_KEY));
console.log("NVIDIA API key loaded:", Boolean(process.env.NVIDIA_API_KEY));