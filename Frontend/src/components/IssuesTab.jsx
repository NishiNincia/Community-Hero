import React from 'react';
import { STAGES } from '../data.js';
import { FBtn, IssueCard } from './UI.jsx';

export default function IssuesTab({ issues, filteredIssues, isGovt, user, fSt, setFSt, fWd, setFWd, onOpenIssue }) {
  const crit = issues.filter((i) => i.urg === 'Critical').length;
  const inProg = issues.filter((i) => i.status === 'In Progress').length;

  return (
    <div className="fu">
      {isGovt && (
        <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1E40AF)', borderRadius: 14, padding: '16px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 3 }}>Government Dashboard</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>Priority Issue Queue</div>
              {user?.empId && (
                <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 2 }}>{user.name} · {user.empId}</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['235', 'Pending', '#F59E0B'], [String(crit), 'Critical', '#EF4444'], [String(inProg), 'In Progress', '#1A56DB']].map(([v, l, c]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,.09)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ color: c, fontWeight: 800, fontSize: 18 }}>{v}</div>
                  <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', flexShrink: 0 }}>Status: </span>
        {['All', ...STAGES].map((s) => (
          <FBtn key={s} label={s} active={fSt === s} onClick={() => setFSt(s)} />
        ))}
        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginLeft: 6, flexShrink: 0 }}>Ward: </span>
        {['All', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'].map((w) => (
          <FBtn key={w} label={w} active={fWd === w} onClick={() => setFWd(w)} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
        {filteredIssues.map((i) => (
          <IssueCard key={i.id} issue={i} onClick={() => onOpenIssue(i)} />
        ))}
      </div>
    </div>
  );
}
