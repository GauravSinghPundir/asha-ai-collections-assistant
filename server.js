
require("dotenv").config({ path: "./.env" });

const customerRoutes = require("./routes/customerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Asha AI Collections Assistant",
        status: "running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "Asha Backend",
        status: "healthy"
    });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Asha server running on http://localhost:${PORT}`);
    });
}

startServer();
