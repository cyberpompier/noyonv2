
import React, { useState } from 'react';
import './VehiclesPage.css';

function VehiclesPage({ vehicles, onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleThumbnailClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePopup = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <h2>Véhicules</h2>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
      <ul>
        {vehicles.map((vehicle, index) => (
          <li key={index} className="vehicle-card">
            <img
              src={vehicle.photo || 'default-image-url.jpg'}
              alt={vehicle.denomination}
              className="vehicle-photo"
              onClick={() => handleThumbnailClick(vehicle.photo)}
            />
            <div className="vehicle-info">
              <h3>{vehicle.denomination}</h3>
              <p>Immatriculation: {vehicle.immatriculation}</p>
             