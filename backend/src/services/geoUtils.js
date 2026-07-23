// Haversine distance in meters between two lat/lng points.
// This is the portable stand-in for PostGIS ST_DWithin used in the architecture doc.
// Swap this module for a PostGIS-backed query (ST_DWithin on a geography column)
// when moving to Postgres in production — the calling code in duplicateCheckAgent.js
// does not need to change, only this function's implementation.
function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple geohash-like bucket key for coarse pre-filtering before the precise
// haversine check, so we don't scan every complaint in the city on each insert.
function bucketKey(lat, lng, precision = 3) {
  return `${lat.toFixed(precision)}:${lng.toFixed(precision)}`;
}

function neighboringBuckets(lat, lng, precision = 3) {
  const step = 1 / Math.pow(10, precision);
  const buckets = [];
  for (let dLat = -1; dLat <= 1; dLat++) {
    for (let dLng = -1; dLng <= 1; dLng++) {
      buckets.push(bucketKey(lat + dLat * step, lng + dLng * step, precision));
    }
  }
  return buckets;
}

module.exports = { haversineMeters, bucketKey, neighboringBuckets };
