import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/api/health", (req, res) => {
    res.status(200).json({ msg: "success from api" });
});

// Serve static files in production
if (ENV.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    
    app.use(express.static(frontendPath));

    // Express 4 syntax - this works!
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

app.listen(ENV.PORT, () => 
    console.log(`Backend is running on port ${ENV.PORT}`)
);