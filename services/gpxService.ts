
import { RouteMarker, RaceType } from '../types';

export const GPXService = {
  generateGPX(raceType: RaceType, route: RouteMarker[]): string {
    const raceName = raceType === RaceType.BDM102 ? 'BDM 102' : 'BDM 160';
    const creator = 'BDM Ultramarathon Companion';
    
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="${creator}" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${raceName} Route</name>
    <desc>Official route for ${raceName} Ultramarathon</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${raceName}</name>
    <trkseg>`;

    route.forEach(marker => {
      gpx += `
      <trkpt lat="${marker.lat}" lon="${marker.lng}">
        <name>KM ${marker.km}: ${marker.name}</name>
        <desc>${marker.description}</desc>
      </trkpt>`;
    });

    gpx += `
    </trkseg>
  </trk>
</gpx>`;

    return gpx;
  },

  downloadGPX(raceType: RaceType, route: RouteMarker[]) {
    const gpxString = this.generateGPX(raceType, route);
    const blob = new Blob([gpxString], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `BDM_${raceType === RaceType.BDM102 ? '102' : '160'}_Route.gpx`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
