require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: "You will generate json data", });

app.get('/fact-check', async (req, res) => {
    const prompt = req.query?.prompt;

    if (!prompt) {
        res.send({ message: 'type something inside query' })
        return;
    }

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Birds can fly" }],
            },
            {
                role: "model",
                parts: [{ text: "this is 100% true" }],
            },
            {
                role: "user",
                parts: [{ text: "Only provide percentage of a fact" }],
            },
            {
                role: "model",
                parts: [{ text: "okay, got it" }],
            },
        ],
    });

    let result = await chat.sendMessage(prompt);
    res.send({ Fact_Check: result.response.text() })
})

app.get('/test-ai', async (req, res) => {
    const prompt = req.query?.prompt;
    if (!prompt) {
        res.send({ message: 'type something inside query' })
        return;
    }
    const result = await model.generateContent(prompt);
    res.send(result.response.text())
})

app.get('/generate-json', async (req, res) => {

    const prompt = req.query?.prompt;

    if (!prompt) {
        res.send({ message: 'type something inside query' })
        return;
    }

    const optimizedPrompt = `Make json data of ${prompt}`;

    const result = await model.generateContent(optimizedPrompt);
    const optimizedResult = result.response.text();
    res.send({ JSON: optimizedResult });
})

app.get('/', (req, res) => {
    res.send({ message: 'this is the home endpoint' })
})

app.listen(port, () => {
    console.log('server is running on port', port);
})