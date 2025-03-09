
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar';
import AuthForm from '@/components/ui/auth-form';
import PageTransition from '@/components/ui/page-transition';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (data: any) => {
    console.log('Login data:', data);
    // For demo purposes, simulate successful login
    setTimeout(() => {
      navigate('/dashboard');
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
