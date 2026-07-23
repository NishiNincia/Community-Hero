const express = require('express');
const { categories } = require('../agents/classificationAgent');

const router = express.Router();

function sendCategories(req, res) {
  res.json(categories);
}

// GET /api/config — returns the category -> department -> SLA lookup table.
router.get('/', sendCategories);

// GET /api/config/categories — the admin-editable category -> department ->
// SLA lookup table described in the architecture doc (Section 2 / Section 9).
router.get('/categories', sendCategories);

module.exports = router;
