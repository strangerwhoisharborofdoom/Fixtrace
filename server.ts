import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FixTrace API',
    hasGeminiKey: Boolean(geminiApiKey),
    timestamp: new Date().toISOString(),
  });
});

// Server-side AI Fault Intake Endpoint
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const {
      category,
      brand,
      model,
      symptoms,
      errorCodes,
      whenStarted,
      photos = [],
      language = 'en',
    } = req.body;

    if (!category || !symptoms) {
      return res.status(400).json({ error: 'Appliance category and symptoms are required.' });
    }

    if (!aiClient) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server. Please ensure GEMINI_API_KEY is configured.',
        isFallback: true,
      });
    }

    const langInstructions: Record<string, string> = {
      en: 'Respond in clear, professional English.',
      kn: 'Respond predominantly in Kannada (ಕನ್ನಡ) with common technical terms also in English/transliteration where helpful for understanding.',
      hi: 'Respond predominantly in Hindi (हिन्दी) with common technical terms in English/Hinglish where helpful for clarity.',
    };

    const targetLangInstruction = langInstructions[language] || langInstructions.en;

    const systemPrompt = `You are FixTrace AI Diagnostic Engine, a trusted, highly safety-conscious household appliance diagnostic expert for Indian homes (tropical climate, power fluctuations, voltage variations, hard water).

SAFETY & INTEGRITY DIRECTIVES (ABSOLUTE RULES):
1. Never advise opening live electrical equipment, touching internal capacitors/compressors, gas lines, microwave magnetrons, or internal wiring.
2. Never advise bypassing fuses, MCBs, thermal cutoffs, or grounding pins.
3. For hazardous conditions (burning smell, smoke, sparks, leaking gas, exposed bare copper wiring, water dripping into electronics, electric shocks): immediately prioritize safety: tell the user to switch off main power/isolator, ventilate, keep distance, and call a qualified professional immediately.
4. Distinguish clearly between AI preliminary conjectures and technician-confirmed facts. Explicitly state this is an AI suggestion, not a verified diagnosis.
5. If evidence is ambiguous, do not invent high-certainty conclusions. State that physical inspection with multimeter/tools is required.
6. Provide output strictly in the requested JSON structure.
7. ${targetLangInstruction}
`;

    const userPrompt = `Analyze the following appliance fault report:
Appliance Category: ${category}
Brand: ${brand || 'Not specified'}
Model: ${model || 'Not specified'}
Symptoms: ${symptoms}
Error Code/Indicators: ${errorCodes || 'None observed'}
When Issue Began: ${whenStarted || 'Recently'}
Photo Evidence Attached: ${photos.length > 0 ? `${photos.length} image(s)` : 'None'}

Generate a structured diagnostic breakdown.`;

    const parts: any[] = [];

    // Attach up to 2 base64 photos if provided
    if (Array.isArray(photos) && photos.length > 0) {
      for (const photo of photos.slice(0, 2)) {
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          const match = photo.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2],
              },
            });
          }
        }
      }
    }

    parts.push({ text: userPrompt });

    let response;
    const config = {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Concise 1-2 sentence plain-language summary of the reported issue',
            },
            isAccurateAssessmentPossible: {
              type: Type.BOOLEAN,
              description: 'Whether current evidence is sufficient for a meaningful preliminary assessment',
            },
            confidenceLevel: {
              type: Type.STRING,
              description: 'High, Moderate, Preliminary, or Inconclusive',
            },
            confidenceExplanation: {
              type: Type.STRING,
              description: 'Why this confidence level was assigned',
            },
            plausibleCauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cause: { type: Type.STRING },
                  probability: { type: Type.STRING, description: 'High, Medium, or Low' },
                  description: { type: Type.STRING },
                  typicalPartInvolved: { type: Type.STRING },
                },
                required: ['cause', 'probability', 'description'],
              },
              description: 'Up to 3 plausible root causes supported by the reported symptoms',
            },
            safeChecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Safe, non-invasive, non-electrical checks the customer can perform (e.g. check wall switch, drain filter, water valve, remote batteries)',
            },
            criticalSafetyWarnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Urgent safety precautions (e.g., unplug immediately, do not open chassis, do not touch water pool)',
            },
            technicianNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific tests or measurements a qualified technician should perform next (e.g. coil resistance, capacitor capacitance, PCB relay voltage)',
            },
            recommendedSkills: {
              type: Type.STRING,
              description: 'Specific technician certification or skill category required (e.g. Inverter AC PCB Specialist, Refrigeration Sealed System Tech)',
            },
            missingInformation: {
              type: Type.STRING,
              description: 'Questions or additional observations that would narrow down the diagnosis',
            },
            disclaimer: {
              type: Type.STRING,
              description: 'Mandatory disclaimer statement stating this is an AI suggestion, not a verified technician diagnosis.',
            },
          },
          required: [
            'summary',
            'isAccurateAssessmentPossible',
            'confidenceLevel',
            'confidenceExplanation',
            'plausibleCauses',
            'safeChecks',
            'criticalSafetyWarnings',
            'technicianNextSteps',
            'recommendedSkills',
          ],
        },
      };

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastErr: any = null;

    for (const m of modelsToTry) {
      try {
        response = await aiClient.models.generateContent({
          model: m,
          contents: parts,
          config,
        });
        if (response?.text) break;
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${m} encountered:`, err.message || err);
      }
    }

    if (!response || !response.text) {
      throw lastErr || new Error('Empty response from AI models.');
    }

    const text = response.text.trim();
    const parsedResult = JSON.parse(text);
    return res.json(parsedResult);
  } catch (error: any) {
    console.error('AI Diagnose Error:', error);
    return res.status(500).json({
      error: error.message || 'Diagnostic assessment encountered an error.',
      isFallback: true,
    });
  }
});

// Repair vs Replace AI Advisor endpoint
app.post('/api/ai/repair-vs-replace', async (req, res) => {
  try {
    const {
      category,
      brand,
      ageYears,
      originalPrice,
      quoteAmount,
      issueSummary,
      language = 'en',
    } = req.body;

    const targetLangName =
      language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English';

    const fallbackAnalysis = () => {
      const parsedQuote = Number(quoteAmount) || 0;
      const parsedAge = Number(ageYears) || 3;
      const benchmarkLife = category === 'Refrigerator' ? 10 : category === 'Air Conditioner' ? 9 : category === 'Washing Machine' ? 8 : 7;
      const estNew = category === 'Air Conditioner' ? 39000 : category === 'Refrigerator' ? 28000 : category === 'Washing Machine' ? 32000 : 15000;
      const costRatio = estNew > 0 ? (parsedQuote / estNew) * 100 : 0;
      const ageRatio = (parsedAge / benchmarkLife) * 100;
      const isRepair = !(costRatio > 50 && ageRatio > 50);

      const enAnalysis = isRepair
        ? `Economically sound to repair: Repair quote of ₹${parsedQuote} is ${costRatio.toFixed(0)}% of modern new replacement cost (₹${estNew}). The appliance has completed ${parsedAge} of ${benchmarkLife} estimated years, with ${Math.max(0, benchmarkLife - parsedAge)} serviceable years remaining.`
        : `Replacement is economically advised: Repair quote of ₹${parsedQuote} exceeds 50% threshold of new equivalent model (₹${estNew}) and unit is ${parsedAge} years old (${ageRatio.toFixed(0)}% of design lifespan). Recurring component fatigue is probable.`;

      const knAnalysis = isRepair
        ? `ರಿಪೇರಿ ಮಾಡಿಸುವುದು ಆರ್ಥಿಕವಾಗಿ ಲಾಭದಾಯಕ: ರಿಪೇರಿ ವೆಚ್ಚ ₹${parsedQuote} ಹೊಸ ಉಪಕರಣದ ಬೆಲೆಯ (₹${estNew}) ${costRatio.toFixed(0)}% ಆಗಿದೆ. ಉಪಕರಣದ ಅಂದಾಜು ಜೀವಿತಾವಧಿ ${benchmarkLife} ವರ್ಷಗಳಲ್ಲಿ ಇನ್ನೂ ${Math.max(0, benchmarkLife - parsedAge)} ವರ್ಷಗಳ ಸೇವೆ ಉಳಿದಿದೆ.`
        : `ಹೊಸ ಉಪಕರಣ ಖರೀದಿಸುವುದು ಸೂಕ್ತ: ರಿಪೇರಿ ವೆಚ್ಚ ₹${parsedQuote} ಹೊಸ ಉಪಕರಣದ ಬೆಲೆಯ 50% ಕ್ಕಿಂತ ಹೆಚ್ಚಿದೆ ಮತ್ತು ಉಪಕರಣವು ${parsedAge} ವರ್ಷ ಹಳೆಯದಾಗಿದೆ (${ageRatio.toFixed(0)}% ಜೀವಿತಾವಧಿ ಪೂರ್ಣಗೊಂಡಿದೆ).`;

      const hiAnalysis = isRepair
        ? `मरम्मत कराना आर्थिक रूप से उचित है: ₹${parsedQuote} की मरम्मत लागत नए मॉडल (₹${estNew}) के ${costRatio.toFixed(0)}% है। ${benchmarkLife} वर्ष के औसत जीवनकाल में से अभी भी ${Math.max(0, benchmarkLife - parsedAge)} वर्ष की सेवा शेष है।`
        : `नया उपकरण खरीदना बेहतर विकल्प है: ₹${parsedQuote} की मरम्मत नए उपकरण (₹${estNew}) की कीमत के 50% से अधिक है और उपकरण ${parsedAge} वर्ष पुराना हो चुका है (${ageRatio.toFixed(0)}% जीवनकाल समाप्त)।`;

      const chosenAnalysis = language === 'kn' ? knAnalysis : language === 'hi' ? hiAnalysis : enAnalysis;

      const assumptions = language === 'kn' ? [
        `ಭಾರತೀಯ ಹವಾಮಾನದಲ್ಲಿ ${category} ಸರಾಸರಿ ಆಯುಷ್ಯ: ${benchmarkLife} ವರ್ಷಗಳು`,
        `ಹೊಸ 5-ಸ್ಟಾರ್ ಇನ್ವರ್ಟರ್ ಮಾದರಿಯಿಂದ ವಾರ್ಷಿಕ ಸುಮಾರು ₹1,800 ವಿದ್ಯುತ್ ಉಳಿತಾಯ`,
        `ರಿಪೇರಿ ನಂತರದ 1 ವರ್ಷದ ಬಿಡಿಭಾಗಗಳ ವಾರಂಟಿ ಮತ್ತು ವಾರ್ಷಿಕ ಸಾಮಾನ್ಯ ನಿರ್ವಹಣೆ`,
        `ಹಳೆಯ ಉಪಕರಣದ ಗುಜರಿ / ಸ್ಕ್ರ್ಯಾಪ್ ಮೌಲ್ಯ: ಅಂದಾಜು ₹800 - ₹1,500`
      ] : language === 'hi' ? [
        `भारतीय परिस्थितियों में ${category} का अनुमानित जीवनकाल: ${benchmarkLife} वर्ष`,
        `नए 5-स्टार इन्वर्टर मॉडल से वार्षिक अनुमानित ₹1,800 बिजली की बचत`,
        `मरम्मत के बाद 1 वर्ष की पार्ट्स वारंटी और सामान्य वार्षिक रखरखाव`,
        `पुराने उपकरण का अनुमानित स्क्रैप / एक्सचेंज मूल्य: ₹800 - ₹1,500`
      ] : [
        `Average Indian environmental lifespan benchmark for ${category}: ${benchmarkLife} years`,
        `Estimated annual electricity savings of ~INR 1,800 with modern 5-star inverter models`,
        `Assumed 1-year warranty on major repaired parts with nominal wear thereafter`,
        `Scrap / trade-in residual value of existing unit estimated at INR 800 - INR 1,500`
      ];

      return {
        recommendation: isRepair ? 'Repair Recommended' : 'Replace Recommended',
        lifespanBenchmarkYears: benchmarkLife,
        remainingLifespanEstimateYears: Math.max(0, benchmarkLife - parsedAge),
        estimatedNewReplacementCostInr: estNew,
        costRatioPercentage: Math.round(costRatio),
        economicAnalysis: chosenAnalysis,
        energyEfficiencyConsideration: language === 'kn'
          ? 'ಹೊಸ BEE 5-ಸ್ಟಾರ್ ಉಪಕರಣಗಳು ಸುಮಾರು 25-35% ಕಡಿಮೆ ವಿದ್ಯುತ್ ಬಳಸುತ್ತವೆ.'
          : language === 'hi'
          ? 'नए BEE 5-स्टार मॉडल लगभग 25-35% कम बिजली की खपत करते हैं।'
          : 'Modern BEE 5-star appliances consume ~25-35% less power than 4+ year old models.',
        assumptions,
      };
    };

    if (!aiClient) {
      return res.json(fallbackAnalysis());
    }

    const prompt = `You are FixTrace Life-Cycle & Economics Advisor for home appliances in India.
Appliance Category: ${category}
Brand: ${brand || 'Standard'}
Age: ${ageYears} years
Original Purchase Price: INR ${originalPrice || 'Unknown'}
Repair Quote: INR ${quoteAmount}
Issue: ${issueSummary || 'Fault requiring repair'}
Target Language: ${targetLangName}

Evaluate repair vs replacement considering typical Indian household lifespan (e.g., Split AC 8-10 yrs, Refrigerator 10-12 yrs, Washing Machine 7-10 yrs, Microwave 6-8 yrs, Geyser 5-7 yrs), the 50% financial rule, modern energy efficiency (BEE 5-star inverters vs older compressors), and spare parts availability in India.

CRITICAL: Provide "economicAnalysis", "energyEfficiencyConsideration", "environmentalImpactNote", and every item in "assumptions" translated fluently into ${targetLangName}.`;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendation: { type: Type.STRING },
              lifespanBenchmarkYears: { type: Type.NUMBER },
              remainingLifespanEstimateYears: { type: Type.NUMBER },
              estimatedNewReplacementCostInr: { type: Type.NUMBER },
              costRatioPercentage: { type: Type.NUMBER },
              economicAnalysis: { type: Type.STRING },
              energyEfficiencyConsideration: { type: Type.STRING },
              environmentalImpactNote: { type: Type.STRING },
              assumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'recommendation',
              'lifespanBenchmarkYears',
              'remainingLifespanEstimateYears',
              'estimatedNewReplacementCostInr',
              'costRatioPercentage',
              'economicAnalysis',
              'assumptions',
            ],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) return res.json(fallbackAnalysis());
      return res.json(JSON.parse(text));
    } catch (aiErr) {
      console.warn('Gemini advisor failed, using economic fallback:', aiErr);
      return res.json(fallbackAnalysis());
    }
  } catch (error: any) {
    console.error('Repair vs Replace Route Error:', error);
    return res.status(500).json({ error: error.message || 'Evaluation error' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FixTrace server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
