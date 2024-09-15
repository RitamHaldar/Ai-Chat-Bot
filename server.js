import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
const PORT=8000
const app= express()
app.use(cors())
app.use(express.json())
dotenv.config()
const genAI = new GoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEN_AI_KEY
});
app.post('/gemini',async (req,res) =>{
    console.log(req.body.history)
    console.log(req.body.body)
    const model = genAI.models.getModel('gemini-pro');
})
app.listen(PORT,()=> console.log(`Listening on port ${PORT}`))
