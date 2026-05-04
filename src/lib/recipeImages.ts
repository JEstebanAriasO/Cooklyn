const CURATED_RECIPE_IMAGES: Record<string, string> = {
  "arroz con huevo":
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  "pollo guisado con papa":
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1200&q=80",
  "lentejas estofadas":
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  "pasta en salsa de tomate":
    "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=1200&q=80",
  "tortilla de papa":
    "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=1200&q=80",
  "ensalada de atun":
    "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=1200&q=80",
  "sopa de verduras":
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
  "frijoles con arroz":
    "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1200&q=80",
  "batido de platano":
    "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=80",
};

export function recipePlaceholder(title: string): string {
  const safeTitle = (title || "Cooklyn").slice(0, 32);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8ac54f"/>
        <stop offset="100%" stop-color="#2e7d32"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)"/>
    <circle cx="960" cy="120" r="140" fill="rgba(255,255,255,0.12)"/>
    <circle cx="170" cy="690" r="180" fill="rgba(255,255,255,0.08)"/>
    <text x="600" y="360" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="62" font-weight="700">Cooklyn</text>
    <text x="600" y="440" text-anchor="middle" fill="#e9f8df" font-family="Arial, sans-serif" font-size="40">${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function resolveRecipeImage(recipe: { title?: string; imageUrl?: string } | null | undefined): string {
  if (recipe?.imageUrl && String(recipe.imageUrl).trim().length > 0) {
    return recipe.imageUrl;
  }
  const normalizedTitle = String(recipe?.title ?? "").trim().toLowerCase();
  if (normalizedTitle && CURATED_RECIPE_IMAGES[normalizedTitle]) {
    return CURATED_RECIPE_IMAGES[normalizedTitle];
  }
  return recipePlaceholder(String(recipe?.title ?? "Cooklyn"));
}
