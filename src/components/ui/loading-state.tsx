
import React from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/ui/navbar/navbar';
import PageTransition from '@/components/ui/page-transition';

const LoadingState = () => {
  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16">
        <div className="container px-4 mx-auto flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-mateng-600" />
        </div>
      </main>
    </PageTransition>
  );
};

export default LoadingState;
