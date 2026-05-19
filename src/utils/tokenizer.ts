import { encode } from 'gpt-tokenizer';

/**
 * Counts the number of tokens in a given string using gpt-tokenizer.
 * @param text The input text to tokenize.
 * @returns The number of tokens.
 */
export const countTokens = (text: string): number => {
  if (!text) return 0;
  try {
    return encode(text).length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    return 0;
  }
};
