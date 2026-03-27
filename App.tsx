
import React, { useState, useEffect } from 'react';
import { AppTab, RaceType } from './types';
import { BDM102_ROUTE, BDM160_ROUTE } from './constants';
import { GPXService } from './services/gpxService';
import MapDisplay from './components/MapDisplay';
import ImageStudio from './components/ImageStudio';
import RunWalkStrategy from './components/RunWalkStrategy';
import SupportCrewView from './components/SupportCrewView';
import ApiKeyGuard from './components/ApiKeyGuard';
import { Map, Image as ImageIcon, History, ShieldCheck, Timer, Truck, ChevronDown, Download } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MAP);
  const [raceType, setRaceType] = useState<RaceType>(RaceType.BDM102);
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [showRaceSelector, setShowRaceSelector] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const hasKey = await window.aistudio?.hasSelectedApiKey();
      setIsApiKeySet(!!hasKey);
    };
    checkKey();
  }, []);

  const handleKeySelected = () => {
    setIsApiKeySet(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showRaceSelector && (
        <div 
          className="fixed inset-0 z-[65] bg-black/20 backdrop-blur-[2px]" 
          onClick={() => setShowRaceSelector(false)} 
        />
      )}
      <header className="sticky top-0 z-[70] bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowRaceSelector(!showRaceSelector)}
              className="flex items-center gap-1 group"
            >
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none flex items-center gap-1">
                  {raceType === RaceType.BDM102 ? 'BDM 102' : 'BDM 160'}
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showRaceSelector ? 'rotate-180' : ''}`} />
                </h1>
                <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-widest mt-0.5">Ultramarathon Companion</p>
              </div>
            </button>

            {showRaceSelector && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => { setRaceType(RaceType.BDM102); setShowRaceSelector(false); }}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-800 border-b border-slate-800/50 ${raceType === RaceType.BDM102 ? 'bg-red-500/5' : ''}`}
                >
                  <div className={`text-sm font-bold ${raceType === RaceType.BDM102 ? 'text-red-500' : 'text-slate-300'}`}>BDM 102</div>
                  <div className="text-[10px] text-slate-500 font-medium">Start: 10:00 PM (22:00)</div>
                </button>
                <button 
                  onClick={() => { setRaceType(RaceType.BDM160); setShowRaceSelector(false); }}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-800 ${raceType === RaceType.BDM160 ? 'bg-red-500/5' : ''}`}
                >
                  <div className={`text-sm font-bold ${raceType === RaceType.BDM160 ? 'text-red-500' : 'text-slate-300'}`}>BDM 160</div>
                  <div className="text-[10px] text-slate-500 font-medium">Start: 05:00 AM (05:00)</div>
                </button>
                
                <div className="bg-slate-950/50 p-2 border-t border-slate-800">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 mb-1">Download GPX</p>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); GPXService.downloadGPX(RaceType.BDM102, BDM102_ROUTE); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      102KM
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); GPXService.downloadGPX(RaceType.BDM160, BDM160_ROUTE); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      160KM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isApiKeySet && (
          <button
            onClick={async () => {
              // @ts-ignore
              await window.aistudio?.openSelectKey();
              handleKeySelected();
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Pro Mode</span>
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {!isApiKeySet && activeTab === AppTab.STUDIO ? (
          <ApiKeyGuard onKeySelected={handleKeySelected} />
        ) : (
          <>
            {activeTab === AppTab.MAP && <MapDisplay raceType={raceType} />}
            {activeTab === AppTab.STRATEGY && <RunWalkStrategy raceType={raceType} />}
            {activeTab === AppTab.CREW && <SupportCrewView raceType={raceType} />}
            {activeTab === AppTab.STUDIO && <ImageStudio />}
            {activeTab === AppTab.HISTORY && (
              <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400 p-8 text-center">
                <History className="w-12 h-12 mb-4 opacity-20" />
                <h2 className="text-xl font-semibold text-white">Generation History</h2>
                <p className="mt-2 text-sm max-w-xs">Your locally saved generations and race logs will appear here in future updates.</p>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-2 py-3 pb-6 flex justify-around items-center z-50">
        <NavButton 
          active={activeTab === AppTab.MAP} 
          onClick={() => setActiveTab(AppTab.MAP)}
          icon={<Map className="w-6 h-6" />}
          label="Route"
        />
        <NavButton 
          active={activeTab === AppTab.STRATEGY} 
          onClick={() => setActiveTab(AppTab.STRATEGY)}
          icon={<Timer className="w-6 h-6" />}
          label="Pacing"
        />
        <NavButton 
          active={activeTab === AppTab.CREW} 
          onClick={() => setActiveTab(AppTab.CREW)}
          icon={<Truck className="w-6 h-6" />}
          label="Crew"
        />
        <NavButton 
          active={activeTab === AppTab.STUDIO} 
          onClick={() => setActiveTab(AppTab.STUDIO)}
          icon={<ImageIcon className="w-6 h-6" />}
          label="Studio"
        />
        <NavButton 
          active={activeTab === AppTab.HISTORY} 
          onClick={() => setActiveTab(AppTab.HISTORY)}
          icon={<History className="w-6 h-6" />}
          label="Logs"
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors flex-1 min-w-0 ${active ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
