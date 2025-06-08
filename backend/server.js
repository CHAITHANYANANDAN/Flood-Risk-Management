const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let alerts = []; // In-memory alert list

// GET all alerts
app.get('/alerts', (req, res) => {
  res.json(alerts);
});

// POST new alert
app.post('/alerts', (req, res) => {
  const { zone, message, severity, time } = req.body;

  if (!zone || !message || !severity) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newAlert = {
    id: Date.now(),
    zone,
    message,
    severity,
    time: time || new Date().toLocaleString(),
    acknowledged: false
  };

  alerts.unshift(newAlert);
  console.log('✅ New alert created:', newAlert);
  res.status(201).json(newAlert);
});

// PUT acknowledge alert by ID
app.put('/alerts/:id/acknowledge', (req, res) => {
  const id = parseInt(req.params.id);
  const alert = alerts.find((a) => a.id === id);

  if (alert) {
    alert.acknowledged = true;
    console.log(`✅ Alert ${id} acknowledged`);
    res.json(alert);
  } else {
    res.status(404).json({ message: 'Alert not found' });
  }
});

// Optional: CORS preflight for custom methods
app.options('*', cors());

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
