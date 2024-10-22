import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

const Painel = lazy(() => import('../config/Painel'));
const NotFound = lazy(() => import('../components/NotFound'));

const Login = lazy(() => import('../pages/login/Login'));
const Inicio = lazy(() => import('../pages/inicio/Inicio'));
const Mesa = lazy(() => import('../pages/mesa/Mesa'));
const CategoriaProduto = lazy(() => import('../pages/categoriaProduto/CategoriaProduto'));
const Usuario = lazy(() => import('../pages/usuario/Usuario'));


export default function AppRouter() {
  return (
    <Routes>
      <Route index
        element={<Login />} />
      <Route path='/entrar'
        element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path='painel'
          element={<Painel />}>
          <Route index
            element={<Inicio />} />
          <Route path='inicio'
            element={<Inicio />} />
          <Route path='mesas'
            element={<Mesa />} />
          <Route path='categoria-produto'
            element={<CategoriaProduto />} />
          <Route element={<AdminRoute />}>
            <Route path='usuarios'
              element={<Usuario />} />
          </Route>
        </Route>
      </Route>
      <Route path='*'
        element={<NotFound />} />
    </Routes>
  );
}