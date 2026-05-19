import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { OptimizerSettings } from '../utils/optimizer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OptimizerSettings;
  onSave: (settings: OptimizerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<OptimizerSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2>Configuration</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Your API keys are stored locally in your browser and are never sent to our servers.
          </p>

          <div className="form-group">
            <label htmlFor="openAIKey">OpenAI API Key (BYOK)</label>
            <input 
              type="password" 
              id="openAIKey" 
              name="openAIKey" 
              placeholder="sk-..." 
              value={localSettings.openAIKey || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="anthropicKey">Anthropic API Key (BYOK)</label>
            <input 
              type="password" 
              id="anthropicKey" 
              name="anthropicKey" 
              placeholder="sk-ant-..." 
              value={localSettings.anthropicKey || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ollamaUrl">Local Ollama URL</label>
            <input 
              type="text" 
              id="ollamaUrl" 
              name="ollamaUrl" 
              placeholder="http://localhost:11434" 
              value={localSettings.ollamaUrl || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};
