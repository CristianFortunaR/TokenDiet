export interface OptimizerSettings {
  openAIKey?: string;
  anthropicKey?: string;
  ollamaUrl?: string; // Default: http://localhost:11434
}

import { OptimizerError } from './errors';

/**
 * Basic Diet: Applies Regex to clean up the prompt.
 * Removes extra whitespace and polite filler words.
 */
export const quickDiet = (prompt: string): string => {
  let cleaned = prompt;
  
  // Remove basic filler words (case insensitive)
  const fillers = [
    'please', 'could you', 'would you', 'can you', 'kindly',
    "if you don't mind", "i would like to", "i want you to"
  ];
  
  fillers.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  // Remove extra whitespace and newlines
  cleaned = cleaned.replace(/\s{2,}/g, ' '); // collapse multiple spaces
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // collapse multiple newlines
  
  return cleaned.trim();
};

/**
 * Smart Optimize: Sends prompt to OpenAI for compression.
 */
const optimizeWithOpenAI = async (prompt: string, apiKey: string, technicalMode: boolean): Promise<string> => {
  const systemPrompt = `Rewrite the user's prompt into a concise, high-density instruction format. Remove all conversational filler. Preserve all technical constraints and requirements. Respond ONLY with the optimized prompt text. DO NOT include any introductory phrases, explanations, or formatting like 'Here is the rewritten prompt:' or markdown blocks around the text.${technicalMode ? ' Preserve all JSON structures, Markdown tables, and complex formatting exactly as provided.' : ''}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new OptimizerError('OpenAI API request failed.', 'API_ERROR');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

/**
 * Smart Optimize: Sends prompt to Anthropic for compression.
 */
const optimizeWithAnthropic = async (prompt: string, apiKey: string, technicalMode: boolean): Promise<string> => {
  const systemPrompt = `Rewrite the user's prompt into a concise, high-density instruction format. Remove all conversational filler. Preserve all technical constraints and requirements. Respond ONLY with the optimized prompt text. DO NOT include any introductory phrases, explanations, or formatting like 'Here is the rewritten prompt:' or markdown blocks around the text.${technicalMode ? ' Preserve all JSON structures, Markdown tables, and complex formatting exactly as provided.' : ''}`;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new OptimizerError('Anthropic API request failed.', 'API_ERROR');
  }

  const data = await response.json();
  return data.content[0].text.trim();
};

/**
 * Smart Optimize: Sends prompt to Local Ollama for compression.
 */
const optimizeWithOllama = async (prompt: string, url: string, technicalMode: boolean): Promise<string> => {
  const systemPrompt = `Rewrite the user's prompt into a concise, high-density instruction format. Remove all conversational filler. Preserve all technical constraints and requirements. Respond ONLY with the optimized prompt text. DO NOT include any introductory phrases, explanations, or formatting like 'Here is the rewritten prompt:' or markdown blocks around the text.${technicalMode ? ' Preserve all JSON structures, Markdown tables, and complex formatting exactly as provided.' : ''}`;
  const targetUrl = url || 'http://localhost:11434';
  const response = await fetch(`${targetUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3', // User can change this in settings ideally, but default to llama3
      system: systemPrompt,
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new OptimizerError('Ollama API request failed. Ensure Ollama is running and CORS is configured.', 'NETWORK_ERROR');
  }

  const data = await response.json();
  return data.response.trim();
};

/**
 * Smart Optimize Entry Point
 */
export const smartOptimize = async (
  prompt: string, 
  settings: OptimizerSettings, 
  provider: 'openai' | 'anthropic' | 'ollama',
  technicalMode: boolean = false
): Promise<string> => {
  try {
    if (provider === 'openai' && !settings.openAIKey) {
      throw new OptimizerError('OpenAI API key is missing.', 'MISSING_KEY_ERROR');
    }
    if (provider === 'anthropic' && !settings.anthropicKey) {
      throw new OptimizerError('Anthropic API key is missing.', 'MISSING_KEY_ERROR');
    }

    if (provider === 'openai' && settings.openAIKey) {
      return await optimizeWithOpenAI(prompt, settings.openAIKey, technicalMode);
    }
    
    if (provider === 'anthropic' && settings.anthropicKey) {
      return await optimizeWithAnthropic(prompt, settings.anthropicKey, technicalMode);
    }
    
    if (provider === 'ollama') {
      return await optimizeWithOllama(prompt, settings.ollamaUrl || 'http://localhost:11434', technicalMode);
    }

    throw new OptimizerError('Missing configuration for selected provider.', 'UNKNOWN_ERROR');
  } catch (err) {
    console.error('Optimization error:', err);
    throw err;
  }
};
