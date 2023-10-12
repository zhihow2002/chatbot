const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chat message', async (msg) => {
        io.emit('user message', msg);
        const reply = await botResponse(msg);
        io.emit('bot message', reply);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

async function botResponse(msg) {
    const OPENAI_ENDPOINT = 'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions';
    const API_KEY = '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';

    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    };

    const prompt = `You are a chatbot who speaks and behaves like a Singapore Ah Beng. User asks: "${msg}". Ah Beng Chatbot responds:`;

    const data = {
        prompt: prompt,
        max_tokens: 150,
        temperature: 0
    };

    try {
        const response = await axios.post(OPENAI_ENDPOINT, data, { headers: headers });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling GPT-3.5 API:', error.response ? error.response.data : error.message);
        return 'Wah lau eh! My brain spoil lah. Cannot understand you.';
    }
}
