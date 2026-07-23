require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const demoCitizen = { id: uuidv4(), name: 'NaomiK', email: 'naomi@example.com' };
const demoGovt = { id: uuidv4(), name: 'Officer Sharma', email: 'sharma@municipality.gov' };

db.prepare(`INSERT OR IGNORE INTO users (id, name, email, password_hash, role, points, issues_count, verified_count) VALUES (?, ?, ?, ?, 'citizen', 1840, 23, 19)`)
  .run(demoCitizen.id, demoCitizen.name, demoCitizen.email, bcrypt.hashSync('password123', 10));

db.prepare(`INSERT OR IGNORE INTO users (id, name, email, password_hash, role, dept, emp_id) VALUES (?, ?, ?, ?, 'government', 'Public Works – Roads', 'GOV-2024-1847')`)
  .run(demoGovt.id, demoGovt.name, demoGovt.email, bcrypt.hashSync('password123', 10));

['FloodWatch', 'CitizenX', 'GreenWarden', 'SafetyFirst'].forEach((name, i) => {
  const pts = [1620, 1405, 980, 760][i];
  const issues = [18, 15, 11, 9][i];
  const ver = [16, 12, 9, 7][i];
  db.prepare(`INSERT OR IGNORE INTO users (id, name, email, password_hash, role, points, issues_count, verified_count) VALUES (?, ?, ?, ?, 'citizen', ?, ?, ?)`)
    .run(uuidv4(), name, `${name.toLowerCase()}@example.com`, bcrypt.hashSync('password123', 10), pts, issues, ver);
});

const demoIssues = [
  { title: 'Large pothole on Main St', cat: 'Roads & Infrastructure', sev: 8.4, urg: 'High', dept: 'Public Works Dept', status: 'In Progress', votes: 24, lat: 40.7128, lng: -74.006, ward: 'Ward 3', desc: 'Deep pothole causing vehicle damage, approx 60cm wide.', sum: 'Critical road hazard requiring urgent patching.', stage: 3 },
  { title: 'Water leakage from pipeline', cat: 'Water Supply', sev: 9.1, urg: 'Critical', dept: 'Water Board', status: 'Assigned', votes: 41, lat: 40.7145, lng: -74.0089, ward: 'Ward 3', desc: 'Underground pipe burst, water pooling on footpath.', sum: 'Severe water wastage. Immediate repair needed.', stage: 2 },
  { title: 'Garbage overflow at community center', cat: 'Sanitation & Waste', sev: 6.2, urg: 'Medium', dept: 'Sanitation Dept', status: 'Verified', votes: 18, lat: 40.711, lng: -74.003, ward: 'Ward 4', desc: 'Bin overflowing for 3 days, attracting pests.', sum: 'Public health concern. Scheduled for next pickup.', stage: 1 },
  { title: '4 streetlights out on Oak Blvd', cat: 'Street Lighting', sev: 7.5, urg: 'High', dept: 'Electricity Dept', status: 'Reported', votes: 12, lat: 40.709, lng: -74.011, ward: 'Ward 2', desc: 'Darkness from 8pm. Safety hazard for pedestrians.', sum: 'Safety risk. Electrical team alerted.', stage: 0 },
  { title: 'Drainage block causing flooding', cat: 'Sanitation & Waste', sev: 8.8, urg: 'Critical', dept: 'Sanitation Dept', status: 'Resolved', votes: 35, lat: 40.715, lng: -74.001, ward: 'Ward 5', desc: 'Storm drain blocked, road floods during rain.', sum: 'Resolved: Drain cleared. Maintenance scheduled.', stage: 4 },
];

const insert = db.prepare(
  `INSERT OR IGNORE INTO complaints
   (id, user_id, title, description, category, department, severity_score, urgency_level,
    status, stage, votes, latitude, longitude, ward, ai_summary, resolved_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

demoIssues.forEach((iss, i) => {
  insert.run(
    'ISS-DEMO-' + (i + 1), demoCitizen.id, iss.title, iss.desc, iss.cat, iss.dept,
    iss.sev, iss.urg, iss.status, iss.stage, iss.votes, iss.lat, iss.lng, iss.ward, iss.sum,
    iss.status === 'Resolved' ? new Date().toISOString() : null
  );
});

console.log('Seed complete.');
console.log('Citizen login -> email: naomi@example.com / password: password123');
console.log('Government login -> email: sharma@municipality.gov / password: password123 / empId: GOV-2024-1847');
