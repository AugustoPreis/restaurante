import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Suspense from '../components/Suspense';
import { useAuth } from '../providers/AuthProvider';

export default function AdminRoute() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAdmin()) {
      navigate('/painel');
    }
  }, []);

  if (!auth.isAdmin()) {
    return null;
  }

  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}