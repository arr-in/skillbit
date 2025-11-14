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

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ msg: "success from api" });
});

// Serve static files and handle client-side routing in production
if (ENV.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    
    app.use(express.static(frontendPath));

    // Handle all other routes - send index.html for client-side routing
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

app.listen(ENV.PORT, () => 
    console.log(`Backend is running on port ${ENV.PORT}`)
);