import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './SettingsPage.css';

function SettingsPage({ onBackClick, onAddVehicle, onAddMaterial }) {
  const [type, setType] = useState('Véhicule');
  const [denomination, setDenomination] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [vehicleType, setVehicleType] = useState('INCENDIE');
  const [documentation, setDocumentation] = useState('');
  const [photo, setPhoto] = useState('');
  const [quantity, setQuantity] = useState('');
  const [affection, setAffection] = useState('');
  const [emplacement, setEmplacement] = useState('');
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState([]);

  // Récupérer la liste des véhicules depuis Firestore
  useEffect(() => {
    const fetchVehicles = async () => {
      const querySnapshot = await getDocs(collection(db, 'vehicles'));
      setVehicles(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchVehicles();
  }, []);

  // Déterminer le type de véhicule en fonction du début du nom
  const getVehicleType = (vehicleName) => {
    if (vehicleName.startsWith('VSAV')) return 'SANITAIRE';
    if (vehicleName.startsWith('FPT')) return 'INCENDIE';
    if (vehicleName.startsWith('VSR')) return 'VSR';
    if (vehicleName.startsWith('EPA')) return 'EPA';
    return '';
  };

  // Liste des emplacements en fonction du type de véhicule
  const getEmplacementOptions = (vehicleName) => {
    const vehicleType = getVehicleType(vehicleName);
    const options = {
      INCENDIE: ['Cabine', 'Canine AR', 'Coffre AVG', 'Coffre MG', 'Coffre ARG', 'Coffre AVD', 'Coffre MG', 'Coffre ARG', 'Rideau AR', 'Toit'],
      SANITAIRE: ['Cabine', 'Coffre G', 'Coffre D', 'Cellule', 'Cellule ARG', 'Cellule MG', 'Cellule AVG', 'Cellule ARD', 'Cellule MD', 'Cellule AVD', 'Tiroir VERT', 'Tiroir ROUGE', 'Tiroir ORANGE', 'Tiroir Blanc'],
      VSR: ['Cabine', 'Canine AR', 'Coffre AVG', 'Coffre MG', 'Coffre ARG', 'Coffre AVD', 'Coffre MG', 'Coffre ARG', 'Rideau'],
      EPA: ['Cabine', 'Cellule', 'Plateforme', 'Coffre AVG', 'Coffre MG', 'Coffre ARG', 'Coffre AVD', 'Coffre MD', 'Coffre ARD'],
    };
    return options[vehicleType] || [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type === 'Véhicule') {
      if (!denomination || !immatriculation || !vehicleType) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      onAddVehicle({ denomination, immatriculation, vehicleType, documentation, photo });
    } else if (type === 'Matériel') {
      if (!denomination || !quantity || !affection || !emplacement) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      onAddMaterial({ denomination, quantity, affection, emplacement, documentation, photo });
    }

    // Reset form
    setDenomination('');
    setImmatriculation('');
    setVehicleType('INCENDIE');
    setDocumentation('');
    setPhoto('');
    setQuantity('');
    setAffection('');
    setEmplacement('');
    setError('');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Ajouter un {type.toLowerCase()}</h2>
        <button className="back-button" onClick={onBackClick}>✖</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Véhicule</option>
            <option>Matériel</option>
          </select>
        </div>
        <div className="form-group">
          <label>Dénomination:</label>
          <input
            type="text"
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
          />
        </div>
        {type === 'Véhicule' && (
          <>
            <div className="form-group">
              <label>Immatriculation:</label>
              <input
                type="text"
                value={immatriculation}
                onChange={(e) => setImmatriculation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Type de véhicule:</label>
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option>INCENDIE</option>
                <option>SANITAIRE</option>
                <option>OPERATION DIV.</option>
              </select>
            </div>
          </>
        )}
        {type === 'Matériel' && (
          <>
            <div className="form-group">
              <label>Quantité:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Affection:</label>
              <select value={affection} onChange={(e) => setAffection(e.target.value)}>
                <option value="">Sélectionnez un véhicule</option>
                {vehicles.map((vehicle, index) => (
                  <option key={index} value={vehicle.denomination}>{vehicle.denomination}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Emplacement:</label>
              <select value={emplacement} onChange={(e) => setEmplacement(e.target.value)}>
                <option value="">Sélectionnez un emplacement</option>
                {getEmplacementOptions(affection).map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className="form-group">
          <label>Lien vers la documentation:</label>
          <input
            type="url"
            value={documentation}
            onChange={(e) => setDocumentation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Photo (URL):</label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default SettingsPage;
