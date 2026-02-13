/**
 * API Routes for MedMicro PWA
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Data caches
let medsCache = [];
let guidelinesCache = [];
let criteriaCache = [];

// Load data on startup
async function loadData() {
  try {
    // Load medications
    const medsDir = path.join(__dirname, '../data/meds');
    const medFiles = await fs.readdir(medsDir);
    medsCache = await Promise.all(
      medFiles
        .filter(f => f.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(medsDir, file), 'utf-8');
          return JSON.parse(content);
        })
    );

    // Load guidelines
    const guidelinesDir = path.join(__dirname, '../data/guidelines');
    const guidelineFiles = await fs.readdir(guidelinesDir);
    guidelinesCache = await Promise.all(
      guidelineFiles
        .filter(f => f.endsWith('.md'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(guidelinesDir, file), 'utf-8');

          // Parse frontmatter
          const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
          if (!match) return null;

          const fmText = match[1];
          const body = match[2];

          const titleMatch = fmText.match(/title:\s*"(.*)"/);
          const orgMatch = fmText.match(/organization:\s*"(.*)"/);
          const yearMatch = fmText.match(/year:\s*(\d+)/);

          return {
            id: file,
            title: titleMatch ? titleMatch[1] : file,
            organization: orgMatch ? orgMatch[1] : '',
            year: yearMatch ? parseInt(yearMatch[1]) : 0,
            content: body
          };
        })
    );
    guidelinesCache = guidelinesCache.filter(Boolean);

    // Load criteria
    const criteriaDir = path.join(__dirname, '../data/criteria');
    const criteriaFiles = await fs.readdir(criteriaDir);
    criteriaCache = await Promise.all(
      criteriaFiles
        .filter(f => f.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(criteriaDir, file), 'utf-8');
          return JSON.parse(content);
        })
    );

    console.log(`✓ Loaded ${medsCache.length} medications`);
    console.log(`✓ Loaded ${guidelinesCache.length} guidelines`);
    console.log(`✓ Loaded ${criteriaCache.length} criteria`);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Load data on module initialization
loadData();

// Medications endpoints
router.get('/meds', (req, res) => {
  res.json({ success: true, data: medsCache });
});

router.get('/meds/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const med = medsCache.find(m => m.name.toLowerCase().includes(query));
  res.json({ success: true, data: med || null });
});

router.get('/meds/class/:class', (req, res) => {
  const className = req.params.class.toLowerCase();
  const meds = medsCache.filter(m =>
    m.tags.some(tag => tag.toLowerCase().includes(className))
  );
  res.json({ success: true, data: meds });
});

// Guidelines endpoints
router.get('/guidelines', (req, res) => {
  const query = (req.query.q || '').toLowerCase();

  if (!query) {
    return res.json({ success: true, data: guidelinesCache });
  }

  const filtered = guidelinesCache.filter(g =>
    g.title.toLowerCase().includes(query) ||
    g.content.toLowerCase().includes(query)
  );
  res.json({ success: true, data: filtered });
});

// Criteria endpoints
router.get('/criteria/:disorder', (req, res) => {
  const disorder = req.params.disorder.toLowerCase();
  const criteria = criteriaCache.find(c =>
    c.disorder.toLowerCase().includes(disorder)
  );
  res.json({ success: true, data: criteria || null });
});

// Calculator endpoints
router.post('/calc/phq9', (req, res) => {
  const { score } = req.body;
  const s = parseInt(score);

  let interpretation;
  if (s <= 4) interpretation = 'None-minimal';
  else if (s <= 9) interpretation = 'Mild';
  else if (s <= 14) interpretation = 'Moderate';
  else if (s <= 19) interpretation = 'Moderately severe';
  else interpretation = 'Severe';

  res.json({ success: true, data: { score: s, interpretation } });
});

router.post('/calc/gad7', (req, res) => {
  const { score } = req.body;
  const s = parseInt(score);

  let interpretation;
  if (s <= 4) interpretation = 'Minimal';
  else if (s <= 9) interpretation = 'Mild';
  else if (s <= 14) interpretation = 'Moderate';
  else interpretation = 'Severe';

  res.json({ success: true, data: { score: s, interpretation } });
});

router.post('/calc/bmi', (req, res) => {
  const { weight, height } = req.body;
  const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2));

  let interpretation;
  if (bmi < 18.5) interpretation = 'Underweight';
  else if (bmi < 25) interpretation = 'Normal weight';
  else if (bmi < 30) interpretation = 'Overweight';
  else interpretation = 'Obese';

  res.json({ success: true, data: { bmi: bmi.toFixed(1), interpretation } });
});

module.exports = router;
