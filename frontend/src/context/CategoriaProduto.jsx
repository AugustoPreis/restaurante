import { createContext, useContext } from 'react';

export const CategoriaProdutoContext = createContext();

export function useCategoriaProdutoContext() {
  return useContext(CategoriaProdutoContext);
}