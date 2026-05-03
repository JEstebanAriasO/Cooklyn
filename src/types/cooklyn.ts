export interface Ingredient {
  id: string;
  name: string;
  category?: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  ingredientId: string;
  quantity: string;
  ingredient: Ingredient;
}