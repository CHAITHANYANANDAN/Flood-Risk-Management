import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import floodZones from '../data/flood_zones.json';
import shelters from '../data/shelters.json';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView() {
  const [currentAlerts, setCurrentAlerts] = useState([]);
  const API_URL = 'http://localhost:5000';

  // Load alerts from API when component mounts
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await fetch(`${API_URL}/alerts`);
        const data = await response.json();
        setCurrentAlerts(data);
      } catch (error) {
        console.error('Error loading alerts:', error);
        // Fallback to sample data if API fails
        setCurrentAlerts([
          {
            id: 1,
            zone: "Alappuzha Flood Zone",
            severity: "High",
            message: "Heavy rainfall expected. Evacuation recommended.",
            time: new Date().toLocaleString()
          },
          {
            id: 2,
            zone: "Kuttanad Basin",
            severity: "Medium",
            message: "Water levels rising. Stay alert.",
            time: new Date().toLocaleString()
          }
        ]);
      }
    };

    loadAlerts();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Map severity to color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#ff0000';  // Red
      case 'Medium': return '#ff8c00'; // Orange
      case 'Low': return '#ffd700';    // Gold/Yellow
      default: return '#808080';       // Gray
    }
  };

  // Find if this zone has an alert
  const findAlertForZone = (zoneName) => {
    return currentAlerts.find((alert) => 
      alert.zone.trim().toLowerCase() === zoneName.trim().toLowerCase()
    );
  };

  // Style each zone based on alert severity
  const zoneStyle = (feature) => {
    const alert = findAlertForZone(feature.properties.zone);
    if (alert) {
      return {
        fillColor: getSeverityColor(alert.severity),
        color: 'black',
        weight: 2,
        fillOpacity: 0.7,
      };
    }
    return {
      fillColor: '#add8e6', // Light blue
      color: '#808080',     // Gray
      weight: 1,
      fillOpacity: 0.3,
    };
  };

  // Popup message for each zone
  const onEachZone = (feature, layer) => {
    const alert = findAlertForZone(feature.properties.zone);
    let popupText = `<b>${feature.properties.zone}</b>`;
    if (alert) {
      popupText += `<br/>⚠️ ${alert.severity} Alert<br/>${alert.message}`;
    } else {
      popupText += `<br/>No active alerts`;
    }
    layer.bindPopup(popupText);
  };

  return (
    <div>
      <h2>🗺️ Flood Risk Map</h2>
      
      {/* Legend */}
      <div style={{ 
        marginBottom: '1rem', 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
      }}>
        <strong>Alert Levels:</strong>
        <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ff0000', border: '1px solid black' }}></div>
            High Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ff8c00', border: '1px solid black' }}></div>
            Medium Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#ffd700', border: '1px solid black' }}></div>
            Low Risk
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#add8e6', border: '1px solid black' }}></div>
            No Alert
          </span>
        </div>
      </div>

      <MapContainer
        center={[10.85, 76.27]}
        zoom={9}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {/* Flood zones colored by alert */}
        <GeoJSON 
          data={floodZones} 
          style={zoneStyle} 
          onEachFeature={onEachZone}
          key={JSON.stringify(currentAlerts)} // Force re-render when alerts change
        />

        {/* Shelter markers */}
        {shelters.features.map((feature, idx) => (
          <Marker
            key={idx}
            position={[
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ]}
          >
            <Popup>
              <b>{feature.properties.name}</b><br />
              Type: {feature.properties.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Current Alerts Display */}
      <div style={{ marginTop: '1rem' }}>
        <h3>Current Alerts ({currentAlerts.length})</h3>
        {currentAlerts.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {currentAlerts.map((alert) => (
              <div 
                key={alert.id || alert.zone}
                style={{
                  padding: '10px',
                  border: `2px solid ${getSeverityColor(alert.severity)}`,
                  borderRadius: '5px',
                  backgroundColor: `${getSeverityColor(alert.severity)}20`
                }}
              >
                <strong>{alert.zone}</strong> - {alert.severity} Alert
                <br />
                {alert.message}
                <br />
                <small style={{ color: '#666' }}>
                  Status: {alert.acknowledged ? '✅ Acknowledged' : '⏳ Not Acknowledged'} | 
                  {alert.time}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p>No active alerts</p>
        )}
      </div>
    </div>
  );
}

export default MapView;