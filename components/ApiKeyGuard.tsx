
import React from 'react';
import { ShieldAlert, Key, ArrowRight, ExternalLink } from 'lucide-react';

interface ApiKeyGuardProps {
  onKeySelected: () => void;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ onKeySelected }) => {
  const handleOpenSelector = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      onKeySelected();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center animate-in fade-in zoom-in-95">
      <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-blue-500/20">
        <ShieldAlert className="w-10 h-10 text-blue-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-3">Enable High-Quality Tools</h2>
      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
        To use 4K Image Generation and Pro Editing features, you need to select your own Gemini API key from a paid project.
      </p>

      <div className="w-full max-w-sm space-y-3">
        <button 
          onClick={handleOpenSelector}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20 group"
        >
          <Key className="w-5 h-5" />
          Select API Key
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest pt-2"
        >
          Billing Documentation
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="mt-12 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left max-w-sm">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Note on Privacy</h4>
        <p className="text-[11px] text-slate-500 leading-normal">
          Your key selection is handled securely by the platform environment. We do not store your private credentials.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyGuard;
