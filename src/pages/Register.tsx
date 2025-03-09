
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar';
import AuthForm from '@/components/ui/auth-form';
import PageTransition from '@/components/ui/page-transition';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (data: any) => {
    console.log('Registration data:', data);
    // For demo purposes, simulate successful registration
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
