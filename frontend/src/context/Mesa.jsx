import { createContext, useContext } from 'react';

export const MesaContext = createContext();

export function useMesaContext() {
  return useContext(MesaContext);
}