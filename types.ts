
export interface Ingredient {
  id: string;
  name: string;
  chemicalFormula?: string;
  concentration: number;
  unit: 'g/L' | 'mL/L';
  description?: string;
}

export interface CalculationResult {
  ingredient: Ingredient;
  amount: number;
}
