import React from 'react';
import { NavyBtn, GhostBtn } from './UI.jsx';
import Dashboard from './Dashboard.jsx';
import IssuesTab from './IssuesTab.jsx';
import MapTab from './MapTab.jsx';
import AnalyticsTab from './AnalyticsTab.jsx';
import HeroesTab from './HeroesTab.jsx';
import ReportModal from './ReportModal.jsx';
import IssueDetailModal from './IssueDetailModal.jsx';

export default function MainApp({ role, user, issues, setIssues, onSignOut, showToast }) {
  const isGovt = role === 'government';
  const [tab, setTab] = React.useState(isGovt ? 'issues' : 'dash');
  const [fSt, setFSt] = React.useState('All');
  const [fWd, setFWd] = React.useState('All');
  const [selIssue, setSelIssue] = React.useState(null);
  const [selMapId, setSelMapId] = React.useState(null);
  const [showRep, setShowRep] = React.useState(false);

  const navItems = isGovt
    ? [{ id: 'issues', lb: '⚠ Issues' }, { id: 'map', lb: '🗺 Map' }, { id: 'analytics', lb: '📊 Analytics' }, { id: 'heroes', lb: '🏆 Citizens' }]
    : [{ id: 'dash', lb: '⊞ Dashboard' }, { id: 'map', lb: '🗺 Map' }, { id: 'issues', lb: '⚠ Issues' }, { id: 'analytics', lb: '📊 Analytics' }, { id: 'heroes', lb: '🏆 Heroes' }];

  const filteredIssues = issues.filter((i) => (fSt === 'All' || i.status === fSt) && (fWd === 'All' || i.ward === fWd));

  const openIssue = (iss) => setSelIssue(iss);
  const openReport = () => setShowRep(true);
  const selectMap = (iss) => { setSelMapId(iss.id); setSelIssue(iss); };

  const handleReportSubmit = ({ desc, result }) => {
    const newIssue = {
      id: 'ISS-00' + (issues.length + 1),
      title: desc.slice(0, 50) + (desc.length > 50 ? '…' : ''),
      cat: result ? result.issue_category : 'General',
      sev: result ? result.severity_score : 5,
      urg: result ? result.urgency_level : 'Medium',
      dept: result ? result.responsible_department : 'Public Works',
      status: 'Reported',
      eta: result ? result.estimated_resolution_time : 'TBD',
      votes: 0,
      lat: 40.712 + (Math.random() - 0.5) * 0.01,
      lng: -74.005 + (Math.random() - 0.5) * 0.01,
      ward: 'Ward 3',
      desc,
      ai: result ? result.citizen_friendly_summary : 'Issue logged.',
      stage: 0,
    };
    setIssues([newIssue, ...issues]);
    setShowRep(false);
    showToast('✓ Issue submitted! +150 Citizen Points earned');
  };

  const handleUpdateStatus = (id, newStatus) => {
    setIssues(issues.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    setSelIssue(null);
    showToast('✓ Status updated & citizen notified');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#0F1B35,#1E3A6E)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,.3)' }}>
        <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', height: 54, gap: 10, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🦸</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Community Hero</div>
              <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em' }}>Civic Platform</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 2, marginLeft: 10 }}>
            {navItems.map((n) => (
              <NavButton key={n.id} label={n.lb} active={tab === n.id} onClick={() => setTab(n.id)} />
            ))}
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: '4px 12px 4px 5px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, background: isGovt ? 'rgba(245,158,11,.2)' : 'rgba(59,130,246,.2)' }}>
              {isGovt ? '🏛️' : '👤'}
            </div>
            <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 12, fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user ? user.name : 'User'}
            </span>
            {isGovt && <span style={{ fontSize: 10, color: '#F59E0B', fontWeight: 700, marginLeft: 3 }}> GOV</span>}
          </div>

          {!isGovt && (
            <NavyBtn onClick={openReport} style={{ fontSize: 12, padding: '7px 13px', marginLeft: 8 }}>+ Report Issue</NavyBtn>
          )}
          <GhostBtn onClick={onSignOut} style={{ fontSize: 12, padding: '7px 11px', color: 'rgba(255,255,255,.55)', border: 'none', background: 'rgba(255,255,255,.08)', marginLeft: 6 }}>
            ↩ Sign Out
          </GhostBtn>
        </div>
      </div>

      <div style={{ flex: 1, padding: 16, maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        {tab === 'dash' && !isGovt && (
          <Dashboard
            userName={user ? user.name : ''}
            issues={issues}
            selMapId={selMapId}
            onSelMap={selectMap}
            onOpenReport={openReport}
            onOpenIssue={openIssue}
            onGoIssues={() => setTab('issues')}
          />
        )}
        {tab === 'issues' && (
          <IssuesTab
            issues={issues}
            filteredIssues={filteredIssues}
            isGovt={isGovt}
            user={user}
            fSt={fSt} setFSt={setFSt}
            fWd={fWd} setFWd={setFWd}
            onOpenIssue={openIssue}
          />
        )}
        {tab === 'map' && (
          <MapTab
            issues={issues}
            filteredIssues={filteredIssues}
            fWd={fWd} setFWd={setFWd}
            selMapId={selMapId}
            onSelMap={selectMap}
            onOpenIssue={openIssue}
          />
        )}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'heroes' && <HeroesTab isGovt={isGovt} userName={user ? user.name : 'You'} />}
      </div>

      {showRep && (
        <ReportModal onClose={() => setShowRep(false)} onSubmit={handleReportSubmit} />
      )}

      {selIssue && (
        <IssueDetailModal
          issue={selIssue}
          isGovt={isGovt}
          onClose={() => { setSelIssue(null); setSelMapId(null); }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

function NavButton({ label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? 'rgba(255,255,255,.13)' : 'transparent',
        color: active ? '#fff' : hover ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.5)',
        border: 'none', padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
        fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, transition: 'all .2s',
      }}
    >
      {label}
    </button>
  );
}
