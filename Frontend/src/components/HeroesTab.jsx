import React from 'react';
import { LB } from '../data.js';

const BADGES = [
  { ic: '🌱', lb: 'First Report', un: true },
  { ic: '🔍', lb: 'Verified Reporter', un: true },
  { ic: '⚡', lb: 'Quick Responder', un: false },
  { ic: '🏙️', lb: 'City Champion', un: false },
];

const EARN_POINTS = [
  ['Report an issue', '+150'],
  ['Issue verified by community', '+50'],
  ['Issue resolved', '+100'],
  ['Upvote nearby issue', '+10'],
  ['First report in ward', '+200'],
  ['10 issues in a month', '+500 🏅'],
];

export default function HeroesTab({ isGovt, userName }) {
  return (
    <div className="fu">
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{isGovt ? '🏆 Top Citizens' : '🏆 Community Heroes'}</div>
      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 14 }}>Citizens earning points by reporting and verifying civic issues</div>

      {!isGovt && (
        <>
          <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: 14, padding: '16px 20px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12 }}>Your Civic Profile</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{userName}</div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>3 reports · 2 verified · #4 this month</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: 26 }}>300</div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>Citizen Points</div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Your Badges</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {BADGES.map((b) => (
                <div
                  key={b.lb}
                  style={{
                    textAlign: 'center', padding: '12px 8px', borderRadius: 10,
                    background: b.un ? '#FFFBEB' : '#F8FAFC', border: '1.5px solid ' + (b.un ? '#F59E0B' : '#E2E8F0'),
                    opacity: b.un ? 1 : 0.55,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 5 }}>{b.ic}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: b.un ? '#D97706' : '#64748B' }}>{b.lb}</div>
                  {!b.un && <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>Locked</div>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', fontWeight: 700, fontSize: 14 }}>Community Leaderboard</div>
        {LB.map((hero, i) => (
          <div
            key={hero.n}
            style={{
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < LB.length - 1 ? '1px solid #E2E8F0' : 'none',
              background: i === 0 ? '#FFFBEB' : '#fff',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, flexShrink: 0,
              background: i === 0 ? '#F59E0B' : i === 1 ? '#E5E7EB' : i === 2 ? '#F97316' : '#F1F5F9',
              color: i < 3 ? '#fff' : '#64748B',
            }}>
              {i < 3 ? hero.b : i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{hero.n}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{hero.i} reported · {hero.v} verified</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#F59E0B' }}>{hero.pts.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: '#64748B' }}>pts</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>How to Earn Points</div>
        {EARN_POINTS.map(([label, pts]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>{pts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
