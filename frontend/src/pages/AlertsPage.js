import React, { useEffect, useState } from 'react';
import floodZones from '../data/flood_zones.json';

function AlertsPage({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [zone, setZone] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('Medium');

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/alerts`)
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error('Error loading alerts:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAlert = {
      zone,
      message,
      severity,
      time: new Date().toLocaleString()
    };

    fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlert)
    })
      .then((res) => res.json())
      .then((data) => {
        setAlerts((prev) => [data, ...prev]);
        setZone('');
        setMessage('');
        setSeverity('Medium');
      });
  };

  const handleAcknowledge = (id) => {
    fetch(`${API_URL}/alerts/${id}/acknowledge`, {
      method: 'PUT'
    })
      .then((res) => res.json())
      .then((updatedAlert) => {
        setAlerts((prev) =>
          prev.map((a) => (a.id === updatedAlert.id ? updatedAlert : a))
        );
      });
  };

  const getSeverityColor = (s) =>
    s === 'High' ? '#ff4444' : s === 'Medium' ? '#ff8c00' : '#4caf50';

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
      background: '#f8f9fa',
      minHeight: '100vh'
    },
    formContainer: {
      marginBottom: '2rem',
      background: '#fff',
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    header: {
      fontSize: '1.75rem',
      marginBottom: '1rem',
      color: '#2c3e50'
    },
    formGroup: {
      marginBottom: '1.25rem'
    },
    label: {
      fontWeight: '600',
      display: 'block',
      marginBottom: '0.5rem',
      color: '#34495e'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '0.5rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #ccc',
      resize: 'vertical'
    },
    submitBtn: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    alertsSection: {
      marginTop: '2rem'
    },
    noAlerts: {
      fontStyle: 'italic',
      color: '#6c757d'
    },
    alertCard: {
      background: '#fff',
      padding: '1.25rem',
      marginBottom: '1rem',
      borderRadius: '0.75rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      position: 'relative'
    },
    severityBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.75rem',
      color: '#fff',
      borderRadius: '999px',
      fontSize: '0.85rem',
      fontWeight: 'bold'
    },
    alertInfo: {
      marginTop: '0.5rem',
      fontSize: '1rem'
    },
    alertLabel: {
      fontWeight: 'bold',
      color: '#555'
    },
    acknowledgeBtn: {
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {(user?.role === 'Coordinator' || user?.role === 'Admin') && (
        <div style={styles.formContainer}>
          <h2 style={styles.header}>🚨 Submit Flood Alert</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Flood Zone:</label>
              <select
                style={styles.input}
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                required
              >
                <option value="">Select a flood zone</option>
                {floodZones.features.map((f, idx) => (
                  <option key={idx} value={f.properties.zone}>
                    {f.properties.zone}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message:</label>
              <textarea
                style={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Enter alert message..."
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Severity:</label>
              <select
                style={styles.input}
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <button type="submit" style={styles.submitBtn}>Submit Alert</button>
          </form>
        </div>
      )}

      <div style={styles.alertsSection}>
        <h3 style={{ ...styles.header, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          📋 Active Alerts
        </h3>
        {alerts.length === 0 ? (
          <div style={styles.noAlerts}>No alerts submitted yet.</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} style={styles.alertCard}>
              <div
                style={{
                  ...styles.severityBadge,
                  backgroundColor: getSeverityColor(alert.severity)
                }}
              >
                {alert.severity}
              </div>
              <div style={styles.alertInfo}>
                <span style={styles.alertLabel}>Zone:</span> {alert.zone}
              </div>
              <div style={styles.alertInfo}>
                <span style={styles.alertLabel}>Message:</span> {alert.message}
              </div>
              <div style={styles.alertInfo}>
                <span style={styles.alertLabel}>Status:</span>{' '}
                {alert.acknowledged ? '✅ Acknowledged' : '⏳ Not Acknowledged'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                {alert.time}
              </div>
              {user?.role === 'Responder' && !alert.acknowledged && (
                <button
                  style={styles.acknowledgeBtn}
                  onClick={() => handleAcknowledge(alert.id)}
                >
                  Mark as Acknowledged
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlertsPage;
