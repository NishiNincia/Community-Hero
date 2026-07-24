import React from 'react';

function xy(lat, lng) {
  return { x: ((lng + 74.015) / 0.022) * 500, y: ((40.718 - lat) / 0.014) * 280 };
}

const GRID_LINES = { h: 11, v: 18 };
const ROADS = [
  [0, 140, 500, 140, 3], [250, 0, 250, 280, 3],
  [0, 93, 500, 93, 1.5], [0, 200, 500, 200, 1.5],
  [148, 0, 148, 280, 1.5], [352, 0, 352, 280, 1.5],
];
const ZONES = [[250, 125, 58], [180, 182, 44], [355, 100, 48]];
const WARD_LABELS = [[68, 68, 'Ward 2'], [272, 68, 'Ward 3'], [68, 232, 'Ward 4'], [272, 232, 'Ward 5']];

export default function CityMap({ issues, selId, onSel }) {
  return (
    <svg viewBox="0 0 500 280" style={{ width: '100%', display: 'block' }}>
      <rect width="500" height="280" fill="#0F172A" />
      {Array.from({ length: GRID_LINES.h }).map((_, i) => (
        <line key={'gh' + i} x1="0" y1={i * 28} x2="500" y2={i * 28} stroke="rgba(255,255,255,.04)" strokeWidth="1" />
      ))}
      {Array.from({ length: GRID_LINES.v }).map((_, j) => (
        <line key={'gv' + j} x1={j * 30} y1="0" x2={j * 30} y2="280" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
      ))}
      {ROADS.map((r, i) => (
        <line key={'r' + i} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} stroke={'rgba(255,255,255,' + (r[4] > 2 ? 0.1 : 0.05) + ')'} strokeWidth={r[4]} />
      ))}
      {ZONES.map((z, i) => (
        <circle key={'z' + i} cx={z[0]} cy={z[1]} r={z[2]} fill="rgba(239,68,68,.11)" />
      ))}
      {WARD_LABELS.map((t, i) => (
        <text key={'w' + i} x={t[0]} y={t[1]} fill="rgba(255,255,255,.18)" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="600">{t[2]}</text>
      ))}
      {issues.map((iss) => {
        const pos = xy(iss.lat, iss.lng);
        const sel = selId === iss.id;
        const col = iss.status === 'Resolved' ? '#10B981' : iss.urg === 'Critical' ? '#EF4444' : iss.urg === 'High' ? '#F59E0B' : '#1A56DB';
        const s = sel ? 1.35 : 1;
        return (
          <g
            key={iss.id}
            transform={`translate(${Math.round(pos.x)},${Math.round(pos.y)})`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSel(iss)}
          >
            {sel && <circle r={Math.round(16 * s)} fill={col} opacity=".2" />}
            <circle r={Math.round(10 * s)} fill={col} opacity=".9" />
            <circle r="3.5" fill="white" opacity=".9" />
          </g>
        );
      })}
    </svg>
  );
}
