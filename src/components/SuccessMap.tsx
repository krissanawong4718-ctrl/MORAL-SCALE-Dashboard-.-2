import React, { useMemo } from 'react';
import { SchoolData } from '../types';
import { cn } from '../lib/utils';

interface MapProps {
  data: SchoolData[];
  className?: string;
}

export const SuccessMap: React.FC<MapProps> = ({ data, className }) => {
  // Since we don't have a real map library like Leaflet or Google Maps easily available in this environment
  // without an API key, we'll create a stylized SVG representation of the area.
  // We'll normalize the coordinates to fit in our SVG box.

  const bounds = useMemo(() => {
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    data.forEach(d => {
      minLat = Math.min(minLat, d.coordinates.lat);
      maxLat = Math.max(maxLat, d.coordinates.lat);
      minLng = Math.min(minLng, d.coordinates.lng);
      maxLng = Math.max(maxLng, d.coordinates.lng);
    });
    // Add padding
    const latPadding = (maxLat - minLat) * 0.2 || 0.01;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.01;
    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding
    };
  }, [data]);

  function project(lat: number, lng: number) {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  }

  return (
    <div className={cn("bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden", className)}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-medium text-lg">แผนที่ความสำเร็จ</h3>
          <p className="text-slate-400 text-xs uppercase tracking-widest">สพป.สกลนคร เขต 2</p>
        </div>
        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-emerald-500/30">
          Live Data
        </div>
      </div>

      <div className="relative h-[300px] w-full bg-slate-800/50 rounded-xl border border-white/5">
        <svg viewBox="0 0 100 100" className="w-full h-full p-8">
          {/* Background area shape - stylized */}
          <path 
            d="M20,30 Q50,10 80,30 T80,70 Q50,90 20,70 T20,30" 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="0.5"
          />
          
          {data.map((school) => {
            const { x, y } = project(school.coordinates.lat, school.coordinates.lng);
            const positiveScore = (school.onTimeStudents + school.workSubmission + school.returnedItems + school.otherGoodDeeds);
            const size = Math.max(3, (positiveScore / school.totalStudents) * 8);
            
            return (
              <g key={school.id}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size} 
                  fill="#10b981" 
                  fillOpacity="0.4"
                  className="animate-pulse"
                />
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size * 0.4} 
                  fill="#10b981" 
                />
                <text 
                  x={x} 
                  y={y + size + 4} 
                  fontSize="2" 
                  fill="rgba(255,255,255,0.5)" 
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {school.schoolName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">ความสำเร็จสูง</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">ขนาดฟองตามร้อยละความดี</span>
        </div>
      </div>
    </div>
  );
};
