const { OpenAIClient } = require('@fern-api/openai');

const openai = new OpenAIClient({
    token: process.env.OPENAI_API_KEY,
});

module.exports = openai;

