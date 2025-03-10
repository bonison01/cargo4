
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Helmet>
        <title>Admin Access Denied - Mateng Shipping</title>
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-8">You don't have permission to access this page.</p>
          <Button className="bg-mateng-600 hover:bg-mateng-700" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </main>
    </PageTransition>
  );
};

export default AccessDenied;
