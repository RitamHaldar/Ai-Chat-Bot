const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.txt.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    console.log(req.body.history);
    console.log(req.body.message);

    try {
        const chatHistory = req.body.history.map(entry => ({
            role: entry.role,
            parts: entry.parts.map(part => typeof part === 'string' ? { text: part } : part)
        }));

        const chat = model.startChat({
            history: chatHistory
        });

        const msg = req.body.message;
        const result = await chat.sendMessage(msg);
        const response = result.response.text();

        res.send(response);
    } catch (error) {
        console.error("Error in /gemini:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
