export type MedicalRestriction =
  | "gluten"
  | "lactosa"
  | "frutos_secos"
  | "mariscos"
  | "huevo"
  | "soya"
  | "vegetariano"
  | "vegano"
  | "diabetes"
  | "hipertension";

export interface RestrictionInfo {
  id: MedicalRestriction;
  label: string;
  excludes: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  restrictions: MedicalRestriction[];
  customConditions: string[];
  cautionIngredients: string[];
}

export interface CooklynUser extends UserProfile {
  id: string;
}
