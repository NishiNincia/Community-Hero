export const STAGES = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

export const UCFG = {
  Critical: { c: '#EF4444', bg: '#FEF2F2' },
  High: { c: '#D97706', bg: '#FFFBEB' },
  Medium: { c: '#0369A1', bg: '#EFF6FF' },
  Low: { c: '#10B981', bg: '#ECFDF5' },
};

export const SCFG = {
  Reported: { c: '#64748B', bg: '#F1F5F9' },
  Verified: { c: '#7C3AED', bg: '#F5F3FF' },
  Assigned: { c: '#F59E0B', bg: '#FFFBEB' },
  'In Progress': { c: '#1A56DB', bg: '#EFF6FF' },
  Resolved: { c: '#10B981', bg: '#ECFDF5' },
};

export const LB = [
  { n: 'NaomiK', pts: 1840, b: '🏆', i: 23, v: 19 },
  { n: 'FloodWatch', pts: 1620, b: '🥈', i: 18, v: 16 },
  { n: 'CitizenX', pts: 1405, b: '🥉', i: 15, v: 12 },
  { n: 'GreenWarden', pts: 980, b: '⭐', i: 11, v: 9 },
  { n: 'SafetyFirst', pts: 760, b: '⭐', i: 9, v: 7 },
];

export const INITIAL_ISSUES = [
  { id: 'ISS-001', title: 'Large pothole on Main St & 5th Ave', cat: 'Road Infrastructure', sev: 8.4, urg: 'High', dept: 'Public Works', status: 'In Progress', eta: '3 days', votes: 24, lat: 40.7128, lng: -74.006, ward: 'Ward 3', desc: 'Deep pothole causing vehicle damage, approx 60cm wide. Present for 2 weeks.', ai: 'Critical road hazard requiring urgent patching. High vehicle damage risk detected.', stage: 3 },
  { id: 'ISS-002', title: 'Water leakage from main pipeline', cat: 'Water Supply', sev: 9.1, urg: 'Critical', dept: 'Water & Sanitation', status: 'Assigned', eta: '24 hrs', votes: 41, lat: 40.7145, lng: -74.009, ward: 'Ward 3', desc: 'Underground pipe burst, water pooling on footpath. Causing road damage.', ai: 'Severe water wastage and public hazard. Immediate repair needed.', stage: 2 },
  { id: 'ISS-003', title: 'Garbage overflow near community center', cat: 'Waste Management', sev: 6.2, urg: 'Medium', dept: 'Sanitation', status: 'Verified', eta: '2 days', votes: 18, lat: 40.711, lng: -74.003, ward: 'Ward 4', desc: 'Bin overflowing for 3 days, attracting pests and causing odour.', ai: 'Public health concern. Scheduled for next pickup cycle.', stage: 1 },
  { id: 'ISS-004', title: '4 streetlights out on Oak Boulevard', cat: 'Street Lighting', sev: 7.5, urg: 'High', dept: 'Electricity Dept', status: 'Reported', eta: '5 days', votes: 12, lat: 40.709, lng: -74.011, ward: 'Ward 2', desc: 'Complete darkness from 8pm. Safety hazard for pedestrians and vehicles.', ai: 'Safety risk at night. Electrical team alerted for inspection.', stage: 0 },
  { id: 'ISS-005', title: 'Drainage block causing flooding', cat: 'Drainage & Sewage', sev: 8.8, urg: 'Critical', dept: 'Drainage Dept', status: 'Resolved', eta: 'Resolved', votes: 35, lat: 40.715, lng: -74.001, ward: 'Ward 5', desc: 'Storm drain completely blocked, road floods during rain.', ai: 'Resolved: Drain cleared. Preventive maintenance scheduled monthly.', stage: 4 },
  { id: 'ISS-006', title: 'Broken bench near children play area', cat: 'Parks & Recreation', sev: 5.1, urg: 'Low', dept: 'Parks Dept', status: 'Reported', eta: '7 days', votes: 8, lat: 40.710, lng: -74.008, ward: 'Ward 4', desc: 'Wooden bench with exposed nails, dangerous for children.', ai: 'Low-severity but safety concern near playground. Repair scheduled.', stage: 0 },
];
