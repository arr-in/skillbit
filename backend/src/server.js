import express  from "express";
import { ENV } from "./lib/env.js";

console.log(ENV.PORT);
console.log(ENV.DB_URL);
const app = express();
console.log(process.env.PORT);
app.get("/health", (req,res) => {
    res.status(200).json({msg:"success from api"})
});

app.listen(2000,()=>console.log("backend is running on port", ENV.PORT));
