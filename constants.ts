
import { Ingredient } from './types';

export const NS_RECIPE: Ingredient[] = [
  {
    id: 'yeast-extract',
    name: '酵母膏 (Yeast extract)',
    concentration: 0.5,
    unit: 'g/L',
    description: '有机营养来源'
  },
  {
    id: 'sodium-malate-succinate',
    name: '苹果酸钠 / 丁二酸钠',
    concentration: 5,
    unit: 'g/L',
    description: '主要碳源'
  },
  {
    id: 'ammonium-chloride',
    name: '氯化铵 (NH₄Cl)',
    chemicalFormula: 'NH₄Cl',
    concentration: 1,
    unit: 'g/L',
    description: '无机氮源'
  },
  {
    id: 'potassium-phosphate',
    name: '磷酸氢二钾 (K₂HPO₄)',
    chemicalFormula: 'K₂HPO₄',
    concentration: 1.0,
    unit: 'g/L',
    description: '缓冲剂及磷源'
  },
  {
    id: 'sodium-chloride',
    name: '氯化钠 (NaCl)',
    chemicalFormula: 'NaCl',
    concentration: 0.5,
    unit: 'g/L'
  },
  {
    id: 'magnesium-sulfate',
    name: '七水硫酸镁 (MgSO₄·7H₂O)',
    chemicalFormula: 'MgSO₄·7H₂O',
    concentration: 0.2,
    unit: 'g/L'
  },
  {
    id: 'calcium-chloride',
    name: '氯化钙 (CaCl₂)',
    chemicalFormula: 'CaCl₂',
    concentration: 0.02,
    unit: 'g/L'
  },
  {
    id: 'ferrous-sulfate',
    name: '七水硫酸亚铁 (FeSO₄·7H₂O)',
    chemicalFormula: 'FeSO₄·7H₂O',
    concentration: 0.01,
    unit: 'g/L'
  },
  {
    id: 'manganese-chloride',
    name: '四水氯化锰 (MnCl₂·4H₂O)',
    chemicalFormula: 'MnCl₂·4H₂O',
    concentration: 0.002,
    unit: 'g/L'
  },
  {
    id: 'sodium-molybdate',
    name: '二水钼酸钠 (NaMoO₄·2H₂O)',
    chemicalFormula: 'NaMoO₄·2H₂O',
    concentration: 0.001,
    unit: 'g/L'
  }
];
