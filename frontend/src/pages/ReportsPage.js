import React, { useState, useEffect } from 'react';

function ReportsPage({ user }) {
  // Debug logging - remove after fixing
  console.log('ReportsPage - user object:', user);
  console.log('ReportsPage - user role:', user?.role);
  console.log('ReportsPage - typeof user role:', typeof user?.role);

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    acknowledged: 0,
    pending: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0
  });

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/alerts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Ensure data is an array
      const alertsData = Array.isArray(data) ? data : [];
      setAlerts(alertsData);
      calculateStats(alertsData);
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError('Failed to load alerts from server');
      setAlerts([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (alertsData) => {
    const stats = {
      total: alertsData.length,
      acknowledged: alertsData.filter(a => a.acknowledged).length,
      pending: alertsData.filter(a => !a.acknowledged).length,
      highSeverity: alertsData.filter(a => a.severity === 'High').length,
      mediumSeverity: alertsData.filter(a => a.severity === 'Medium').length,
      lowSeverity: alertsData.filter(a => a.severity === 'Low').length
    };
    setStats(stats);
  };

  const handleExportCSV = async () => {
    if (alerts.length === 0) {
      alert("No alerts available to export.");
      return;
    }

    setIsExporting(true);

    try {
      // Prepare CSV data
      const headers = ["ID", "Zone", "Message", "Severity", "Time", "Acknowledged", "Created Date"];
      const rows = alerts.map(alert => [
        alert._id || alert.id || '',
        `"${alert.zone || ''}"`,
        `"${(alert.message || '').replace(/"/g, '""')}"`, // Escape quotes in message
        alert.severity || '',
        alert.time || '',
        alert.acknowledged ? "Yes" : "No",
        alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : ''
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `flood_alerts_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Simulate export delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Alerts exported successfully!");
    } catch (err) {
      console.error("Error exporting alerts:", err);
      alert("Failed to export alerts. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const refreshData = () => {
    loadAlerts();
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '1.1rem'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    errorContainer: {
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '10px',
      padding: '1.5rem',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    errorText: {
      color: '#c33',
      fontSize: '1.1rem',
      marginBottom: '1rem'
    },
    refreshButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
      border: '1px solid #e1e8ed'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#7f8c8d',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      fontWeight: 'bold'
    },
    exportSection: {
      backgroundColor: 'white',
      padding: '2.5rem',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    exportTitle: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      marginBottom: '1rem',
      fontWeight: 'bold'
    },
    exportDescription: {
      color: '#7f8c8d',
      fontSize: '1rem',
      marginBottom: '2rem',
      lineHeight: '1.6'
    },
    exportButton: {
      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      color: 'white',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    exportButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    recentAlerts: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    },
    alertsTitle: {
      fontSize: '1.5rem',
      color: '#2c3e50',
      marginBottom: '1.5rem',
      fontWeight: 'bold'
    },
    alertItem: {
      padding: '1rem',
      borderBottom: '1px solid #e1e8ed',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    alertInfo: {
      flex: 1
    },
    alertZone: {
      fontWeight: 'bold',
      color: '#2c3e50'
    },
    alertMessage: {
      color: '#7f8c8d',
      fontSize: '0.9rem',
      marginTop: '0.25rem'
    },
    alertBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      color: 'white'
    },
    noData: {
      textAlign: 'center',
      color: '#7f8c8d',
      fontSize: '1.1rem',
      padding: '2rem'
    },
    loader: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    bigLoader: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    debugInfo: {
      marginTop: '1rem',
      fontSize: '0.8rem',
      color: '#666',
      padding: '0.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      fontFamily: 'monospace'
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatColor = (type) => {
    switch (type) {
      case 'total': return '#3498db';
      case 'acknowledged': return '#27ae60';
      case 'pending': return '#e74c3c';
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  // TEMPORARY: Bypass permission check for testing
  // TODO: Fix user authentication and re-enable this check
  /*
  const userRole = user?.role?.toLowerCase();
  if (userRole !== 'admin' && userRole !== 'coordinator') {
    console.log('Access denied - Role check failed');
    console.log('Expected: "admin" or "coordinator" (case-insensitive)');
    console.log('Actual role (lowercase):', userRole);
    
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>
            ⛔ Access Denied
          </div>
          <p>You don't have permission to view reports. Contact your administrator.</p>
          <div style={styles.debugInfo}>
            Debug Info:<br/>
            User role: "{user?.role}"<br/>
            User role (lowercase): "{userRole}"<br/>
            Type: {typeof user?.role}<br/>
            Full user object: {JSON.stringify(user, null, 2)}
          </div>
          <button onClick={() => window.location.reload()} style={styles.refreshButton}>
            🔄 Refresh Page
          </button>
        </div>
      </div>
    );
  }
  */

  // Show warning about missing user data
  if (!user || !user.role) {
    console.warn('Warning: User object is missing or incomplete:', user);
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>📄 Admin Reports</h2>
          <p style={styles.subtitle}>Loading report data...</p>
        </div>
        <div style={styles.loadingContainer}>
          <div style={styles.bigLoader}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📄 Admin Reports</h2>
        <p style={styles.subtitle}>
          Comprehensive analytics and data export for flood management
        </p>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>❌ {error}</div>
          <button onClick={refreshData} style={styles.refreshButton}>
            🔄 Retry Loading Data
          </button>
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: getStatColor('total') }}>
            {stats.total}
          </div>
          <div style={styles.statLabel}>Total Alerts</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: getStatColor('acknowledged') }}>
            {stats.acknowledged}
          </div>
          <div style={styles.statLabel}>Acknowledged</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: getStatColor('pending') }}>
            {stats.pending}
          </div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: getStatColor('high') }}>
            {stats.highSeverity}
          </div>
          <div style={styles.statLabel}>High Severity</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: getStatColor('medium') }}>
            {stats.mediumSeverity}
          </div>
          <div style={styles.statLabel}>Medium Severity</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: getStatColor('low') }}>
            {stats.lowSeverity}
          </div>
          <div style={styles.statLabel}>Low Severity</div>
        </div>
      </div>

      <div style={styles.exportSection}>
        <h3 style={styles.exportTitle}>📊 Export Data</h3>
        <p style={styles.exportDescription}>
          Download a comprehensive CSV report containing all flood alerts with their details, 
          timestamps, and acknowledgment status for further analysis and record keeping.
        </p>
        <button
          onClick={handleExportCSV}
          style={{
            ...styles.exportButton,
            ...(isExporting ? styles.exportButtonDisabled : {})
          }}
          disabled={isExporting || alerts.length === 0}
          onMouseEnter={(e) => {
            if (!isExporting && alerts.length > 0) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(39, 174, 96, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isExporting && alerts.length > 0) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isExporting ? (
            <>
              <div style={styles.loader}></div>
              Exporting...
            </>
          ) : (
            <>
              ⬇️ Export Alerts to CSV ({alerts.length} records)
            </>
          )}
        </button>
      </div>

      <div style={styles.recentAlerts}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={styles.alertsTitle}>📋 Recent Alerts Preview</h3>
          <button onClick={refreshData} style={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>
        
        {alerts.length === 0 ? (
          <div style={styles.noData}>
            {error ? "Unable to load alerts" : "No alerts available to display"}
          </div>
        ) : (
          <>
            {alerts.slice(0, 5).map((alert, idx) => (
              <div key={alert._id || alert.id || idx} style={styles.alertItem}>
                <div style={styles.alertInfo}>
                  <div style={styles.alertZone}>Zone: {alert.zone || 'N/A'}</div>
                  <div style={styles.alertMessage}>
                    {alert.message && alert.message.length > 60 
                      ? `${alert.message.substring(0, 60)}...` 
                      : alert.message || 'No message'
                    }
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '0.25rem' }}>
                    {alert.time || (alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'No timestamp')}
                  </div>
                </div>
                <div>
                  <div 
                    style={{
                      ...styles.alertBadge,
                      backgroundColor: getSeverityColor(alert.severity)
                    }}
                  >
                    {alert.severity || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>
                    {alert.acknowledged ? '✅' : '⏳'}
                  </div>
                </div>
              </div>
            ))}
            {alerts.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '1rem', color: '#7f8c8d' }}>
                ... and {alerts.length - 5} more alerts
              </div>
            )}
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default ReportsPage;