import React, { useState } from 'react';
import shelters from '../data/shelters.json';

function SheltersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Get unique shelter types
  const shelterTypes = ['All', ...new Set(shelters.features.map(f => f.properties.type))];

  // Filter shelters based on search and type
  const filteredShelters = shelters.features.filter(shelter => {
    const matchesSearch = shelter.properties.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || shelter.properties.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getShelterIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'hospital': return '🏥';
      case 'school': return '🏫';
      case 'community center': return '🏢';
      case 'government building': return '🏛️';
      case 'sports complex': return '🏟️';
      case 'religious building': return '⛪';
      default: return '🏠';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'hospital': return '#e74c3c';
      case 'school': return '#3498db';
      case 'community center': return '#9b59b6';
      case 'government building': return '#34495e';
      case 'sports complex': return '#f39c12';
      case 'religious building': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const formatCoordinate = (coord, type) => {
    const formatted = parseFloat(coord).toFixed(6);
    return `${formatted}° ${type}`;
  };

  const getDirectionsUrl = (lat, lng) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const styles = {
    container: {
      maxWidth: '1400px',
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
    filtersSection: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      flex: '1',
      minWidth: '250px',
      padding: '0.75rem 1rem',
      border: '2px solid #e1e8ed',
      borderRadius: '10px',
      fontSize: '1rem',
      backgroundColor: '#f8f9fa'
    },
    typeSelect: {
      padding: '0.75rem 1rem',
      border: '2px solid #e1e8ed',
      borderRadius: '10px',
      fontSize: '1rem',
      backgroundColor: '#f8f9fa',
      cursor: 'pointer',
      minWidth: '150px'
    },
    resultsInfo: {
      textAlign: 'center',
      color: '#7f8c8d',
      marginBottom: '1.5rem',
      fontSize: '1rem'
    },
    sheltersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    shelterCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s',
      border: '1px solid #e1e8ed',
      position: 'relative',
      overflow: 'hidden'
    },
    shelterHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    },
    shelterIcon: {
      fontSize: '2rem',
      padding: '0.5rem',
      borderRadius: '50%',
      backgroundColor: '#f8f9fa'
    },
    shelterTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      margin: 0,
      flex: 1
    },
    typeBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    },
    infoSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    infoLabel: {
      fontSize: '0.875rem',
      color: '#7f8c8d',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    infoValue: {
      fontSize: '0.95rem',
      color: '#2c3e50',
      fontFamily: 'monospace'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem'
    },
    directionButton: {
      flex: 1,
      padding: '0.75rem',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      textAlign: 'center',
      transition: 'all 0.2s'
    },
    contactButton: {
      flex: 1,
      padding: '0.75rem',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      transition: 'all 0.2s'
    },
    noShelters: {
      textAlign: 'center',
      color: '#7f8c8d',
      fontSize: '1.2rem',
      padding: '3rem',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    decorativeElement: {
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      opacity: 0.1
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏥 Available Relief Shelters</h2>
        <p style={styles.subtitle}>
          Find nearby emergency shelters and safe locations during flood events
        </p>
      </div>

      <div style={styles.filtersSection}>
        <input
          type="text"
          placeholder="Search shelters by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={styles.typeSelect}
        >
          {shelterTypes.map(type => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Types' : type}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.resultsInfo}>
        Showing {filteredShelters.length} of {shelters.features.length} shelters
      </div>

      {filteredShelters.length === 0 ? (
        <div style={styles.noShelters}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div>No shelters found matching your criteria</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Try adjusting your search terms or filter options
          </div>
        </div>
      ) : (
        <div style={styles.sheltersGrid}>
          {filteredShelters.map((feature, idx) => (
            <div
              key={idx}
              style={styles.shelterCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div 
                style={{
                  ...styles.decorativeElement,
                  backgroundColor: getTypeColor(feature.properties.type)
                }}
              ></div>
              
              <div style={styles.shelterHeader}>
                <div style={styles.shelterIcon}>
                  {getShelterIcon(feature.properties.type)}
                </div>
                <h3 style={styles.shelterTitle}>
                  {feature.properties.name}
                </h3>
              </div>
              
              <div 
                style={{
                  ...styles.typeBadge,
                  backgroundColor: getTypeColor(feature.properties.type)
                }}
              >
                {feature.properties.type}
              </div>

              <div style={styles.infoSection}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Latitude</span>
                  <span style={styles.infoValue}>
                    {formatCoordinate(feature.geometry.coordinates[1], 'N')}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Longitude</span>
                  <span style={styles.infoValue}>
                    {formatCoordinate(feature.geometry.coordinates[0], 'E')}
                  </span>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <a
                  href={getDirectionsUrl(
                    feature.geometry.coordinates[1],
                    feature.geometry.coordinates[0]
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.directionButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2980b9';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3498db';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  🗺️ Get Directions
                </a>
                <button
                  style={styles.contactButton}
                  onClick={() => alert(`Contact information for ${feature.properties.name} would be displayed here.`)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#229954';
                    e.target.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#27ae60';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  📞 Contact Info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SheltersPage;