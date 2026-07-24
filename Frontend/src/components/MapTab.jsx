import React from 'react';
import { UCFG } from '../data.js';
import { FBtn, Badge, IssueCard } from './UI.jsx';
import CityMap from './CityMap.jsx';

export default function MapTab({ issues, filteredIssues, fWd, setFWd, selMapId, onSelMap, onOpenIssue }) {
  const selIssue = issues.find((i) => i.id === selMapId);

  return (
    <div className="fu">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>🗺 City Issue Map</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {['All', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'].map((w) => (
            <FBtn key={w} label={w} active={fWd === w} onClick={() => setFWd(w)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
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
          <CityMap issues={filteredIssues} selId={selMapId} onSel={(iss) => onSelMap(iss)} />
          {selIssue && (
            <div style={{ padding: '10px 13px', borderTop: '1px solid rgba(255,255,255,.08)', background: 'rgba(15,27,53,.95)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{selIssue.title}</div>
                  <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>{selIssue.ward} · {selIssue.dept}</div>
                </div>
                <Badge label={selIssue.urg} c={UCFG[selIssue.urg].c} bg={UCFG[selIssue.urg].bg} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 440, overflowY: 'auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8, flexShrink: 0 }}>
            {filteredIssues.length} issues {fWd !== 'All' ? 'in ' + fWd : 'citywide'}
          </div>
          {filteredIssues.map((i) => (
            <IssueCard key={i.id} issue={i} compact onClick={() => onOpenIssue(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
