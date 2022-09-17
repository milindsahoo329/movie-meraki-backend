import express from 'express';
import cors from 'cors';
import contents from './api/contents.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/contents", contents);

app.use("*", (req, res) => {
    res.status(404).json({ error: "not found" });
});

export default app;


