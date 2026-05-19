import { useState, useEffect } from 'react';
import { Settings, Zap, Wand2, Copy, Check, BarChart2 } from 'lucide-react';
import { SettingsModal } from './components/SettingsModal';
import { DiffView } from './components/DiffView';
import { BenchmarkModal } from './components/BenchmarkModal';
import { quickDiet, smartOptimize } from './utils/optimizer';
import type { OptimizerSettings } from './utils/optimizer';
import { OptimizerError } from './utils/errors';
import { countTokens } from './utils/tokenizer';
import './App.css';

function App() {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  
  const [originalTokens, setOriginalTokens] = useState(0);
  const [optimizedTokens, setOptimizedTokens] = useState(0);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<OptimizerSettings>({
    ollamaUrl: 'http://localhost:11434'
  });
  
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'ollama'>('openai');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [technicalMode, setTechnicalMode] = useState(false);
  const [viewMode, setViewMode] = useState<'result' | 'diff'>('result');
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tokenDietSettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  // Update token counts when prompts change
  useEffect(() => {
    setOriginalTokens(countTokens(originalPrompt));
  }, [originalPrompt]);

  useEffect(() => {
    setOptimizedTokens(countTokens(optimizedPrompt));
  }, [optimizedPrompt]);

  const handleSaveSettings = (newSettings: OptimizerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('tokenDietSettings', JSON.stringify(newSettings));
  };

  const handleQuickDiet = () => {
    const cleaned = quickDiet(originalPrompt);
    setOptimizedPrompt(cleaned);
  };

  const handleSmartOptimize = async () => {
    if (!originalPrompt.trim()) return;
    
    // Missing Key Validation
    if (provider === 'openai' && !settings.openAIKey) {
      alert("API Key required. Save your OpenAI key in Settings.");
      setIsSettingsOpen(true);
      return;
    }
    if (provider === 'anthropic' && !settings.anthropicKey) {
      alert("API Key required. Save your Anthropic key in Settings.");
      setIsSettingsOpen(true);
      return;
    }
    
    setIsOptimizing(true);
    try {
      const optimized = await smartOptimize(originalPrompt, settings, provider, technicalMode);
      setOptimizedPrompt(optimized);
      setViewMode('result'); // Switch back to result view on new optimization
    } catch (err: any) {
      if (err instanceof OptimizerError && err.code === 'MISSING_KEY_ERROR') {
        alert("API Key required. Please save your key in Settings.");
        setIsSettingsOpen(true);
      } else {
        alert(`Optimization failed: ${err.message}`);
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savings = originalTokens > 0 ? Math.max(0, originalTokens - optimizedTokens) : 0;
  const savingsPercent = originalTokens > 0 ? Math.round((savings / originalTokens) * 100) : 0;

  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <div className="logo">
          <Zap size={28} className="logo-icon" />
          <h1>Token Diet</h1>
        </div>
        <div className="header-actions">
          <select 
            className="provider-select"
            value={provider} 
            onChange={(e) => setProvider(e.target.value as any)}
          >
            <option value="openai">OpenAI (BYOK)</option>
            <option value="anthropic">Anthropic (BYOK)</option>
            <option value="ollama">Local Ollama</option>
          </select>
          <button className="icon-btn" onClick={() => setIsBenchmarkOpen(true)} title="Benchmark">
            <BarChart2 size={22} />
          </button>
          <button className="icon-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
            <Settings size={22} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="panels-container">
          {/* Original Prompt Panel */}
          <div className="panel original-panel glass-panel">
            <div className="panel-header">
              <h2>Original Prompt</h2>
              <div className="token-badge">
                {originalTokens} <span className="token-label">tokens</span>
              </div>
            </div>
            <textarea
              className="prompt-textarea"
              placeholder="Paste your prompt here..."
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
            />
          </div>

          {/* Action Center */}
          <div className="action-center">
            <div className="technical-mode-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={technicalMode} 
                  onChange={(e) => setTechnicalMode(e.target.checked)} 
                />
                Technical Mode
              </label>
            </div>
            <button className="btn btn-secondary action-btn" onClick={handleQuickDiet} disabled={!originalPrompt}>
              <Zap size={18} />
              Quick Diet (Regex)
            </button>
            <button className="btn btn-primary action-btn" onClick={handleSmartOptimize} disabled={!originalPrompt || isOptimizing}>
              <Wand2 size={18} />
              {isOptimizing ? 'Optimizing...' : 'Smart Optimize'}
            </button>
          </div>

          {/* Optimized Prompt Panel */}
          <div className="panel optimized-panel glass-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2>Optimized Prompt</h2>
                {optimizedPrompt && (
                  <div className="view-toggles">
                    <button 
                      className={`view-toggle-btn ${viewMode === 'result' ? 'active' : ''}`}
                      onClick={() => setViewMode('result')}
                    >Result</button>
                    <button 
                      className={`view-toggle-btn ${viewMode === 'diff' ? 'active' : ''}`}
                      onClick={() => setViewMode('diff')}
                    >Diff</button>
                  </div>
                )}
              </div>
              <div className="header-right">
                {savings > 0 && (
                  <div className="savings-badge">
                    -{savingsPercent}% ({savings} saved)
                  </div>
                )}
                <div className="token-badge highlight">
                  {optimizedTokens} <span className="token-label">tokens</span>
                </div>
              </div>
            </div>
            
            {viewMode === 'result' ? (
              <textarea
                className="prompt-textarea"
                placeholder="Your optimized prompt will appear here..."
                value={optimizedPrompt}
                onChange={(e) => setOptimizedPrompt(e.target.value)}
              />
            ) : (
              <div className="diff-view-wrapper">
                <DiffView original={originalPrompt} optimized={optimizedPrompt} />
              </div>
            )}
            
            {optimizedPrompt && viewMode === 'result' && (
              <div className="panel-footer">
                <button className="btn btn-outline" onClick={handleCopy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={handleSaveSettings}
      />
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        settings={settings}
        userPrompt={originalPrompt}
      />
    </div>
  );
}

export default App;
