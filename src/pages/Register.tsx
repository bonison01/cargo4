import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import AuthForm from '@/components/ui/auth-form';
import PageTransition from '@/components/ui/page-transition';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (userData: any) => {
    console.log('Registration success:', userData);
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Create Account - Mateng Shipping</title>
        <meta name="description" content="Create a Mateng account to start shipping between Imphal and Delhi with professional invoice management." />
      </Helmet>

      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <AuthForm type="register" onSubmit={handleRegister} />
        </div>
      </main>
    </PageTransition>
  );
};

export default Register;
