
import React, { useState, useEffect } from 'react';
import { RACE_DATA } from '../constants';
import { RouteMarker, RaceType } from '../types';
import { CacheService } from '../services/cacheService';
import { GPXService } from '../services/gpxService';
import { Info, Navigation, Trophy, Ruler, WifiOff, CloudDownload, CheckCircle2, Download, Users } from 'lucide-react';

interface MapDisplayProps {
  raceType: RaceType;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ raceType }) => {
  const raceInfo = RACE_DATA[raceType];
  const [selectedMarker, setSelectedMarker] = useState<RouteMarker | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Reset selected marker when race type changes
    setSelectedMarker(raceInfo.route[0]);
    
    // Load persisted state if it matches the current race
    const lastMarker = CacheService.getState('last_marker');
    if (lastMarker && raceInfo.route.some(m => m.km === lastMarker.km)) {
      setSelectedMarker(lastMarker);
    }

    // Check if data is already cached
    const cachedData = CacheService.getOfflineData();
    if (cachedData) {
      setIsCached(true);
    }
  }, [raceType, raceInfo.route]);

  const handleSyncOffline = async () => {
    setIsSyncing(true);
    // Simulate data preparation
    await new Promise(resolve => setTimeout(resolve, 800));
    await CacheService.saveToOffline({ route: raceInfo.route });
    setIsCached(true);
    setIsSyncing(false);
  };

  const handleDownloadGPX = () => {
    GPXService.downloadGPX(raceType, raceInfo.route);
  };

  const handleMarkerSelect = (marker: RouteMarker) => {
    setSelectedMarker(marker);
    CacheService.saveState('last_marker', marker);
  };

  // Normalize coordinates for the SVG box
  const minLat = Math.min(...raceInfo.route.map(m => m.lat));
  const maxLat = Math.max(...raceInfo.route.map(m => m.lat));
  const minLng = Math.min(...raceInfo.route.map(m => m.lng));
  const maxLng = Math.max(...raceInfo.route.map(m => m.lng));

  const padding = 50;
  const width = 400;
  const height = 600;

  const project = (lat: number, lng: number) => {
    const x = padding + ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding);
    const y = (height - padding) - ((lat - minLat) / (maxLat - minLat)) * (height - 2 * padding);
    return { x, y };
  };

  const pathData = raceInfo.route.reduce((acc, marker, i) => {
    const { x, y } = project(marker.lat, marker.lng);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      {/* Offline Status Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-[53px] z-40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isCached ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
              {isCached ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-yellow-500" />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Map Engine</p>
              <p className="text-xs font-bold text-white mt-0.5">{isCached ? 'Offline Ready' : 'Online Only'}</p>
            </div>
          </div>
          <button 
            onClick={handleSyncOffline}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${isCached ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
          >
            {isSyncing ? (
              <span className="flex items-center gap-2">
                <CloudDownload className="w-3.5 h-3.5 animate-bounce" />
                Syncing...
              </span>
            ) : isCached ? (
              'Update Cache'
            ) : (
              <>
                <CloudDownload className="w-3.5 h-3.5" />
                Cache for Offline
              </>
            )}
          </button>
          
          <button 
            onClick={handleDownloadGPX}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all shadow-lg shadow-black/20"
            title="Download GPX for Smartwatch"
          >
            <Download className="w-3.5 h-3.5" />
            <span>GPX</span>
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex-shrink-0 flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <Ruler className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold">{raceInfo.distance} KM</span>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">Cutoffs</span>
              <span className="text-xs font-bold text-white mt-1">50K: 9h | 102K: 18h</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/30">
            <Users className="w-4 h-4 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">Pacers</span>
              <span className="text-xs font-bold text-white mt-1">
                {raceType === RaceType.BDM102 ? 'NONE' : 'FROM 102K'}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/30">
            <Navigation className="w-4 h-4 text-green-500" />
            <span className="text-sm font-bold text-green-500">VECTOR RENDER</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col items-center">
        <div className="relative w-full max-w-lg aspect-[2/3] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mb-6">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full p-4 drop-shadow-lg">
            {/* Route Path Background */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeOpacity="0.05"
              strokeDasharray="4 4"
            />
            {/* Main Red Route */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            />

            {/* Markers */}
            {raceInfo.route.map((marker, idx) => {
              const { x, y } = project(marker.lat, marker.lng);
              const isSelected = selectedMarker?.km === marker.km;
              return (
                <g 
                  key={marker.km} 
                  onClick={() => handleMarkerSelect(marker)}
                  className="cursor-pointer group"
                >
                  <circle 
                    cx={x} cy={y} 
                    r={isSelected ? "10" : "6"} 
                    fill={isSelected ? "#ef4444" : idx === 0 || idx === raceInfo.route.length - 1 ? "#fff" : "#1e293b"} 
                    stroke={isSelected ? "white" : "#475569"} 
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all duration-300"
                  />
                  {isSelected && (
                    <circle cx={x} cy={y} r="14" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-ping" />
                  )}
                  {/* Significant Labels */}
                  {(idx === 0 || idx === raceInfo.route.length - 1 || isSelected) && (
                    <text 
                      x={x + 14} 
                      y={y + 4} 
                      fill="white" 
                      fontSize="11" 
                      fontWeight="800" 
                      className="pointer-events-none drop-shadow-md"
                    >
                      {idx === 0 ? 'START' : idx === raceInfo.route.length - 1 ? 'FINISH' : `KM ${marker.km}`}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <div className="bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Bataan High Road</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 backdrop-blur-sm text-white hover:bg-slate-700 transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        {selectedMarker && (
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 p-5 animate-in slide-in-from-bottom-4 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                   <span className="text-red-500 font-black text-xs uppercase tracking-tighter">Checkpoint KM {selectedMarker.km}</span>
                   {isCached && <span className="bg-green-500/20 text-green-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-green-500/20">OFFLINE DATA</span>}
                </div>
                <h3 className="text-xl font-black text-white mt-1 leading-tight">{selectedMarker.name}</h3>
              </div>
              <div className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <span className="text-xs font-bold text-red-500">
                  {selectedMarker.km === 0 ? 'MARIVELES' : selectedMarker.km === raceInfo.distance ? (raceType === RaceType.BDM102 ? 'SAN FERNANDO' : 'CAPAS') : 'ACTIVE'}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              {selectedMarker.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 group hover:border-red-500/30 transition-colors">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Terrain</span>
                <span className="text-sm font-bold text-slate-200">Asphalt Road</span>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 group hover:border-red-500/30 transition-colors">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Pace Goal</span>
                <span className="text-sm font-bold text-slate-200">{raceInfo.defaultPace} min/km</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;
