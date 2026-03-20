// Funções utilitárias do projeto

import { type ClassValue, clsx } from "clsx";

/**
 * Combina classes CSS de forma condicional
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
