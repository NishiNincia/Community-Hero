import React from 'react';
import { Badge } from './UI.jsx';

const STAT_CARDS = [
  { l: 'Total Reported', v: '847', ic: '📋', c: '#1A56DB', bg: '#EFF6FF' },
  { l: 'Resolved', v: '612', ic: '✓', c: '#10B981', bg: '#ECFDF5' },
  { l: 'Pending', v: '235', ic: '⏳', c: '#F59E0B', bg: '#FFFBEB' },
  { l: 'Avg Resolution', v: '3.2d', ic: '⚡', c: '#7C3AED', bg: '#F5F3FF' },
];

const CATEGORIES = [
  { n: 'Roads', v: 312, c: '#1A56DB' },
  { n: 'Water', v: 198, c: '#F59E0B' },
  { n: 'Waste', v: 145, c: '#10B981' },
  { n: 'Lighting', v: 122, c: '#7C3AED' },
  { n: 'Drainage', v: 70, c: '#EF4444' },
];

const TREND_VALUES = [42, 58, 71, 65, 89, 102, 94, 115, 128, 110, 98, 75];
const SLA_DEPTS = [
  { n: 'Public Works – Roads', p: 78 },
  { n: 'Water & Sanitation Board', p: 91 },
  { n: 'Sanitation Dept', p: 85 },
  { n: 'Electricity Dept', p: 72 },
  { n: 'Drainage Authority', p: 69 },
];

const AI_REPORT = [
  { t: 'Infrastructure health', v: '72/100', d: 'Roads (-18pts), Drainage (-10pts)', tr: '↑ +3 from last month' },
  { t: 'Priority intervention', v: 'Ward 3', d: '12 unresolved critical issues', tr: '🔴 Escalate immediately' },
  { t: 'Resource allocation', v: 'Optimized', d: 'Water Dept over SLA by 6hrs', tr: '⚠ Reassign 2 crews' },
  { t: 'Predictive risk', v: 'Monsoon Ready', d: 'Drainage block risk: HIGH', tr: 'Pre-clear recommended' },
];

function TrendChart() {
  const W = 270, H = 75, mn = 42, mx = 128;
  const pts = TREND_VALUES.map((v, i) => [
    Math.round((i / (TREND_VALUES.length - 1)) * W),
    Math.round(H - ((v - mn) / (mx - mn)) * H * 0.82 - H * 0.08),
  ]);
  const ptsStr = pts.map((p) => p.join(',')).join(' ');
  const areaD = `M ${pts[0].join(',')} L ${ptsStr.split(' ').join(' L ')} L ${W},${H} L 0,${H} Z`;

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
        <defs>
          <linearGradient id="tgA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A56DB" stopOpacity=".2" />
            <stop offset="100%" stopColor="#1A56DB" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#tgA)" />
        <polyline points={ptsStr} fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#1A56DB" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {'JFMAMJJASOND'.split('').map((m, i) => (
          <span key={i} style={{ fontSize: 9, color: '#94A3B8' }}>{m}</span>
        ))}
      </div>
    </>
  );
}

export default function AnalyticsTab() {
  return (
    <div className="fu">
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 14 }}>📊 Analytics & Insights</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.l} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 9, background: s.bg }}>{s.ic}</div>
            <div style={{ fontSize: 23, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Issues by Category</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 112 }}>
            {CATEGORIES.map((cat) => (
              <div key={cat.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: cat.c }}>{cat.v}</div>
                <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: cat.c, minHeight: 4, height: Math.round((cat.v / 312) * 88) }} />
                <div style={{ fontSize: 9, color: '#64748B', textAlign: 'center' }}>{cat.n}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Monthly Trend</div>
          <TrendChart />
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 13 }}>🎯 SLA Compliance by Department</div>
        {SLA_DEPTS.map((x) => {
          const c = x.p >= 85 ? '#10B981' : x.p >= 75 ? '#F59E0B' : '#EF4444';
          return (
            <div key={x.n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, width: 150, flexShrink: 0 }}>{x.n.split(' –')[0].split(' &')[0]}</div>
              <div style={{ flex: 1, height: 7, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 4, background: c, width: x.p + '%' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: c, width: 32, flexShrink: 0 }}>{x.p}%</span>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
          <span style={{ fontSize: 14 }}>✦</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>AI-Generated Resolution Report</span>
          <Badge label="For Officials" c="rgba(255,255,255,.8)" bg="rgba(255,255,255,.1)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {AI_REPORT.map((a) => (
            <div key={a.t} style={{ background: 'rgba(255,255,255,.09)', borderRadius: 10, padding: 13 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{a.t}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{a.v}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: 2 }}>{a.d}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', fontWeight: 600 }}>{a.tr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
