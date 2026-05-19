import React, { useState, useEffect } from 'react';
import { X, Play, Loader2 } from 'lucide-react';
import { smartOptimize } from '../utils/optimizer';
import type { OptimizerSettings } from '../utils/optimizer';
import { countTokens } from '../utils/tokenizer';
import { OptimizerError } from '../utils/errors';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OptimizerSettings;
  userPrompt: string;
}

interface BenchmarkResult {
  provider: 'openai' | 'anthropic' | 'ollama';
  promptType: 'Standard' | 'Custom';
  timeMs: number | null;
  originalTokens: number;
  optimizedTokens: number | null;
  savingsPercent: number | null;
  error?: string;
}

const STANDARD_PROMPT = `Hello! Could you please be so kind as to help me write a Python script? I would greatly appreciate it if you could make it print out "Hello, World!" to the console, if you don't mind. Thank you so much for your time and assistance!`;

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({ isOpen, onClose, settings, userPrompt }) => {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Reset results when modal opens
  useEffect(() => {
    if (isOpen) {
      setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runBenchmarkForPrompt = async (prompt: string, type: 'Standard' | 'Custom', provider: 'openai' | 'anthropic' | 'ollama') => {
    const originalTokens = countTokens(prompt);
    let timeMs = null;
    let optimizedTokens = null;
    let savingsPercent = null;
    let error: string | undefined = undefined;

    const start = performance.now();
    try {
      const optimized = await smartOptimize(prompt, settings, provider, true); // Use technical mode for safety
      const end = performance.now();
      timeMs = Math.round(end - start);
      optimizedTokens = countTokens(optimized);
      savingsPercent = Math.round(((originalTokens - optimizedTokens) / originalTokens) * 100);
    } catch (err: any) {
      if (err instanceof OptimizerError) {
        error = err.code === 'MISSING_KEY_ERROR' ? 'Missing API Key' : err.message;
      } else {
        error = err.message || 'Error';
      }
    }

    setResults(prev => [...prev, {
      provider,
      promptType: type,
      timeMs,
      originalTokens,
      optimizedTokens,
      savingsPercent,
      error
    }]);
  };

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setResults([]);

    const providers: Array<'openai' | 'anthropic' | 'ollama'> = ['openai', 'anthropic', 'ollama'];
    
    // Process Standard Prompt
    for (const provider of providers) {
      await runBenchmarkForPrompt(STANDARD_PROMPT, 'Standard', provider);
    }

    // Process Custom Prompt if it exists and has a reasonable length
    if (userPrompt && userPrompt.trim().length > 10) {
      for (const provider of providers) {
        await runBenchmarkForPrompt(userPrompt, 'Custom', provider);
      }
    }

    setIsRunning(false);
  };

  const calculateNetSavings = () => {
    const successfulRuns = results.filter(r => r.savingsPercent !== null);
    if (successfulRuns.length === 0) return 0;
    const totalSavings = successfulRuns.reduce((acc, curr) => acc + (curr.savingsPercent || 0), 0);
    return Math.round(totalSavings / successfulRuns.length);
  };

  const netSavings = calculateNetSavings();

  return (
    <div className="modal-overlay">
      <div className="modal-content benchmark-modal">
        <div className="modal-header">
          <h2>LLM Compression Benchmark</h2>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Compare token compression efficiency and latency across providers. This will run a standard prompt, and your current prompt (if any), through each configured provider.
          </p>

          <div className="benchmark-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleRunBenchmark} 
              disabled={isRunning}
            >
              {isRunning ? <Loader2 className="spinner" size={18} /> : <Play size={18} />}
              {isRunning ? 'Benchmarking...' : 'Run Benchmark'}
            </button>
            {results.length > 0 && !isRunning && (
              <div className="net-savings-badge">
                Average Savings: {netSavings}% per API call
              </div>
            )}
          </div>

          <div className="benchmark-table-container">
            {results.length > 0 ? (
              <table className="benchmark-table">
                <thead>
                  <tr>
                    <th>Prompt Type</th>
                    <th>Provider</th>
                    <th>Time (ms)</th>
                    <th>Tokens (Orig / Opt)</th>
                    <th>Savings %</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className={r.error ? 'error-row' : ''}>
                      <td>{r.promptType}</td>
                      <td className="capitalize">{r.provider}</td>
                      <td>{r.error ? '-' : r.timeMs}</td>
                      <td>
                        {r.error ? (
                          <span className="error-text">{r.error}</span>
                        ) : (
                          <>{r.originalTokens} → <span className="highlight-text">{r.optimizedTokens}</span></>
                        )}
                      </td>
                      <td>{r.error ? '-' : <span className="highlight-text">{r.savingsPercent}%</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-benchmark">
                Click "Run Benchmark" to start.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
