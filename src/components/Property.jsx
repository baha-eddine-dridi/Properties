import React, { useState, useEffect } from 'react';         // React et ses hooks

const Property = ({property, onReserve}) => {

  // État pour contrôler l'affichage du menu déroulant d'évaluation
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  
// Fonction pour gérer le clic sur le bouton d'évaluation
const handleRatingClick = () => {
  setShowRatingDropdown(!showRatingDropdown); // Inverse l'état d'affichage du menu
};
    
  return (
    <div className="container" style={{
      position: 'relative',  // Ajout de cette ligne
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px',
      width: '300px'
    }}>
      <h3>{property.title}</h3>
      <p>Adresse: {property.address}</p>
      <p>Prix: {property.price} DT</p>
      <p>Nombre de vues: {property.views}</p>
      <p>Disponible: {property.available ? 'Oui' : 'Non'}</p>



      {/* afficher bouton ken available true */}
      {property.available && (
       <button 
       onClick={() => {
         // D'abord incrémenter les vues
         onReserve(property.id);
         // Puis naviguer vers le formulaire de réservation avec l'ID de la propriété
         window.location.href = `/reserve?propertyId=${property.id}`;
       }}
     >
       Réserver la propriété
     </button>
     
      )}

          {/* Bouton d'évaluation */}
          <button 
        onClick={handleRatingClick}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Ajouter une évaluation
      </button>
      
       {/* Menu déroulant d'évaluation simplifié */}
        {/* Menu déroulant d'évaluation simplifié (version statique) */}
      {showRatingDropdown && (
        <div style={{
          position: 'absolute',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 10,
          left: '0',
          top: '100%',
          width: '100%'
        }}>
          <label htmlFor="rating">Note: </label>
          <select 
            id="rating"
            onChange={(e) => {
              alert(`Vous avez sélectionné la note: ${e.target.value}`);
              setShowRatingDropdown(false);
            }}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginLeft: '5px'
            }}
          >
            <option value="">-- Sélectionnez --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Property;