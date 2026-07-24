import React from 'react';
import { STAGES } from '../data.js';
import { NavyBtn, Pipeline } from './UI.jsx';

export default function IssueDetailModal({ issue, isGovt, onClose, onUpdateStatus }) {
  const [curStatus, setCurStatus] = React.useState(issue.status);
  const [upvoted, setUpvoted] = React.useState(false);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,40,.78)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,.3)' }}>
        <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: '20px 20px 0 0', padding: '17px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 10, marginBottom: 3 }}>{issue.id} · {issue.ward}</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{issue.title}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, padding: 0, fontSize: 13, marginLeft: 10, flexShrink: 0, cursor: 'pointer' }}
          >✕</button>
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 7 }}>Status Pipeline</div>
            <Pipeline stage={issue.stage} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 13 }}>
            {[['📌 Category', issue.cat], ['🏛️ Department', issue.dept], ['⚠️ Severity', issue.sev + '/10'], ['🕐 ETA', issue.eta]].map(([label, val]) => (
              <div key={label} style={{ background: '#F8FAFC', borderRadius: 9, padding: '9px 11px' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: 9, padding: 11, marginBottom: 11, fontSize: 13, lineHeight: 1.6 }}>
            {issue.desc}
          </div>

          <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: 10, padding: 13, marginBottom: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: '#fff' }}>✦</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>AI Summary</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.85)', lineHeight: 1.6 }}>{issue.ai}</div>
          </div>

          {isGovt ? (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Update Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginBottom: 12 }}>
                {STAGES.map((s4) => (
                  <button
                    key={s4}
                    onClick={() => setCurStatus(s4)}
                    style={{
                      padding: '7px 4px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer',
                      border: '1.5px solid ' + (curStatus === s4 ? '#1A56DB' : '#E2E8F0'),
                      background: curStatus === s4 ? '#EFF6FF' : 'transparent',
                      color: curStatus === s4 ? '#1A56DB' : '#64748B',
                    }}
                  >
                    {s4}
                  </button>
                ))}
              </div>
              <NavyBtn onClick={() => onUpdateStatus(issue.id, curStatus)} style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}>
                💾  Save & Notify Citizen
              </NavyBtn>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setUpvoted(!upvoted)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  border: '1.5px solid ' + (upvoted ? '#1A56DB' : '#E2E8F0'),
                  background: upvoted ? '#EFF6FF' : '#F8FAFC', color: upvoted ? '#1A56DB' : '#64748B',
                }}
              >
                👍 {upvoted ? 'Confirmed' : 'Verify'} ({issue.votes + (upvoted ? 1 : 0)})
              </button>
              <NavyBtn style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>📤 Share</NavyBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
