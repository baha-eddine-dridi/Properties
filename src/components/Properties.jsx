import Property from './Property'; // Importer le composant fils
import {getAllProperties, 
    createProperty, 
    updateProperty, 
    deleteProperty, 
    incrementPropertyViews} from './api.jsx'; // Importer les fonctions d'API
import React, { useEffect, useState } from 'react';

const Properties = () => {


//use state
const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const [minPrice, setMinPrice] = useState('');
const [maxPrice,setMaxPrice]= useState('');

const [title, setTitle] = useState('');
const [reservationMessage, setReservationMessage] = useState('');

// Fonction pour charger/recharger les propriétés

useEffect(() => {
    loadProperties();
  }, []);

const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des propriétés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaire pour les changements de champs de filtrage
  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handletitleChange = (e) =>{
    setTitle(e.target.value);
  };

   // Fonction de réservation
  const onReserve = async (idProp) => {
    try {
      // Incrémenter le nombre de vues de la propriété
      await incrementPropertyViews(idProp);
      setReservationMessage('Réservation réussie !');
      // mettre à jour l'état locale
      setProperties(properties.map(p => 
        p.id === idProp ? { ...p, views: p.views + 1 } : p
      ));

      window.location.href = '/reserve'; // Rediriger vers la page de réservation
    } catch (error) {
      setReservationMessage('Erreur lors de la réservation');
      console.error(error);
    }
  };

    // Filtrer les propriétés selon les critères de prix
    const filteredProperties = properties.filter(property => {
        // Si prix min est défini et que le prix de la propriété est inférieur, on exclut
        if (minPrice && property.price < parseInt(minPrice)) {
          return false;
        }
        // Si prix max est défini et que le prix de la propriété est supérieur, on exclut
        if (maxPrice && property.price > parseInt(maxPrice)) {
          return false;
        }
        // Sinon, on inclut la propriété
        return true;
      });
     
      // Filtrer les propriétés selon le titre
      const filterdTitle = properties.filter(property => {
        // Si le titre est défini et que le titre de la propriété ne correspond pas, on exclut
        if (title && !property.title.toLowerCase().includes(title.toLowerCase())) {
          return false;
        }
        // Sinon, on inclut la propriété
        return true;
      });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;


//getAllProperties
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>


      
<div>
              <label htmlFor="minPrice">Prix minimum: </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handletitleChange}
                placeholder="title"
                style={{ padding: '8px' }}
              />
            </div>

         {/* Filtre par prix */}
         <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
            <div>
              <label htmlFor="minPrice">Prix minimum: </label>
              <input
                type="number"
                id="minPrice"
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Min"
                style={{ padding: '8px' }}
              />
            </div>
            <div>
              <label htmlFor="maxPrice">Prix maximum: </label>
              <input
                type="number"
                id="maxPrice"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Max"
                style={{ padding: '8px' }}
              />
            </div>
          </div>

        {/* Affichage des propriétés */}
        {filterdTitle.map((property) => (
          <Property  //fils
            key={property.id}
            property={property}
            onReserve={onReserve} // Passer la fonction de réservation  lel fils
          
          />
        ))}
      </div>



  );
};

export default Properties;

