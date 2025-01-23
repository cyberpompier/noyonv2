import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import './ProfilePage.css';

function ProfilePage({ onSettingsClick, onVehiclesClick, onMaterialsClick }) {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [grade, setGrade] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginClick = () => {
    setIsLoginFormVisible(true);
    setIsRegisterFormVisible(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterFormVisible(true);
    setIsLoginFormVisible(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // Connexion avec Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Récupérer les informations du profil depuis Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          nom: userData.nom,
          prenom: userData.prenom,
          grade: userData.grade,
          profilePhotoURL: userData.profilePhotoURL,
        });
        setIsLoggedIn(true);
        setIsLoginFormVisible(false);
        setError('');
      } else {
        setError('Utilisateur non trouvé.');
      }
    } catch (error) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!nom || !prenom || !grade || !email || !password || !profilePhoto) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // Créer un utilisateur avec Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simuler l'upload de la photo de profil (URL temporaire)
      const profilePhotoURL = URL.createObjectURL(profilePhoto);

      // Enregistrer les informations du profil dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nom,
        prenom,
        grade,
        email,
        profilePhotoURL,
      });

      // Mettre à jour l'état de l'utilisateur
      setUser({ nom, prenom, grade, profilePhotoURL });
      setIsLoggedIn(true);
      setIsRegisterFormVisible(false);
      setError('');
    } catch (error) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        {isLoggedIn ? (
          <>
            <img src={user.profilePhotoURL} alt="Profile" className="profile-picture" />
            <div className="profile-info">
              <h2>{user.nom} {user.prenom}</h2>
              <p>{user.grade}</p>
            </div>
          </>
        ) : (
          <h2>Connexion</h2>
        )}
      </div>
      <ul className="profile-menu">
        {!isLoggedIn && (
          <>
            <li>
              <a href="#" className="clickable" onClick={handleLoginClick}>
                <span className="icon">🔑</span>
                <span>Connexion</span>
              </a>
            </li>
            <li>
              <a href="#" className="clickable" onClick={handleRegisterClick}>
                <span className="icon">📝</span>
                <span>S'inscrire</span>
              </a>
            </li>
          </>
        )}
        <li>
          <a href="#" className="clickable">
            <span className="icon">📋</span>
            <span>Inventaire</span>
          </a>
        </li>
        <li>
          <a href="#" className="clickable" onClick={onVehiclesClick}>
            <span className="icon">🚒</span>
            <span>Véhicules</span>
          </a>
        </li>
        <li>
          <a href="#" className="clickable" onClick={onMaterialsClick}>
            <span className="icon">🛠️</span>
            <span>Matériels</span>
          </a>
        </li>
        <li>
          <a href="#" className="clickable" onClick={onSettingsClick}>
            <span className="icon">⚙️</span>
            <span>Parametres</span>
          </a>
        </li>
      </ul>
      {isLoginFormVisible && (
        <div className="form-popup">
          <form onSubmit={handleLoginSubmit}>
            <h3>Connexion</h3>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Se connecter</button>
            <button type="button" onClick={() => setIsLoginFormVisible(false)}>Annuler</button>
          </form>
        </div>
      )}
      {isRegisterFormVisible && (
        <div className="form-popup">
          <form onSubmit={handleRegisterSubmit}>
            <h3>Inscription</h3>
            {error && <p className="error">{error}</p>}
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Sélectionnez un grade</option>
              <option value="SAP">SAP</option>
              <option value="CAP">CAP</option>
              <option value="CCH">CCH</option>
              <option value="SGT">SGT</option>
              <option value="SCH">SCH</option>
              <option value="ADJ">ADJ</option>
              <option value="ADC">ADC</option>
              <option value="LNT">LNT</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button type="submit">S'inscrire</button>
            <button type="button" onClick={() => setIsRegisterFormVisible(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
