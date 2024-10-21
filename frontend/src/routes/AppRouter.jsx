import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const Painel = lazy(() => import('../config/Painel'));
const NotFound = lazy(() => import('../components/NotFound'));

const Login = lazy(() => import('../pages/login/Login'));
const Inicio = lazy(() => import('../pages/inicio/Inicio'));


export default function AppRouter() {
  return (
    <Routes>
      <Route index
        element={<Login />} />
      <Route path='/entrar'
        element={<Login />} />
      <Route element={<PrivateRoute to='/entrar' />}>
        <Route path='painel'
          element={<Painel />}>
          <Route index
            element={<Inicio />} />
          <Route path='inicio'
            element={<Inicio />} />
        </Route>
      </Route>
      <Route path='*'
        element={<NotFound />} />
    </Routes>
  );
}