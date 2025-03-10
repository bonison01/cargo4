
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar';
import AuthForm from '@/components/ui/auth-form';
import PageTransition from '@/components/ui/page-transition';
import { useNavigate, useLocation } from 'react-router-dom';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';

  const handleLogin = (data: any) => {
    console.log('Login data:', data);
    // For demo purposes, set authentication status in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', data.email);
    
    // Navigate to the page they tried to visit or dashboard
    setTimeout(() => {
      navigate(from);
    }, 500);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Login - Mateng Shipping</title>
        <meta name="description" content="Log in to your Mateng account to manage your shipments and invoices." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <AuthForm type="login" onSubmit={handleLogin} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Login;
