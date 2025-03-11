
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import { Mail, Phone, Globe, Instagram, Facebook } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

const Contact = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Contact Us - Mateng</title>
        <meta name="description" content="Get in touch with Mateng shipping services" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

            <div className="glass-card p-8 rounded-xl">
              <div className="grid gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-mateng-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+918787649928" className="text-mateng-600 hover:text-mateng-700">
                      +91 8787649928
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-mateng-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:justmateng@gmail.com" className="text-mateng-600 hover:text-mateng-700">
                      justmateng@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-mateng-600" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a href="https://justmateng.com" target="_blank" rel="noopener noreferrer" className="text-mateng-600 hover:text-mateng-700">
                      justmateng.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-3">
                    <Instagram className="h-5 w-5 text-mateng-600" />
                    <Facebook className="h-5 w-5 text-mateng-600" />
                  </div>
                  <div>
                    <p className="font-medium">Social Media</p>
                    <a href="https://instagram.com/mateng.delivery" target="_blank" rel="noopener noreferrer" className="text-mateng-600 hover:text-mateng-700">
                      @mateng.delivery
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Contact;
