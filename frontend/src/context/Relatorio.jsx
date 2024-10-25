import { createContext, useContext } from 'react';

export const RelatorioContext = createContext();

export function useRelatorioContext() {
  return useContext(RelatorioContext);
}