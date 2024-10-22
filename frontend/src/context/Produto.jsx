import { createContext, useContext } from 'react';

export const ProdutoContext = createContext();

export function useProdutoContext() {
  return useContext(ProdutoContext);
}