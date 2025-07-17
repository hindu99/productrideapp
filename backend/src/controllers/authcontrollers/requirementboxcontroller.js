import dotenv from 'dotenv';

// Import Node.js modules for working with file paths and ES modules
import path from 'path';
import { fileURLToPath } from 'url';

// Get __filename and __dirname equivalents in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loading enviornment variables 
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Below function is written to handle the request coming from frontend( from the componets requirementbugwritingbox
 * with the written requirment data.
 * Once the requirement dat is received then this function sends it to OpenAI API for refinement, and returns the result.
 */
export const handleRequirementBox = async (req, res) => {
  // Extract requirement data from request body
  const { requirementdata } = req.body;

  // input validation
  if (!requirementdata) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  // Adding a prompt infront of the requirmentdata 
  const prompt = `
You are a product analyst assistant.

Your task is to:
1. Refine the following product requirement written by a user or product manager.
2. Make the requirement clearer, more structured, and implementation-ready.
3. Write a set of clear acceptance criteria based on the refined requirement, using bullet points (not checkboxes).

Original Requirement:
"${requirementdata}"

Respond in the following format:
---
Refined Requirement:
<your improved version here>

Acceptance Criteria:
`;

  try {
    // Send request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    // Parse the response as JSON
    const data = await response.json();

    // Log the response if debugging is enabled
    if (process.env.DEBUG === 'true') {
      console.log('ChatGPT API response:', JSON.stringify(data, null, 2));
    }

    // API error handler
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(500).json({ error: 'Failed to get response from ChatGPT.' });
    }

    // Extract the AI's reply from the response
    const reply = data.choices?.[0]?.message?.content;

    // Handle missing reply
    if (!reply) {
      console.warn('ChatGPT returned no message.');
      return res.status(502).json({ error: 'Invalid response from ChatGPT.' });
    }

    // Send the reply back to the client
    return res.json({ reply });

  } catch (error) {
    // network error handler
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


