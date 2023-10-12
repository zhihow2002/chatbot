const axios = require('axios');

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/engines/davinci/completions';
const API_KEY = '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';  // Replace with your API key

async function verifyAPIKey() {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const data = {
    prompt: 'Translate the following English text to French: "Hello, how are you?"',
    max_tokens: 50
  };

  try {
    const response = await axios.post(OPENAI_ENDPOINT, data, { headers: headers });
    if (response.status === 200) {
      console.log('API key is valid!');
      console.log('Sample Response:', response.data.choices[0].text.trim());
    } else {
      console.log('API key is invalid or there was an unexpected response.');
    }
  } catch (error) {
    console.log('Error verifying API key:', error.response ? error.response.data : error.message);
  }
}

verifyAPIKey();
