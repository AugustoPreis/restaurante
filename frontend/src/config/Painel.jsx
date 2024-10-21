import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import Suspense from '../components/Suspense';

const Menu = lazy(() => import('./Menu'));

export default function Painel() {

  return (
    <React.Fragment>
      <Menu />
      <Suspense>
        <div style={{ padding: '40px 30px' }}>
          <Outlet />
        </div>
      </Suspense>
    </React.Fragment>
  );
}