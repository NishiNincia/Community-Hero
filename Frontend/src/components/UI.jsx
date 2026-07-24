import React from 'react';
import { STAGES, UCFG, SCFG } from '../data.js';

const baseBtn = {
  cursor: 'pointer',
  border: 'none',
  fontWeight: 600,
  fontSize: 13,
  borderRadius: 8,
  padding: '8px 14px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  transition: 'opacity .15s',
};

export function Btn({ children, onClick, style, disabled }) {
  return (
    <button style={{ ...baseBtn, ...style }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function NavyBtn({ children, onClick, style }) {
  return <Btn onClick={onClick} style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', color: '#fff', ...style }}>{children}</Btn>;
}

export function AmberBtn({ children, onClick, style }) {
  return <Btn onClick={onClick} style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff', ...style }}>{children}</Btn>;
}

export function GreenBtn({ children, onClick, style }) {
  return <Btn onClick={onClick} style={{ background: 'linear-gradient(135deg,#059669,#10B981)', color: '#fff', ...style }}>{children}</Btn>;
}

export function GhostBtn({ children, onClick, style }) {
  return <Btn onClick={onClick} style={{ background: 'transparent', border: '1.5px solid #E2E8F0', color: '#64748B', ...style }}>{children}</Btn>;
}

export function Badge({ label, c, bg }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 10,
      fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
      whiteSpace: 'nowrap', color: c, background: bg,
    }}>
      {label}
    </span>
  );
}

export function LField({ text, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>{text}</label>
      {children}
    </div>
  );
}

export function FBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
        whiteSpace: 'nowrap', border: '1.5px solid ' + (active ? '#1A56DB' : '#E2E8F0'),
        background: active ? '#EFF6FF' : '#fff', color: active ? '#1A56DB' : '#64748B',
      }}
    >
      {label}
    </button>
  );
}

export function Input({ type = 'text', placeholder, value, onChange, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '10px 13px', borderRadius: 8,
        border: '1.5px solid ' + (focused ? '#1A56DB' : '#E2E8F0'), fontSize: 14,
        background: '#fff', color: '#0F1B35', outline: 'none', transition: 'border-color .2s',
        ...style,
      }}
    />
  );
}

export function SevBar({ score }) {
  const c = score >= 8 ? '#EF4444' : score >= 6 ? '#F59E0B' : '#10B981';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: c, width: score * 10 + '%' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, minWidth: 22, color: c }}>{score}</span>
    </div>
  );
}

export function Pipeline({ stage }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 2 }}>
      {STAGES.map((s, i) => {
        const done = i <= stage, active = i === stage;
        const dotColor = done ? (active ? '#1A56DB' : '#10B981') : '#E2E8F0';
        return (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0,
                background: dotColor, color: done ? '#fff' : '#94A3B8',
                boxShadow: active ? '0 0 0 3px #EFF6FF' : 'none',
              }}>
                {done && !active ? '✓' : String(i + 1)}
              </div>
              <span style={{
                fontSize: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em',
                whiteSpace: 'nowrap', marginTop: 2, color: dotColor === '#E2E8F0' ? '#94A3B8' : dotColor,
              }}>
                {s}
              </span>
            </div>
            {i < 4 && (
              <div style={{ width: 14, height: 2, flexShrink: 0, marginBottom: 14, background: i < stage ? '#10B981' : '#E2E8F0' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function IssueCard({ issue, compact, onClick }) {
  const urg = UCFG[issue.urg] || UCFG.Medium;
  const stc = SCFG[issue.status] || SCFG.Reported;
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', borderRadius: 12, padding: 13,
        border: '1px solid ' + (hover ? '#1A56DB' : '#E2E8F0'), cursor: 'pointer', marginBottom: 8,
        transition: 'all .2s', transform: hover ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 1 }}>
            {issue.id} · {issue.ward}
          </span>
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {issue.title}
          </div>
        </div>
        <Badge label={issue.urg} c={urg.c} bg={urg.bg} />
      </div>
      <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
        <Badge label={issue.cat} c="#1A56DB" bg="#EFF6FF" />
        <Badge label={issue.status} c={stc.c} bg={stc.bg} />
      </div>
      <SevBar score={issue.sev} />
      {!compact && <div style={{ marginTop: 8 }}><Pipeline stage={issue.stage} /></div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#64748B', flexWrap: 'wrap', gap: 4 }}>
        <span>👍 {issue.votes}</span>
        <span>⏱ {issue.eta}</span>
        <span>🏛 {issue.dept}</span>
      </div>
    </div>
  );
}
