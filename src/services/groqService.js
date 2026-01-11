import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
    console.error("VITE_GROQ_API_KEY is missing in your environment variables!");
}

const groq = new Groq({
    apiKey: apiKey || "MISSING_KEY",
    dangerouslyAllowBrowser: true
});

/**
 * Common helper to fetch JSON from Groq
 */
async function fetchGroqJSON(prompt, systemPrompt = "You are a specialized environmental AI assistant. Return only valid JSON.") {
    console.log("Groq Request:", { prompt, systemPrompt });
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        console.log("Groq Response Raw:", content);

        // Clean the content in case of markdown blocks
        const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Groq API Error Details:", error);
        if (error.status === 401) console.error("Invalid API Key");
        if (error.status === 429) console.error("Rate limit reached");
        throw error;
    }
}

export const fetchHealthGuide = async (data) => {
    const prompt = `Analyze health risks for:
    AQI: ${data.aqi} (${data.category})
    Primary Pollutant: ${data.pollutant}
    User Profile: ${data.healthProfile}
    Location: ${data.locationType}
    Activity: ${data.activityType}

    Return JSON: {
        "riskLevel": "LOW|MEDIUM|HIGH",
        "summary": "Brief analysis",
        "recommendations": {
            "outdoor": "behavior advice",
            "mask": "masking advice",
            "breathing": "breathing/hydration advice",
            "indoor": "indoor advice"
        }
    }`;
    return fetchGroqJSON(prompt);
};

export const fetchCarbonAnalysis = async (data) => {
    const prompt = `Analyze carbon footprint:
    Transport: ${data.transport}
    Diet: ${data.diet}
    Energy: ${data.energy}
    Total Tons: ${data.total}
    
    Return JSON: {
        "verdict": "Overall impact analysis",
        "swaps": ["specific action 1", "specific action 2"]
    }`;
    return fetchGroqJSON(prompt);
};

export const fetchDecisionAdvisor = async (data) => {
    const prompt = `Provide activity advice:
    AQI: ${data.aqi} (${data.category})
    Weather: ${data.temp}°C, Wind ${data.wind}km/h
    Profile: ${data.healthProfile}
    
    Return JSON: {
        "goOutside": "YES|NO",
        "maskRequired": "YES|NO",
        "bestTime": "Suggested window today",
        "indoorActions": ["action 1", "action 2"]
    }`;
    return fetchGroqJSON(prompt);
};

export const fetchChemicalFingerprint = async (pollutants) => {
    const pollStr = JSON.stringify(pollutants);
    const prompt = `Analyze chemical fingerprint for these pollutants: ${pollStr}
    
    Return JSON: {
        "type": "Traffic Exhaust|Industrial Smog|Dust Storm|etc",
        "description": "Scientific explanation of why these ratios match this source",
        "composition": [
            {"name": "Pollutant Name", "percentage": 40, "color": "hex_color"}
        ],
        "confidence": 95
    }`;
    return fetchGroqJSON(prompt);
};

export const fetchAtmosphericAnalysis = async (data) => {
    const prompt = `Analyze atmospheric patterns:
    AQI: ${data.aqi}, PM2.5: ${data.pm25}, NO2: ${data.no2}, O3: ${data.o3}
    Wind: ${data.wind}, Temp: ${data.temp}, Humidity: ${data.humidity}
    
    Return JSON: {
        "summary": "Expert atmospheric summary",
        "weatherInfluence": "How wind/humidity affects current conditions",
        "patternDetected": "Inversion|Dispersion|Stagnation|etc",
        "inferredSources": "Likely sources of current pollution mix",
        "dominantPollutant": "Pollutant name"
    }`;
    return fetchGroqJSON(prompt);
};
