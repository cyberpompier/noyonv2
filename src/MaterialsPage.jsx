import React, { useState } from 'react';
import './MaterialsPage.css';

function MaterialsPage({ materials, onClose }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [emplacementOptions, setEmplacementOptions] = useState([]);

  const handleThumbnailClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePopup = () => {
    setSelectedPhoto(null);
  };

  // Liste des emplacements en fonction du type de véhicule
  const getEmplacementOptions = (affection) => {
    const options = {
      FPT: ['Cabine', 'Canine AR', 'Coffre AVG', 'Coffre MG', 'Coffre ARG', 'Coffre AVD', 'Coffre MG', 'Coffre ARG', 'Rideau AR', 'Toit'],
      EPA: ['Cabine', 'Cellule', 'Plateforme', 'Coffre AVG', 'Coffre MG', 'Coffre ARG', 'Coffre AVD', 'Coffre MD', 'Coffre ARD'],
      VSAV: ['Cabine', 'Coffre G', 'Coffre D', 'Cellule', 'Cellule ARG', 'Cellule MG', 'Cellule AVG', 'Cellule ARD', 'Cellule MD', 'Cellule AVD', 'Tiroir VERT', 'Tiroir ROUGE', 'Tiroir ORANGE', 'Tiroir Blanc'],
      VSR: ['Cabine', 'Canine AR', 'Coffre AVG', 'Coffre MG', 'Coffre ARG', 'Coffre AVD', 'Coffre MG', 'Coffre ARG', 'Rideau'],
    };
    return options[affection] || [];
  };

  return (
    <div className="materials-page">
      <div className="materials-header">
        <h2>Matériels</h2>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
      <ul>
        {materials.map((material, index) => (
          <li key={index} className="material-card">
            <img
              src={material.photo || 'default-image-url.jpg'}
              alt={material.denomination}
              className="material-photo"
              onClick={() => handleThumbnailClick(material.photo)}
            />
            <div className="material-info">
              <h3>{material.denomination}</h3>
              <p>Quantité: {material.quantity}</p>
              <p>Affection: {material.affection}</p>
              <p>Emplacement: {material.emplacement}</p>
              <p>
                <a href={material.documentation} target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </p>
            </div>
          </li>
        ))}
      </ul>
      {selectedPhoto && (
        <div className="popup" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="popup-close" onClick={handleClosePopup}>✖</span>
            <img src={selectedPhoto} alt="Selected Material" className="popup-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialsPage;
