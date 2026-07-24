import React from 'react';

const ROLES = [
  { role: 'citizen', icon: '👤', title: 'Citizen Login', desc: 'Report issues, track status, earn rewards & build your community', cta: 'Enter as Citizen →', acc: 'rgba(59,130,246,.3)' },
  { role: 'government', icon: '🏛️', title: 'Government Login', desc: 'Manage issues, assign departments, track SLAs & generate AI reports', cta: 'Enter as Official →', acc: 'rgba(245,158,11,.3)' },
];

const STATS = [['847', 'Issues Reported'], ['612', 'Resolved'], ['2,847', 'Active Citizens'], ['72%', 'Resolution Rate']];

function RoleCard({ opt, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '24px 18px', borderRadius: 18,
        border: '2px solid ' + (hover ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.1)'),
        background: hover ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.06)',
        cursor: 'pointer', textAlign: 'center', transition: 'all .25s',
        transform: hover ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 10 }}>{opt.icon}</div>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 7 }}>{opt.title}</div>
      <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, lineHeight: 1.6, marginBottom: 13 }}>{opt.desc}</div>
      <div style={{ display: 'inline-block', background: opt.acc, borderRadius: 20, padding: '5px 13px', fontSize: 12, fontWeight: 700, color: '#fff' }}>
        {opt.cta}
      </div>
    </div>
  );
}

export default function RoleSelect({ onSelectRole }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg,#0F1B35,#1E3A6E 50%,#1A56DB)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          width: 70, height: 70, borderRadius: 20, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, margin: '0 auto 14px',
          boxShadow: '0 8px 30px rgba(59,130,246,.45)',
        }}>🦸</div>
        <div style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: '-.02em' }}>Community Hero</div>
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 4, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          Civic Issue Reporting Platform
        </div>
      </div>
      <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, marginBottom: 22, textAlign: 'center' }}>
        Choose your login type to continue
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 460 }}>
        {ROLES.map((opt) => (
          <RoleCard key={opt.role} opt={opt} onClick={() => onSelectRole(opt.role)} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 30, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        {STATS.map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{v}</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
