const API_URL = 'http://localhost:3000/api';

export const recipeService = {
    // Obtiene todas las recetas cargadas en el sistema
    async getAll() {
        const response = await fetch(`${API_URL}/recipes`);
        return await response.json();
    },

    // Obtiene solo las recetas que el usuario puede cocinar
    async getMatches(userId: string) {
        const response = await fetch(`${API_URL}/recipes/match/${userId}`);
        return await response.json();
    },

    async getById(id: string) {
        const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
        return await response.json();
    }
};