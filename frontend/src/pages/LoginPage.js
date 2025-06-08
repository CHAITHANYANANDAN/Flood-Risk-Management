import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Responder');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setUser({ email, role });
    navigate('/dashboard');
    setIsLoading(false);
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'Admin':
        return 'Full system access and management capabilities';
      case 'Coordinator':
        return 'Manage alerts and coordinate emergency responses';
      case 'Responder':
        return 'Receive and acknowledge flood alerts';
      default:
        return '';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '1rem'
    },
    loginCard: {
      backgroundColor: 'white',
      padding: '3rem',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '450px',
      position: 'relative',
      overflow: 'hidden'
    },
    decorativeShape: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      width: '100px',
      height: '100px',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '50%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem'
    },
    title: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '0.5rem',
      fontWeight: 'bold'
    },
    subtitle: {
      color: '#7f8c8d',
      fontSize: '1rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '0.5rem'
    },
    input: {
      padding: '1rem',
      border: '2px solid #e1e8ed',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s',
      backgroundColor: '#f8f9fa'
    },
    inputFocus: {
      borderColor: '#667eea',
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    roleSelect: {
      padding: '1rem',
      border: '2px solid #e1e8ed',
      borderRadius: '10px',
      fontSize: '1rem',
      backgroundColor: '#f8f9fa',
      cursor: 'pointer'
    },
    roleDescription: {
      fontSize: '0.875rem',
      color: '#7f8c8d',
      marginTop: '0.5rem',
      padding: '0.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #e1e8ed'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '1rem',
      position: 'relative',
      overflow: 'hidden'
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    loader: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem'
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      color: '#7f8c8d',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.decorativeShape}></div>
        
        <div style={styles.header}>
          <h2 style={styles.title}>🌊 Welcome</h2>
          <h3 style={styles.title}>Flood Risk Assessment</h3>
          <h4 style={styles.title}>🔐 Login</h4>
          <p style={styles.subtitle}>Access Flood Management System</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e8ed';
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.roleSelect}
            >
              <option value="Responder">🚨 Responder</option>
              <option value="Coordinator">📋 Coordinator</option>
              <option value="Admin">👨‍💼 Admin</option>
            </select>
            <div style={styles.roleDescription}>
              {getRoleDescription(role)}
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={styles.loader}></div>
                Logging in...
              </div>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p>🌍 Flood Management System v1.0</p>
        </div>
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

export default LoginPage;