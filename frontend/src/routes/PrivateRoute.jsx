import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Suspense from '../components/Suspense';
import { useAuth } from '../providers/AuthProvider';

export default function PrivateRoute() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate('/entrar');
    }

    axios.interceptors.response.use((response) => response, (response) => {
      if (response.status === 401) {
        auth.logout();
        navigate('/entrar');
      }

      return Promise.reject(response);
    });
  }, []);


  return (
    <React.Fragment>
      <Suspense>
        <Outlet />
      </Suspense>
    </React.Fragment>
  );
}