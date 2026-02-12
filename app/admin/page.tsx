
'use client';
import React, { useState, useEffect } from 'react';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminLogin from '@/pages/AdminLogin';
import { api } from '@/services/api';

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(api.isAdmin());
  }, []);

  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />;
  return <AdminDashboard />;
}
