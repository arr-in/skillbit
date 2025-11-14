import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes - define these BEFORE static files
app.get("/api/health", (req, res) => {
    res.status(200).json({ 
        msg: "success from api",
        env: ENV.NODE_ENV 
    });
});

// Serve static files and handle client-side routing
const frontendPath = path.join(__dirname, "../../frontend/dist");

// Check if frontend build exists
if (fs.existsSync(frontendPath)) {
    console.log("✅ Frontend build found, serving static files");
    
    // Serve static files
    app.use(express.static(frontendPath));

    // Catch-all route handler for client-side routing
    // This must be last and uses a middleware function instead of route
    app.use((req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"), (err) => {
            if (err) {
                console.error("Error sending index.html:", err);
                res.status(500).send("Error loading application");
            }
        });
    });
} else {
    console.log("❌ Frontend build NOT found at:", frontendPath);
    console.log("Run 'npm run build' from the root directory first!");
    
    app.use((req, res) => {
        res.status(503).send(`
            <h1>Application Not Built</h1>
            <p>Frontend build not found. Please run:</p>
            <pre>npm run build</pre>
            <p>Looking for files at: ${frontendPath}</p>
        `);
    });
}

app.listen(ENV.PORT, () => {
    console.log(`🚀 Backend is running on port ${ENV.PORT}`);
    console.log(`📁 Looking for frontend at: ${frontendPath}`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
});