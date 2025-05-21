
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Récupérer toutes les propriétés
export const getAllProperties = async () => {
  try {
    const response = await axios.get(`${API_URL}/properties`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    throw error;
  }
};

// Récupérer une propriété par ID
export const getPropertyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la propriété ${id}:`, error);
    throw error;
  }
};

// Créer une nouvelle propriété
export const createProperty = async (propertyData) => {
  try {
    const response = await axios.post(`${API_URL}/properties`, propertyData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la propriété:', error);
    throw error;
  }
};

// Mettre à jour une propriété
export const updateProperty = async (id, propertyData) => {
  try {
    const response = await axios.put(`${API_URL}/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la propriété ${id}:`, error);
    throw error;
  }
};

// Supprimer une propriété
export const deleteProperty = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la propriété ${id}:`, error);
    throw error;
  }
};

// Incrémenter le nombre de vues d'une propriété
export const incrementPropertyViews = async (id) => {
  try {
    // Récupérer d'abord la propriété
    const property = await getPropertyById(id);
    // Puis mettre à jour le nombre de vues
    const updatedProperty = { ...property, views: property.views + 1 };
    return await updateProperty(id, updatedProperty);
  } catch (error) {
    console.error(`Erreur lors de l'incrémentation des vues pour la propriété ${id}:`, error);
    throw error;
  }
};
