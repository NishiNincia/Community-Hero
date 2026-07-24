import React from 'react';
import { NavyBtn, Badge, IssueCard } from './UI.jsx';
import CityMap from './CityMap.jsx';

const STAT_CARDS = [
  { l: 'Total Reported', v: '847', ic: '📋', c: '#1A56DB', bg: '#EFF6FF' },
  { l: 'Resolved', v: '612', ic: '✓', c: '#10B981', bg: '#ECFDF5' },
  { l: 'Pending', v: '235', ic: '⏳', c: '#F59E0B', bg: '#FFFBEB' },
  { l: 'Avg Resolution', v: '3.2d', ic: '⚡', c: '#7C3AED', bg: '#F5F3FF' },
];

const PREDICTIONS = [
  ['🔴 High Risk Zone', 'Ward 3 – Oak Blvd corridor', '#FEF2F2', '#EF4444'],
  ['🟠 Recurring Pattern', 'Ward 5 – River Road drainage', '#FFFBEB', '#D97706'],
  ['🔵 Watch Zone', 'Ward 2 – Market Street lighting', '#EFF6FF', '#1A56DB'],
];

export default function Dashboard({ userName, issues, selMapId, onSelMap, onOpenReport, onOpenIssue, onGoIssues }) {
  return (
    <div className="fu">
      <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1E40AF,#1A56DB)', borderRadius: 16, padding: '22px 26px', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Welcome back, {userName}</div>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Your city needs you 🦸</div>
        <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, lineHeight: 1.7, marginBottom: 14, maxWidth: 400 }}>
          235 issues awaiting community verification. Report infrastructure problems and AI handles the rest.
        </div>
        <NavyBtn onClick={onOpenReport} style={{ background: '#fff', color: '#0F1B35', padding: '9px 18px', borderRadius: 10, fontSize: 13 }}>
          + Report an Issue
        </NavyBtn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 14 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.l} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 9, background: s.bg }}>{s.ic}</div>
            <div style={{ fontSize: 23, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, marginBottom: 14 }}>
        <div style={{ background: '#0F172A', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>🗺 Live Issue Map</span>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['#EF4444', 'Critical'], ['#F59E0B', 'High'], ['#10B981', 'Resolved']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <CityMap issues={issues} selId={selMapId} onSel={(iss) => onSelMap(iss)} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Recent Issues</div>
            <button onClick={onGoIssues} style={{ background: 'none', border: 'none', color: '#1A56DB', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>View all →</button>
          </div>
          {issues.slice(0, 3).map((i) => (
            <IssueCard key={i.id} issue={i} compact onClick={() => onOpenIssue(i)} />
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
          <span style={{ fontSize: 16 }}>🔮</span>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Predictive Insights</div>
          <Badge label="AI-Powered" c="#1A56DB" bg="#EFF6FF" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {PREDICTIONS.map(([title, desc, bg, c]) => (
            <div key={title} style={{ borderRadius: 10, padding: '11px 13px', background: bg }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: c, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
