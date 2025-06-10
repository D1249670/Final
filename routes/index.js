var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 查詢價格API
router.get('/prices', function(req, res) {
  const start = parseInt(req.query.start, 10) || 2005;
  const end = parseInt(req.query.end, 10) || 2025;
  db.all('SELECT year, price, type FROM prices WHERE year >= ? AND year <= ? ORDER BY year', [start, end], (err, rows) => {
    if (err) {
      res.status(500).json({ error: '資料庫查詢失敗' });
    } else {
      // 分組
      const result = { taiwan: [], global: [] };
      rows.forEach(row => {
        if (row.type === 'taiwan') result.taiwan.push({ year: row.year, price: row.price });
        if (row.type === 'global') result.global.push({ year: row.year, price: row.price });
      });
      res.json(result);
    }
  });
});

// 新增價格API
router.post('/insert-price', function(req, res) {
  const { type, year, price } = req.body;
  if (!type || !year || !price) {
    return res.json({ success: false, error: '資料不完整' });
  }
  db.run('INSERT OR REPLACE INTO prices (year, price, type) VALUES (?, ?, ?)', [year, price, type], function(err) {
    if (err) {
      res.json({ success: false, error: '資料庫寫入失敗' });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;
