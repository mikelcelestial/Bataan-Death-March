
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { RACE_DATA } from '../constants';
import { RaceType } from '../types';
import { Play, Pause, RotateCcw, Zap, Brain, ChevronRight, Info, Utensils, Droplets, Footprints, Target, Clock } from 'lucide-react';

interface RunWalkStrategyProps {
  raceType: RaceType;
}

const RunWalkStrategy: React.FC<RunWalkStrategyProps> = ({ raceType }) => {
  const raceInfo = RACE_DATA[raceType];
  const [runMinutes, setRunMinutes] = useState(4);
  const [walkMinutes, setWalkMinutes] = useState(1);
  const [paceGoal, setPaceGoal] = useState(raceInfo.defaultPace);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'RUN' | 'WALK'>('RUN');
  const [timeLeft, setTimeLeft] = useState(4 * 60);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setPaceGoal(raceInfo.defaultPace);
    setAdvice(null);
  }, [raceType, raceInfo.defaultPace]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const nextMode = mode === 'RUN' ? 'WALK' : 'RUN';
      setMode(nextMode);
      setTimeLeft((nextMode === 'RUN' ? runMinutes : walkMinutes) * 60);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, runMinutes, walkMinutes]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMode('RUN');
    setTimeLeft(runMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateFinishTime = () => {
    const totalMinutes = paceGoal * raceInfo.distance;
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getAdvice = async () => {
    setAdvisorLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am running the Bataan Death March ${raceInfo.distance}km Ultramarathon. I am using ${runMinutes}m run and ${walkMinutes}m walk with a target pace of ${paceGoal} min/km. Provide a unique, expert tip for heat management at the 60km mark.`,
        config: { temperature: 0.7 }
      });
      setAdvice(response.text || "Keep your heart rate steady.");
    } catch (e) {
      setAdvice("Prioritize cooling your head and neck every 5km.");
    } finally {
      setAdvisorLoading(false);
    }
  };

  const progress = (timeLeft / (mode === 'RUN' ? runMinutes * 60 : walkMinutes * 60)) * 100;

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`relative overflow-hidden bg-slate-900 border-2 rounded-3xl p-8 text-center transition-colors duration-500 ${mode === 'RUN' ? 'border-red-500/30' : 'border-blue-500/30'}`}>
        <div className={`absolute top-0 left-0 h-1 transition-all duration-1000 ${mode === 'RUN' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${100 - progress}%` }} />
        <span className={`text-xs font-bold uppercase tracking-[0.3em] ${mode === 'RUN' ? 'text-red-500' : 'text-blue-500'}`}>
          {mode === 'RUN' ? 'Running Interval' : 'Walking Recovery'}
        </span>
        <div className="my-4">
          <span className="text-7xl font-black tabular-nums tracking-tight text-white">
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={toggleTimer} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-slate-800 text-white shadow-inner' : 'bg-white text-slate-950 shadow-xl shadow-white/5'}`}>
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button onClick={resetTimer} className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Pace Goal & Prediction
          </h4>
          <span className="text-xs font-bold text-red-500">{calculateFinishTime()} Est. Finish</span>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">Target Pace (min/km)</span>
              <span className="text-sm font-bold text-white">{paceGoal.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="5" max="15" step="0.5" 
              value={paceGoal} 
              onChange={(e) => setPaceGoal(parseFloat(e.target.value))}
              className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Run (Min)</label>
          <div className="flex items-center gap-4">
            <input type="range" min="1" max="20" step="1" value={runMinutes} onChange={(e) => { const val = parseInt(e.target.value); setRunMinutes(val); if (!isActive) setTimeLeft(val * 60); }} className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none" />
            <span className="text-xl font-bold text-white min-w-[2ch]">{runMinutes}</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Walk (Min)</label>
          <div className="flex items-center gap-4">
            <input type="range" min="1" max="10" step="1" value={walkMinutes} onChange={(e) => setWalkMinutes(parseInt(e.target.value))} className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none" />
            <span className="text-xl font-bold text-white min-w-[2ch]">{walkMinutes}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Target className="w-3 h-3" />
            Race Milestones (KM)
          </h4>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
          {raceInfo.milestones.map((m) => (
            <div key={m.km} className="flex-shrink-0 w-48 snap-center">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                    <Utensils className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-lg font-black text-white italic">KM {m.km}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-100 mb-1">{m.title}</h5>
                <p className="text-[10px] text-slate-400 leading-normal">{m.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-3xl" />
        <div className="relative bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">AI Strategy Advisor</h3>
                <p className="text-[10px] text-slate-400 mt-1">Real-time ultramarathon intelligence</p>
              </div>
            </div>
            {!advice && !advisorLoading && (
              <button onClick={getAdvice} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          {advisorLoading ? (
            <div className="flex items-center gap-3 p-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-150" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-300" />
              <span className="text-xs font-medium text-slate-500 italic">Processing terrain data...</span>
            </div>
          ) : advice && (
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-slate-300 leading-relaxed italic">"{advice}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunWalkStrategy;
