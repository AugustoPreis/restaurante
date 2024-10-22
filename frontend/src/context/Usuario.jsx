import { createContext, useContext } from 'react';

export const UsuarioContext = createContext();

export function useUsuarioContext() {
  return useContext(UsuarioContext);
}