// Import des bibliothèques nécessaires
import axios from 'axios';                                  // Pour les requêtes HTTP
import React, { useState, useEffect } from 'react';         // React et ses hooks
import { useNavigate, useLocation } from 'react-router-dom'; // Pour la navigation et accès aux paramètres d'URL
import { getPropertyById } from './api';                    // Notre fonction pour récupérer les propriétés

const ReservationForm = () => {
    // ========== ÉTATS (STATES) ==========
    // États pour stocker les valeurs du formulaire
    const [name, setName] = useState('');                   // Nom du locataire
    const [phone, setPhone] = useState('');                 // Numéro de téléphone
    const [startDate, setStartDate] = useState('');         // Date de début de location
    const [endDate, setEndDate] = useState('');             // Date de fin de location
    
    // États pour stocker les données et l'état de la réservation
    const [property, setProperty] = useState(null);         // Détails de la propriété
    const [confirmationMessage, setConfirmationMessage] = useState(''); // Message de confirmation
    const [isReserved, setIsReserved] = useState(false);    // Indique si la réservation est faite
    
    // ========== HOOKS REACT ROUTER ==========
    const navigate = useNavigate();                         // Pour la navigation programmatique
    const location = useLocation();                         // Pour accéder à l'URL actuelle
    
    // Extraction de l'ID de la propriété depuis l'URL
    // Exemple: /reserve?propertyId=123 => propertyId sera égal à "123"
    const queryParams = new URLSearchParams(location.search);
    const propertyId = queryParams.get('propertyId');       // Récupère l'ID de la propriété depuis l'URL
    
    // ========== EFFET (EFFECT) ==========
    // Exécuté une fois au chargement du composant et à chaque fois que propertyId change
    useEffect(() => {
        // Fonction asynchrone pour récupérer les détails de la propriété
        const fetchProperty = async () => {
            if (propertyId) {
                try {
                    // Appel à l'API pour récupérer les détails de la propriété
                    const propertyData = await getPropertyById(propertyId);
                    setProperty(propertyData);              // Stocke les détails dans l'état
                } catch (error) {
                    console.error("Erreur lors de la récupération de la propriété:", error);
                    // Ici, on pourrait ajouter un état pour afficher un message d'erreur à l'utilisateur
                }
            }
        };
        
        fetchProperty();                                    // Appel de la fonction
    }, [propertyId]);                                       // Dépendances du useEffect
    
    // ========== GESTIONNAIRES D'ÉVÉNEMENTS (EVENT HANDLERS) ==========
    // Mise à jour de l'état du nom lorsque l'utilisateur tape dans le champ
    const handleNameChange = (e) => {
        setName(e.target.value);                            // Met à jour l'état avec la valeur saisie
    };
    
    // Mise à jour de l'état du numéro de téléphone
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);                           // Met à jour l'état avec la valeur saisie
    };
    
    // Mise à jour de l'état de la date de début
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);                       // Met à jour l'état avec la date sélectionnée
    };
    
    // Mise à jour de l'état de la date de fin
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);                         // Met à jour l'état avec la date sélectionnée
    };
    
    // ========== SOUMISSION DU FORMULAIRE ==========
    // Fonction appelée lors de la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();                                 // Empêche le comportement par défaut du formulaire (rechargement de la page)
        
        // Vérification que la propriété existe
        if (!property) {
            alert("Aucune propriété sélectionnée");
            return;                                         // Sort de la fonction si pas de propriété
        }
        
        // Préparation des données mises à jour pour la propriété
        // La propriété ne sera plus disponible après réservation
        const updatedProperty = {
            ...property,                                    // Copie toutes les propriétés existantes
            available: false,                               // Modifie la disponibilité
        };
        
        // Calcul de la durée de la réservation en jours
        const duration = Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        );
        
        // Calcul du prix total de la réservation
        const totalPrice = duration * property.price;       // Prix par jour * nombre de jours
        
        // Envoi de la requête PUT pour mettre à jour la propriété dans la base de données
        axios.put(`http://localhost:3001/properties/${property.id}`, updatedProperty)
        .then(response => {
            // Création du message de confirmation avec les détails de la réservation
            const message = `Mr/Mme ${name}, votre réservation pour la propriété "${property.title}" est confirmée pour un prix de ${totalPrice} DT.`;
            setConfirmationMessage(message);                // Affichage du message
            setIsReserved(true);                            // Marque la réservation comme complétée
            
            // Réinitialisation des champs du formulaire
            setName('');
            setPhone('');
            setStartDate('');
            setEndDate('');
            
            // Redirection vers la page d'accueil après 5 secondes
            setTimeout(() => {
                navigate('/');                              // Redirige vers la page d'accueil
            }, 5000);
        })
        .catch(error => {
            // Gestion des erreurs lors de la mise à jour
            console.error("Erreur lors de la mise à jour de la propriété:", error);
            alert("Une erreur s'est produite lors de la réservation");
        });
    };
    
    // ========== RENDU DU COMPOSANT (RENDER) ==========
    return (
        // Conteneur principal du formulaire avec styles CSS inline
        <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
            {/* Titre du formulaire */}
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Formulaire de Réservation</h2>
            
            {/* Message de confirmation - affiché uniquement après réservation réussie */}
            {confirmationMessage && (
                <div style={{
                    backgroundColor: '#4CAF50',            // Fond vert pour succès
                    color: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    {confirmationMessage}                
                </div>
            )}
            
            {/* Détails de la propriété - affichés uniquement si propriété chargée et pas encore réservée */}
            {property && !isReserved && (
                <div style={{ marginBottom: '20px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{property.title}</h3>
                    <p style={{ margin: '5px 0' }}>Adresse: {property.address}</p>
                    <p style={{ margin: '5px 0' }}>Prix: {property.price} DT/jour</p>
                </div>
            )}
            
            {/* Formulaire de réservation - affiché uniquement si pas encore réservé */}
            {!isReserved && (
                <form onSubmit={handleSubmit}>
                    {/* Champ pour le nom du locataire */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Nom du locataire:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}     // Appelle le gestionnaire lors de la modification
                            required                        // Champ obligatoire
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                    
                    {/* Champ pour le numéro de téléphone */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Numéro de téléphone:
                        </label>
                        <input
                            type="tel"                     // Type spécifique pour les numéros de téléphone
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={handlePhoneChange}   // Appelle le gestionnaire lors de la modification
                            required                       // Champ obligatoire
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                    
                    {/* Champ pour la date de début */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Date début location:
                        </label>
                        <input
                            type="date"                   // Input de type date avec calendrier
                            id="startDate"
                            name="startDate"
                            value={startDate}
                            onChange={handleStartDateChange} // Appelle le gestionnaire lors de la modification
                            required                       // Champ obligatoire
                            min={new Date().toISOString().split('T')[0]} // Date minimum = aujourd'hui
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                    
                    {/* Champ pour la date de fin */}
                    <div style={{ marginBottom: '25px' }}>
                        <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Date fin location:
                        </label>
                        <input
                            type="date"                   // Input de type date avec calendrier
                            id="endDate"
                            name="endDate"
                            value={endDate}
                            onChange={handleEndDateChange} // Appelle le gestionnaire lors de la modification
                            required                       // Champ obligatoire
                            min={startDate || new Date().toISOString().split('T')[0]} // Date minimum = date de début ou aujourd'hui
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                    
                    {/* Bouton de soumission du formulaire */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button 
                            type="submit"                 // Type submit pour déclencher la soumission du formulaire
                            disabled={!property}          // Désactivé si aucune propriété n'est chargée
                            style={{
                                backgroundColor: property ? '#4CAF50' : '#cccccc', // Vert si actif, gris si désactivé
                                color: 'white',
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: property ? 'pointer' : 'not-allowed', // Change le curseur selon l'état
                                fontSize: '16px'
                            }}
                        >
                            Valider la réservation
                        </button>
                    </div>
                </form>
            )}
            
            {/* Bouton de retour à la liste des propriétés */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                    onClick={() => navigate('/')}        // Fonction fléchée pour naviguer vers la page d'accueil
                    style={{
                        backgroundColor: '#f0f0f0',
                        color: '#333',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Retour à la liste des propriétés
                </button>
            </div>
        </div>
    );
};

export default ReservationForm;