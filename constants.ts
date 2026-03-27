
import { RouteMarker, RaceMilestone, CrewInstruction, ChecklistItem, RaceType } from './types';

export const BDM102_ROUTE: RouteMarker[] = [
  { km: 0, name: 'Death March Marker (Zero KM)', lat: 14.4331, lng: 120.4851, description: 'The official starting point in Mariveles, Bataan.' },
  { km: 10, name: 'Cabcaben', lat: 14.4442, lng: 120.5397, description: 'Entering the coastal road of Limay.' },
  { km: 31, name: 'Orion Marker', lat: 14.6186, lng: 120.5819, description: 'Past the Limay municipal hall, heading towards Orion.' },
  { km: 45, name: 'Pilar / Balanga', lat: 14.6811, lng: 120.5422, description: 'Crossing the historic Pilar-Balanga boundary.' },
  { km: 58, name: 'Abucay Church', lat: 14.7214, lng: 120.5392, description: 'A significant landmark near the halfway point.' },
  { km: 70, name: 'Hermosa', lat: 14.8317, lng: 120.5050, description: 'Leaving Bataan and approaching the Pampanga border.' },
  { km: 83, name: 'Lubao', lat: 14.9213, lng: 120.5989, description: 'The long stretch of Jose Abad Santos Avenue.' },
  { km: 92, name: 'Guagua', lat: 14.9658, lng: 120.6289, description: 'Almost there. The fatigue is real.' },
  { km: 102, name: 'Old San Fernando Train Station', lat: 15.0306, lng: 120.6942, description: 'The Finish Line. A place of deep historical significance.' }
];

export const BDM160_ROUTE: RouteMarker[] = [
  { km: 0, name: 'Mariveles (Zero KM)', lat: 14.4331, lng: 120.4851, description: 'The start of the long journey.' },
  { km: 50, name: 'Abucay', lat: 14.7214, lng: 120.5392, description: 'First major milestone.' },
  { km: 102, name: 'San Fernando', lat: 15.0306, lng: 120.6942, description: 'The original 102km finish, but you keep going.' },
  { km: 130, name: 'Angeles City', lat: 15.1449, lng: 120.5887, description: 'Entering the heart of Pampanga.' },
  { km: 145, name: 'Mabalacat', lat: 15.2167, lng: 120.5833, description: 'Approaching the final stretch.' },
  { km: 160, name: 'Capas National Shrine', lat: 15.3500, lng: 120.5000, description: 'The ultimate finish line. Respect to the fallen.' }
];

export const BDM102_CREW_TASKS: CrewInstruction[] = [
  { km: 10, driverTask: 'Park at Cabcaben. Wait for runner to pass.', pacerTask: 'Prepare sponges and ice water.', foodPrep: 'Hand over first salt capsule.' },
  { km: 31, driverTask: 'Leapfrog 5km ahead. Avoid traffic jams.', pacerTask: 'Check runner for chafing. Apply Vaseline.', foodPrep: 'Prepare cold Gatorade and 1/2 banana.' },
  { km: 50, driverTask: 'Main rest stop setup. Open back of vehicle.', pacerTask: 'Get fresh shoes and socks ready.', foodPrep: 'Offer warm food (noodles/rice) if runner can eat.' },
  { km: 70, driverTask: 'Drive slowly near runner (if permitted).', pacerTask: 'Pacer joins runner for next 10km.', foodPrep: 'Ice neck wrap change. High-caffeine gel ready.' },
  { km: 92, driverTask: 'Head to the Finish Line area in San Fernando.', pacerTask: 'Last pacer switch. Moral support constant.', foodPrep: 'Victory drink on ice. Dry clothes ready.' }
];

export const BDM160_CREW_TASKS: CrewInstruction[] = [
  { km: 20, driverTask: 'First major supply check.', pacerTask: 'Check hydration levels.', foodPrep: 'Hand over electrolyte drink.' },
  { km: 50, driverTask: 'Full meal setup.', pacerTask: 'Check feet for blisters.', foodPrep: 'Warm meal (rice/soup).' },
  { km: 102, driverTask: 'Psychological support station.', pacerTask: 'Pacer rotation starts.', foodPrep: 'High calorie snack.' },
  { km: 130, driverTask: 'Night gear check (lights/reflectors).', pacerTask: 'Keep runner awake and moving.', foodPrep: 'Caffeine and warm drinks.' },
  { km: 160, driverTask: 'Finish line celebration setup.', pacerTask: 'Final 5km push.', foodPrep: 'Recovery meal ready.' }
];

export const BDM102_RACE_MILESTONES: RaceMilestone[] = [
  { km: 10, title: 'Early Fuel', action: 'Consume first 100kcal. Start electrolyte loading.', type: 'nutrition' },
  { km: 31, title: 'Heat Management', action: 'Apply ice to neck. Refill water with salt tabs.', type: 'hydration' },
  { km: 50, title: 'Midpoint Refresh', action: 'Change socks/shoes. Check for hot spots or blisters.', type: 'gear' },
  { km: 70, title: 'Caffeine Boost', action: 'Strategic caffeine gel. Tighten mental focus.', type: 'nutrition' },
  { km: 85, title: 'Salt Check', action: 'Take extra salt. Muscle cramps usually peak here.', type: 'hydration' },
  { km: 92, title: 'Final Push', action: 'Visualize the finish. Switch to 2:1 Run/Walk.', type: 'mental' }
];

export const BDM160_RACE_MILESTONES: RaceMilestone[] = [
  { km: 20, title: 'Foundation', action: 'Keep heart rate low. Eat small and often.', type: 'nutrition' },
  { km: 50, title: 'First Third', action: 'Change socks. Re-apply anti-chafe.', type: 'gear' },
  { km: 80, title: 'Night Prep', action: 'Prepare lights and reflective gear.', type: 'gear' },
  { km: 102, title: 'The Wall', action: 'Original finish line. Stay focused on the next 58km.', type: 'mental' },
  { km: 130, title: 'Deep Night', action: 'Caffeine strategy. Focus on one foot in front of the other.', type: 'mental' },
  { km: 160, title: 'Immortality', action: 'The final stretch to Capas. Give it everything.', type: 'mental' }
];

export const LOGISTICS_CHECKLIST: ChecklistItem[] = [
  { id: 'ice', label: '10kg Crushed Ice', category: 'gear' },
  { id: 'sponges', label: 'Sponge Buckets', category: 'gear' },
  { id: 'water', label: '20L Distilled Water', category: 'food' },
  { id: 'electrolyte', label: 'Electrolyte Tabs/Powder', category: 'food' },
  { id: 'gels', label: 'Energy Gels (x15)', category: 'food' },
  { id: 'firstaid', label: 'Blister Kits / First Aid', category: 'medical' },
  { id: 'vaseline', label: 'Anti-chafe / Vaseline', category: 'medical' },
  { id: 'clothes', label: 'Runner Extra Socks/Clothes', category: 'gear' }
];

export const RACE_DATA = {
  [RaceType.BDM102]: {
    distance: 102,
    route: BDM102_ROUTE,
    crewTasks: BDM102_CREW_TASKS,
    milestones: BDM102_RACE_MILESTONES,
    defaultPace: 7.5
  },
  [RaceType.BDM160]: {
    distance: 160,
    route: BDM160_ROUTE,
    crewTasks: BDM160_CREW_TASKS,
    milestones: BDM160_RACE_MILESTONES,
    defaultPace: 8.5
  }
};

export const MODEL_FLASH = 'gemini-2.5-flash-image';
export const MODEL_PRO = 'gemini-3-pro-image-preview';

export const SYSTEM_PROMPTS = {
  editor: `You are an expert AI image editor. Your goal is to modify the provided image based on the user's instructions while maintaining high quality and consistency.`
};
