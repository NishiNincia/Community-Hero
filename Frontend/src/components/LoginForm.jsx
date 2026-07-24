import React from 'react';
import { GhostBtn, NavyBtn, AmberBtn, Input, LField } from './UI.jsx';

const CITIZEN_FEATURES = ['AI image analysis & auto-categorization', 'Real-time issue tracking pipeline', 'Community verification system', 'Earn citizen points & badges'];
const GOVT_FEATURES = ['Priority queue & SLA tracking', 'AI-generated resolution reports', 'Department assignment & analytics', 'Real-time status control panel'];
const DEPTS = ['Select department…', 'Public Works – Roads', 'Water & Sanitation Board', 'Sanitation & Waste Dept', 'Electricity & Infrastructure', 'Drainage & Sewage Authority', 'Parks Department', 'Municipal Administration'];

export default function LoginForm({ role, onBack, onLoggedIn }) {
  const isGovt = role === 'government';
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [empId, setEmpId] = React.useState('');
  const [dept, setDept] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');

  const handleSubmit = async () => {
    setErr('');
    if (!email || !pw) { setErr('Please fill in all required fields.'); return; }
    if (isGovt && !empId) { setErr('Employee ID is required for Government login.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onLoggedIn({ name: isGovt ? 'Officer Sharma' : email.split('@')[0], empId, dept });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        flex: 1, background: 'linear-gradient(135deg,#0F1B35,#1E3A6E 60%,#1A56DB)',
        padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19,
          }}>🦸</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Community Hero</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em' }}>Civic Platform</div>
          </div>
        </div>
        <div style={{ color: '#fff', fontSize: 24, fontWeight: 900, lineHeight: 1.25, marginBottom: 10 }}>
          {isGovt ? 'Government Control Panel' : 'Report. Track. Transform.'}
        </div>
        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
          {isGovt
            ? 'Manage SLAs, assignments and generate AI-powered resolution reports for your city.'
            : 'Spot a civic issue? Report in seconds. AI categorizes and routes it to the right department.'}
        </div>
        {(isGovt ? GOVT_FEATURES : CITIZEN_FEATURES).map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 10, flexShrink: 0,
              color: isGovt ? '#F59E0B' : '#10B981', background: isGovt ? 'rgba(245,158,11,.2)' : 'rgba(16,185,129,.2)',
            }}>✓</div>
            <span style={{ color: 'rgba(255,255,255,.72)', fontSize: 13 }}>{f}</span>
          </div>
        ))}
      </div>

      <div style={{ width: 400, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 32px', flexShrink: 0 }}>
        <div style={{ maxWidth: 320, width: '100%', margin: '0 auto' }}>
          <GhostBtn onClick={onBack} style={{ fontSize: 12, padding: '6px 12px', marginBottom: 24, display: 'inline-flex' }}>← Back</GhostBtn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 24 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, background: isGovt ? '#FFFBEB' : '#EFF6FF',
            }}>{isGovt ? '🏛️' : '👤'}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{isGovt ? 'Government Login' : 'Citizen Login'}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{isGovt ? 'Authorized personnel only' : 'Welcome back, hero!'}</div>
            </div>
          </div>

          {err && (
            <div style={{
              background: '#FEF2F2', border: '1px solid rgba(239,68,68,.3)', borderRadius: 9,
              padding: '9px 13px', marginBottom: 13, fontSize: 13, color: '#EF4444', fontWeight: 500,
            }}>
              ⚠️ {err}
            </div>
          )}

          {isGovt && (
            <>
              <LField text="Employee ID *">
                <Input placeholder="e.g. GOV-2024-1847" value={empId} onChange={(e) => setEmpId(e.target.value)} />
              </LField>
              <LField text="Department">
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 13px', borderRadius: 8, border: '1.5px solid #E2E8F0',
                    fontSize: 14, background: '#fff', color: '#0F1B35', outline: 'none', cursor: 'pointer',
                  }}
                >
                  {DEPTS.map((d2, i) => (
                    <option key={d2} value={i === 0 ? '' : d2}>{d2}</option>
                  ))}
                </select>
              </LField>
            </>
          )}

          <LField text="Email Address *">
            <Input type="email" placeholder={isGovt ? 'officer@municipality.gov' : 'you@example.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
          </LField>

          <LField text="Password *">
            <div style={{ position: 'relative' }}>
              <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} style={{ paddingRight: 42 }} />
              <button
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.45, padding: 0,
                }}
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </LField>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#64748B' }}>
              <input type="checkbox" style={{ accentColor: '#1A56DB' }} /> Remember me
            </label>
            <button style={{ background: 'none', border: 'none', color: '#1A56DB', fontSize: 13, cursor: 'pointer' }}>Forgot password?</button>
          </div>

          {isGovt ? (
            <AmberBtn onClick={handleSubmit} style={{ width: '100%', padding: '12px 0', fontSize: 14, borderRadius: 11, justifyContent: 'center', marginBottom: 14 }}>
              {loading ? <><span className="spin" />&nbsp;Signing in…</> : <>🏛️&nbsp; Access Government Dashboard</>}
            </AmberBtn>
          ) : (
            <NavyBtn onClick={handleSubmit} style={{ width: '100%', padding: '12px 0', fontSize: 14, borderRadius: 11, justifyContent: 'center', marginBottom: 14 }}>
              {loading ? <><span className="spin" />&nbsp;Signing in…</> : <>🦸&nbsp; Enter Citizen Dashboard</>}
            </NavyBtn>
          )}

          <div style={{ background: '#F0FDF4', borderRadius: 9, padding: '10px 13px', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Demo mode</div>
            <div style={{ fontSize: 12, color: '#166534' }}>Any credentials work — just fill the fields and sign in.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
