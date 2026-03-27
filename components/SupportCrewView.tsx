
import React, { useState, useEffect } from 'react';
import { RACE_DATA, LOGISTICS_CHECKLIST } from '../constants';
import { CacheService } from '../services/cacheService';
import { ChecklistItem, RaceType } from '../types';
import { Truck, Users, CheckSquare, ListTodo, ChefHat, Info, Save, Plus, Trash2, X } from 'lucide-react';

interface SupportCrewViewProps {
  raceType: RaceType;
}

const SupportCrewView: React.FC<SupportCrewViewProps> = ({ raceType }) => {
  const raceInfo = RACE_DATA[raceType];
  const [currentKM, setCurrentKM] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [inventory, setInventory] = useState<ChecklistItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // New Item State
  const [isAdding, setIsAdding] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'gear' | 'food' | 'medical'>('gear');

  useEffect(() => {
    // Reset KM if it exceeds the new race distance
    if (currentKM > raceInfo.distance) {
      setCurrentKM(0);
    }
  }, [raceType, raceInfo.distance]);

  useEffect(() => {
    // Load persisted KM
    const savedKM = CacheService.getState('crew_km');
    if (savedKM !== null) setCurrentKM(savedKM);

    // Load persisted checked status
    const savedChecked = CacheService.getState('crew_checked_ids');
    if (savedChecked) setCheckedItems(new Set<string>(savedChecked as string[]));

    // Load persisted inventory items, fallback to constants
    const savedInventory = CacheService.getState('crew_inventory_items');
    if (savedInventory) {
      setInventory(savedInventory);
    } else {
      setInventory(LOGISTICS_CHECKLIST);
    }
  }, []);

  const persistInventory = (updatedInventory: ChecklistItem[]) => {
    setInventory(updatedInventory);
    CacheService.saveState('crew_inventory_items', updatedInventory);
    triggerSaveIndicator();
  };

  const persistChecked = (updatedChecked: Set<string>) => {
    setCheckedItems(updatedChecked);
    CacheService.saveState('crew_checked_ids', Array.from(updatedChecked));
    triggerSaveIndicator();
  };

  const triggerSaveIndicator = () => {
    setHasUnsavedChanges(true);
    setTimeout(() => setHasUnsavedChanges(false), 1500);
  };

  const handleKMSave = (val: number) => {
    setCurrentKM(val);
    CacheService.saveState('crew_km', val);
    triggerSaveIndicator();
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set<string>(checkedItems);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    persistChecked(newChecked);
  };

  const addItem = () => {
    if (!newItemLabel.trim()) return;
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      label: newItemLabel.trim(),
      category: newItemCategory
    };
    persistInventory([...inventory, newItem]);
    setNewItemLabel('');
    setIsAdding(false);
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger the toggle
    const updatedInventory = inventory.filter(item => item.id !== id);
    persistInventory(updatedInventory);
    
    // Also remove from checked if it was checked
    if (checkedItems.has(id)) {
      const newChecked = new Set<string>(checkedItems);
      newChecked.delete(id);
      persistChecked(newChecked);
    }
  };

  const activeTask = raceInfo.crewTasks.find(t => t.km >= currentKM) || raceInfo.crewTasks[raceInfo.crewTasks.length - 1];

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Runner Progress Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div className="h-full bg-red-600 transition-all duration-700 ease-out" style={{ width: `${(currentKM / raceInfo.distance) * 100}%` }} />
        </div>
        
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Runner Position</span>
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase tracking-tighter">
                  <Save className="w-2.5 h-2.5" />
                  Auto-Saved
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-5xl font-black text-white">{currentKM}</span>
              <span className="text-xl font-bold text-slate-700">/ {raceInfo.distance}</span>
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-2 flex gap-1 border border-slate-700 shadow-inner">
            <button onClick={() => handleKMSave(Math.max(0, currentKM - 1))} className="px-3 py-1 text-sm font-bold text-slate-400 hover:text-white transition-colors">-1</button>
            <button onClick={() => handleKMSave(Math.min(raceInfo.distance, currentKM + 1))} className="px-4 py-1 text-sm font-bold text-white bg-slate-700 rounded-xl hover:bg-slate-600 transition-all">+1</button>
          </div>
        </div>

        <input 
          type="range" min="0" max={raceInfo.distance} step="1"
          value={currentKM}
          onChange={(e) => handleKMSave(parseInt(e.target.value))}
          className="w-full accent-red-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Support Instructions Card */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
          <ListTodo className="w-3 h-3" />
          Logistical Orders • KM {activeTask.km} Target
        </h3>

        <div className="grid gap-3">
          <InstructionCard 
            icon={<Truck className="w-4 h-4 text-blue-400" />}
            title="Vehicle Deployment"
            desc={activeTask.driverTask}
          />
          <InstructionCard 
            icon={<Users className="w-4 h-4 text-purple-400" />}
            title="Pacer Protocol"
            desc={activeTask.pacerTask}
          />
          <InstructionCard 
            icon={<ChefHat className="w-4 h-4 text-orange-400" />}
            title="Fuel Production"
            desc={activeTask.foodPrep}
          />
        </div>
      </div>

      {/* Support Vehicle Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
          <div className="flex items-center gap-2">
            <div className="bg-green-500/10 p-1.5 rounded-lg">
              <CheckSquare className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Survival Inventory</h3>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-colors"
          >
            {isAdding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            {isAdding ? 'CANCEL' : 'ADD ITEM'}
          </button>
        </div>

        {/* Add Item Form */}
        {isAdding && (
          <div className="p-4 bg-slate-800/30 border-b border-slate-800 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Item name (e.g. Spare Headlamp)"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-sm text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                {(['gear', 'food', 'medical'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewItemCategory(cat)}
                    className={`flex-1 text-[10px] font-black py-2 rounded-lg border transition-all uppercase tracking-tighter ${newItemCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button 
                onClick={addItem}
                className="w-full bg-white text-slate-950 text-xs font-black py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                CONFIRM ADDITION
              </button>
            </div>
          </div>
        )}

        <div className="p-2 space-y-1">
          {inventory.length === 0 && (
            <div className="p-8 text-center text-slate-600">
              <p className="text-sm font-medium italic">No items in your survival inventory.</p>
            </div>
          )}
          {inventory.map(item => (
            <div 
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`group w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer ${checkedItems.has(item.id) ? 'bg-slate-900/40 opacity-50' : 'bg-slate-800/10 hover:bg-slate-800/50'}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${checkedItems.has(item.id) ? 'bg-green-600 border-green-600' : 'border-slate-700 group-hover:border-slate-500 bg-slate-900'}`}>
                  {checkedItems.has(item.id) && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-sm font-bold tracking-tight ${checkedItems.has(item.id) ? 'text-slate-500 line-through' : 'text-slate-100'}`}>{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`hidden sm:block text-[9px] font-black px-2 py-0.5 rounded-full border tracking-tighter uppercase ${
                  item.category === 'medical' ? 'text-red-400 border-red-900/30' : 
                  item.category === 'food' ? 'text-blue-400 border-blue-900/30' : 
                  'text-slate-500 border-slate-700'
                }`}>
                  {item.category}
                </span>
                <button 
                  onClick={(e) => removeItem(item.id, e)}
                  className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-inner mb-8">
        <Info className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <p className="text-[11px] text-slate-500 leading-normal italic font-medium">
          "A prepared crew is half the victory. Ensure your ice is replenished at Balanga (KM 45) before the mid-day heat peaks."
        </p>
      </div>
    </div>
  );
};

const InstructionCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex gap-4 items-start shadow-md hover:border-slate-700 transition-colors">
    <div className="bg-slate-800 p-3 rounded-2xl flex-shrink-0 shadow-inner">
      {icon}
    </div>
    <div className="pt-0.5">
      <h5 className="text-xs font-black text-white mb-1 uppercase tracking-wider">{title}</h5>
      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

export default SupportCrewView;
