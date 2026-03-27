
export class CacheService {
  private static CACHE_KEY = 'bdm102_offline_data';

  static async saveToOffline(data: any): Promise<void> {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log('Data cached for offline use');
    } catch (e) {
      console.error('Failed to cache data:', e);
    }
  }

  static getOfflineData(): any | null {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      return parsed.data;
    } catch {
      return null;
    }
  }

  static saveState(key: string, state: any): void {
    localStorage.setItem(`bdm102_state_${key}`, JSON.stringify(state));
  }

  static getState(key: string): any | null {
    const state = localStorage.getItem(`bdm102_state_${key}`);
    return state ? JSON.parse(state) : null;
  }
}
