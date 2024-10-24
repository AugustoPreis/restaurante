import { createContext, useContext } from 'react';

export const PedidoContext = createContext();

export function usePedidoContext() {
  return useContext(PedidoContext);
}