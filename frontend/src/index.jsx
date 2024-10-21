import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import { IconContext } from 'react-icons';
import ptBR from 'antd/lib/locale/pt_BR';
import Suspense from './components/Suspense';
import AuthProvider from './providers/AuthProvider';

const AppRouter = lazy(() => import('./routes/AppRouter'));

const appRoot = createRoot(document.getElementById('root'));

appRoot.render(
  <Suspense>
    <ConfigProvider locale={ptBR}>
      <IntlProvider locale='pt'>
        <IconContext.Provider value={{
          className: 'anticon',
          style: { verticalAlign: 'middle', fontSize: 15 },
        }}>
          <Suspense>
            <BrowserRouter>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </BrowserRouter>
          </Suspense>
        </IconContext.Provider>
      </IntlProvider>
    </ConfigProvider>
  </Suspense>
);