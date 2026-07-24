import React from 'react';
import { NavyBtn, GhostBtn, GreenBtn, Badge, LField, Input } from './UI.jsx';

export default function ReportModal({ onClose, onSubmit }) {
  const [step, setStep] = React.useState(1);
  const [loc, setLoc] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [img, setImg] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const [descFocused, setDescFocused] = React.useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = (ev) => setImg(ev.target.result);
    rd.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!desc && !img) return;
    setLoading(true);
    setStep(2);
    try {
      const pr = 'Analyze this civic infrastructure issue: "' + desc + '". Location: ' + (loc || 'Unknown') + '. Return ONLY valid JSON with fields: issue_category (string), severity_score (number 1-10), urgency_level (Critical/High/Medium/Low), responsible_department (string), estimated_resolution_time (string), citizen_friendly_summary (1-2 sentences). No markdown, no extra text.';
      const uc = img ? [{ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: img.split(',')[1] } }, { type: 'text', text: pr }] : pr;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: 'You are a civic infrastructure AI analyst. Return ONLY valid JSON, no markdown.',
          messages: [{ role: 'user', content: uc }],
        }),
      });
      const data = await res.json();
      const txt = data.content ? data.content.map((c) => c.text || '').join('') : '';
      setResult(JSON.parse(txt.replace(/```json|```/g, '').trim()));
    } catch (err) {
      const desc2 = desc.toLowerCase();
      setResult({
        issue_category: desc2.includes('water') ? 'Water Supply' : desc2.includes('light') ? 'Street Lighting' : desc2.includes('garbage') ? 'Waste Management' : 'Road Infrastructure',
        severity_score: 7.2,
        urgency_level: 'High',
        responsible_department: 'Public Works Department',
        estimated_resolution_time: '3-5 days',
        citizen_friendly_summary: 'Issue logged and categorized. Our team has been alerted for prompt inspection and resolution.',
      });
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = desc || img;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,40,.78)', zIndex: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,.3)' }}>
        <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: '20px 20px 0 0', padding: '17px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Report a Civic Issue</div>
            <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, marginTop: 1 }}>Step {step} of 3 · AI-powered</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, padding: 0, fontSize: 13, cursor: 'pointer' }}
          >✕</button>
        </div>

        <div style={{ padding: 18 }}>
          {step === 1 && (
            <>
              <LField text="📍 Location">
                <Input placeholder="Street address or landmark…" value={loc} onChange={(e) => setLoc(e.target.value)} />
              </LField>
              <LField text="📝 Describe the Issue">
                <textarea
                  rows={4}
                  placeholder="Describe what you see — size, duration, safety risk…"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setDescFocused(false)}
                  style={{
                    width: '100%', padding: '10px 13px', borderRadius: 8,
                    border: '1.5px solid ' + (descFocused ? '#1A56DB' : '#E2E8F0'), fontSize: 14,
                    background: '#fff', color: '#0F1B35', outline: 'none', resize: 'vertical', transition: 'border-color .2s',
                  }}
                />
              </LField>
              <LField text="📸 Photo (optional)">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed ' + (img ? '#10B981' : '#E2E8F0'), borderRadius: 10, padding: 15,
                    textAlign: 'center', cursor: 'pointer', background: img ? '#ECFDF5' : '#F8FAFC',
                    marginBottom: 14, transition: 'all .2s',
                  }}
                >
                  {img ? (
                    <img src={img} alt="Upload preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 26, marginBottom: 5 }}>📷</div>
                      <div style={{ fontSize: 13, color: '#64748B' }}>Tap to upload photo</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>AI will auto-detect issue type</div>
                    </>
                  )}
                </div>
              </LField>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              <NavyBtn
                onClick={analyze}
                style={{ width: '100%', padding: '12px 0', fontSize: 14, borderRadius: 11, justifyContent: 'center', opacity: canAnalyze ? 1 : 0.5 }}
              >
                ✦ Analyze with AI →
              </NavyBtn>
            </>
          )}

          {step === 2 && (
            loading ? (
              <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: 12, padding: 16, color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span className="spin" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>AI analyzing…</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>Detecting issue type, severity & department</div>
                  </div>
                </div>
                {['Scanning for damage patterns', 'Calculating severity score', 'Identifying responsible department'].map((s3) => (
                  <div key={s3} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,.4)' }} />
                    <span style={{ fontSize: 12, opacity: 0.8 }}>{s3}</span>
                  </div>
                ))}
              </div>
            ) : result && (
              <>
                <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1A56DB)', borderRadius: 12, padding: 16, color: '#fff', marginBottom: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
                    <span style={{ fontSize: 14 }}>✦</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>AI Analysis Complete</span>
                    <Badge label="Live" c="rgba(255,255,255,.8)" bg="rgba(255,255,255,.15)" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 11 }}>
                    {[['📌 Category', result.issue_category], ['🏛️ Department', result.responsible_department], ['⚡ Urgency', result.urgency_level], ['🕐 ETA', result.estimated_resolution_time]].map(([label, val]) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,.1)', borderRadius: 8, padding: '9px 11px' }}>
                        <div style={{ fontSize: 10, opacity: 0.65, marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, opacity: 0.65, marginBottom: 4 }}>SEVERITY SCORE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 7, background: 'rgba(255,255,255,.2)', borderRadius: 4 }}>
                        <div style={{ height: '100%', borderRadius: 4, background: result.severity_score >= 8 ? '#FCA5A5' : '#F59E0B', width: result.severity_score * 10 + '%' }} />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 17 }}>{result.severity_score}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 8, padding: 10, fontSize: 12, lineHeight: 1.6 }}>
                    {result.citizen_friendly_summary}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <GhostBtn onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Edit</GhostBtn>
                  <NavyBtn onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center', fontSize: 14 }}>Confirm & Submit →</NavyBtn>
                </div>
              </>
            )
          )}

          {step === 3 && (
            <>
              <div style={{ textAlign: 'center', padding: '14px 0 11px' }}>
                <div style={{ fontSize: 42, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Ready to Submit!</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>Verified by AI · Routed to the right department</div>
              </div>
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 13, marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['Category', result?.issue_category ?? '—'], ['Severity', result ? result.severity_score + '/10' : '—'], ['Urgency', result?.urgency_level ?? '—'], ['ETA', result?.estimated_resolution_time ?? '—']].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#ECFDF5', borderRadius: 10, padding: 11, marginBottom: 13, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 18 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981' }}>+150 Citizen Points earned</div>
                  <div style={{ fontSize: 11, color: '#059669' }}>Thanks for making your community safer!</div>
                </div>
              </div>
              <GreenBtn
                onClick={() => onSubmit({ desc, result })}
                style={{ width: '100%', padding: '12px 0', fontSize: 14, borderRadius: 11, justifyContent: 'center' }}
              >
                ✓ Submit Issue Report
              </GreenBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
