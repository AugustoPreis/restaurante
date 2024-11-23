import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import Suspense from './components/Suspense';
import AuthProvider from './providers/AuthProvider';

const AppRouter = lazy(() => import('./routes/AppRouter'));

const appRoot = createRoot(document.getElementById('root'));

appRoot.render(
  <Suspense>
    <ConfigProvider locale={ptBR}>
      <Suspense>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </ConfigProvider>
  </Suspense>
);