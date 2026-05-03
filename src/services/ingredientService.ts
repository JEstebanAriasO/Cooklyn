const API_URL = 'http://localhost:3000/api';

export const ingredientService = {
    async getAll() {
        const response = await fetch(`${API_URL}/ingredients`);
        return await response.json();
    },

    async create(name: string, category: string) {
        const response = await fetch(`${API_URL}/ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, category }),
        });
        return await response.json();
    }
};