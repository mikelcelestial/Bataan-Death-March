
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { ImageSize } from '../types';
import { Wand2, ImagePlus, Loader2, Download, Eraser, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

const ImageStudio: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.K1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [editSource, setEditSource] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    const gemini = new GeminiService();

    try {
      if (mode === 'generate') {
        const url = await gemini.generateImage(prompt, size);
        setResultImage(url);
      } else {
        if (!editSource) {
          alert("Please upload an image to edit first.");
          return;
        }
        const url = await gemini.editImage(editSource, prompt);
        setResultImage(url);
      }
    } catch (error) {
      console.error(error);
      alert("Operation failed. Please check your API configuration and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditSource(ev.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button 
          onClick={() => { setMode('generate'); setPrompt(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'generate' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Sparkles className="w-4 h-4" />
          Generate
        </button>
        <button 
          onClick={() => { setMode('edit'); setPrompt(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'edit' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Wand2 className="w-4 h-4" />
          Edit Photo
        </button>
      </div>

      {/* Editor/Input Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{mode === 'generate' ? 'Creation Lab' : 'Magic Editor'}</h2>
          </div>
          {mode === 'generate' && (
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value as ImageSize)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold px-2 py-1 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={ImageSize.K1}>1K Standard</option>
              <option value={ImageSize.K2}>2K High-Res</option>
              <option value={ImageSize.K4}>4K Ultra</option>
            </select>
          )}
        </div>

        <div className="p-5 space-y-4">
          {mode === 'edit' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative border-2 border-dashed border-slate-800 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-slate-700 transition-colors bg-slate-800/20"
            >
              {editSource ? (
                <img src={editSource} className="w-full h-full object-cover rounded-xl" alt="Source" />
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 text-slate-600 group-hover:text-slate-400 mb-3 transition-colors" />
                  <p className="text-sm text-slate-500 font-medium">Select a photo from your trek</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          )}

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'generate' ? "A heroic ultramarathon runner crossing the finish line at sunrise in a cinematic style..." : "Add a retro filter and make the sky more dramatic..."}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px] resize-none"
            />
            <button
              onClick={handleAction}
              disabled={isProcessing || !prompt.trim() || (mode === 'edit' && !editSource)}
              className="absolute bottom-4 right-4 bg-white text-slate-950 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'generate' ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              {isProcessing ? 'Thinking...' : mode === 'generate' ? 'Generate' : 'Apply'}
            </button>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {resultImage && (
        <div className="space-y-4 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Masterpiece Ready</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage;
                  link.download = `bdm102-${Date.now()}.png`;
                  link.click();
                }}
                className="bg-slate-800 p-2 rounded-lg border border-slate-700 hover:bg-slate-700"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setResultImage(null); setEditSource(null); }}
                className="bg-red-900/20 text-red-500 p-2 rounded-lg border border-red-500/20 hover:bg-red-900/30"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-slate-900 p-2 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5">
            <img src={resultImage} className="w-full rounded-2xl" alt="AI Generated" />
          </div>
        </div>
      )}

      {/* Quick Suggestions */}
      {!resultImage && !isProcessing && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <SlidersHorizontal className="w-3 h-3" />
            Quick Suggestions
          </h4>
          <div className="flex flex-wrap gap-2 px-1">
            {mode === 'generate' ? [
              "Vintage film style", "Sunset silhouette", "Cinematic drone shot", "Pencil sketch"
            ].map(suggestion => (
              <button key={suggestion} onClick={() => setPrompt(prev => prev + " " + suggestion)} className="bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-full text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                {suggestion}
              </button>
            )) : [
              "Enhance colors", "Add retro filter", "Make it black and white", "Remove background"
            ].map(suggestion => (
              <button key={suggestion} onClick={() => setPrompt(suggestion)} className="bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-full text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageStudio;
