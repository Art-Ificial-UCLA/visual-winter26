import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.use(express.json());
app.use(express.static(__dirname));

function extractRetrySeconds(message = '') {
  const match = message.match(/retry in ([\d.]+)s/i);
  if (!match) return null;
  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? Math.ceil(parsed) : null;
}

// Curated cinematic Unsplash images for AI to pick from
const CARD_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=80', desc: 'neon cyberpunk city' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80', desc: 'snowy mountain peaks' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80', desc: 'golden hour field' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', desc: 'mountain road journey' },
  { url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=900&q=80', desc: 'deep space nebula' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', desc: 'luxury minimal interior' },
  { url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=900&q=80', desc: 'dark urban night' },
  { url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=900&q=80', desc: 'dark misty forest' },
  { url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80', desc: 'desert road western' },
  { url: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=900&q=80', desc: 'dark winter landscape' },
  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80', desc: 'action arena night' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80', desc: 'misty mountain fog' },
];

const REF_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80', desc: 'tech screens dark blue' },
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', desc: 'earth from space' },
  { url: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=400&q=80', desc: 'dark snowy winter' },
  { url: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=400&q=80', desc: 'golden sunlight field' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', desc: 'forest sunset fog' },
  { url: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&q=80', desc: 'open highway road' },
  { url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&q=80', desc: 'indie hiking landscape' },
  { url: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80', desc: 'deep space cosmos' },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80', desc: 'night sky stars' },
  { url: 'https://images.unsplash.com/photo-1496436672849-95f8adb7b7ab?w=400&q=80', desc: 'desert rock western' },
  { url: 'https://images.unsplash.com/photo-1512053459797-38c3a066cabd?w=400&q=80', desc: 'desert sunset western' },
  { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80', desc: 'luxury store minimal' },
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', desc: 'luxury watch detail' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', desc: 'mountain road wide' },
  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', desc: 'action arena' },
];

const cardImgOptions = CARD_IMAGES.map(i => `${i.url} (${i.desc})`).join('\n');
const refImgOptions = REF_IMAGES.map(i => `${i.url} (${i.desc})`).join('\n');

const SYSTEM_PROMPT = `You are VIBE AI, the cinematic intelligence behind FrameVibes — a toolkit for filmmakers and editors that curates color palettes, royalty-free music, and sound effects for any cinematic mood.

Your role: help users generate and refine cinematic "vibe" packs from any prompt. You can also answer questions about the vibes or filmmaking in general.

CRITICAL: Always respond with a single valid JSON object — no markdown, no code fences, no text outside JSON.

Response format:
{
  "message": "1-2 sentence cinematic response (evocative tone)",
  "vibe": { ... }
}

Only include the "vibe" field when generating or updating a vibe. Omit it for questions or general conversation.

VIBE SCHEMA (use when generating):
{
  "id": "unique-kebab-case-id derived from the name",
  "name": "Evocative 2-3 word title",
  "genre": "MUST be one of: sci-fi | thriller | romance | horror | indie | luxury | action | western",
  "mood": "MUST be one of: dark | dreamy | intense | calm | suspenseful | warm | nostalgic | eerie",
  "emotion": "two emotions, e.g. 'wonder, dread'",
  "energy": "MUST be one of: low | medium | high",
  "tempo": "MUST be one of: slow | mid | fast",
  "tempoBpm": "BPM range string, e.g. '85-110 BPM'",
  "description": "2-3 evocative, sensory sentences capturing the cinematic mood. Strong imagery.",
  "image": "Choose the single best-fitting URL from this list:\n${cardImgOptions}",
  "colors": ["#hex1","#hex2","#hex3","#hex4","#hex5","#hex6"],
  "music": [
    {
      "name": "Evocative track title",
      "artist": "Artist name or Various",
      "genre": "Music genre",
      "bpm": 90,
      "license": "CC0 or CC BY",
      "source": "Pixabay Music | Free Music Archive | ccMixter | Incompetech",
      "url": "Search URL — use one of: https://pixabay.com/music/search/TERMS/ OR https://freemusicarchive.org/search?q=TERMS OR https://ccmixter.org/search?search_text=TERMS OR https://incompetech.filmmusic.io/search/#TERMS (encode spaces as +)"
    },
    { "name": "...", "artist": "...", "genre": "...", "bpm": 85, "license": "CC BY", "source": "...", "url": "..." }
  ],
  "sfx": [
    {
      "name": "Descriptive SFX name",
      "category": "MUST be one of: Environment | Foley | Ambience | Impact | Transition",
      "source": "Freesound | BBC SFX | Zapsplat",
      "url": "Search URL — use one of: https://freesound.org/search/?q=TERMS OR https://sound-effects.bbcrewind.co.uk/search?q=TERMS OR https://www.zapsplat.com/sound-effect-search/?s=TERMS (encode spaces as +)"
    },
    { second sfx },
    { third sfx }
  ],
  "refs": ["url1", "url2"]
}

RULES:
- colors: 6-swatch cinematic palette from deep shadow (#000-ish) to highlight. Make it intentional and mood-accurate.
- music: exactly 2 tracks with real, specific search queries in the URLs.
- sfx: exactly 3 effects with real, specific search queries in the URLs.
- refs: exactly 2 URLs chosen from this list:
${refImgOptions}
- When refining a vibe the user already generated, include the full updated vibe object with the same id.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'No messages provided.' });
  }
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ message: 'Missing OPENAI_API_KEY (or GEMINI_API_KEY fallback) in server env.' });
  }
  if (!/^sk-/.test(OPENAI_API_KEY)) {
    return res.status(500).json({
      message: 'OPENAI_API_KEY is not in a valid OpenAI key format (expected it to start with "sk-").',
    });
  }

  try {
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
        .filter(m => typeof m?.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
        .map(m => ({ role: m.role, content: m.content })),
    ];

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: chatMessages,
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    const raw = await openAIResponse.text();
    if (!openAIResponse.ok) {
      const retryHeader = openAIResponse.headers.get('retry-after');
      const retrySeconds = retryHeader ? Number.parseInt(retryHeader, 10) : null;
      const retryText = Number.isFinite(retrySeconds) ? ` Try again in about ${retrySeconds} seconds.` : '';

      if (openAIResponse.status === 429) {
        return res.status(429).json({
          message:
            `OpenAI quota/rate limit exceeded.${retryText} ` +
            'Check usage and billing for your API key/project.',
        });
      }

      console.error('API error:', raw);
      return res.status(openAIResponse.status).json({
        message: `OpenAI request failed (${openAIResponse.status}).`,
      });
    }

    const completion = JSON.parse(raw);
    let text = completion?.choices?.[0]?.message?.content?.trim() || '';
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: 'Something got scrambled in the response. Try rephrasing your prompt.' };
    }

    res.json(parsed);
  } catch (error) {
    const message = error?.message || 'Unknown API error';
    console.error('API error:', message);

    const isQuotaError = message.includes('429') || /quota|rate limit|too many requests/i.test(message);

    if (isQuotaError) {
      const retrySeconds = extractRetrySeconds(message);
      const retryText = retrySeconds ? ` Try again in about ${retrySeconds} seconds.` : '';

      return res.status(429).json({
        message:
          `OpenAI quota/rate limit exceeded.${retryText} ` +
          'Check usage and billing for your API key/project.',
      });
    }

    return res.status(500).json({
      message: 'Failed to reach OpenAI. Check OPENAI_API_KEY and model access.',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  FrameVibes  ->  http://localhost:${PORT}\n`);
});
