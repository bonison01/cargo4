
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import HeroSection from '@/components/ui/hero-section';
import FeatureCard from '@/components/ui/feature-card';
import HowItWorks from '@/components/ui/how-it-works';
import { FileText, TruckIcon, MapPin, Timer, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/page-transition';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: FileText,
    title: 'Professional Invoices',
    description: 'Generate professional invoices with auto-consignment numbers for every shipment.'
  },
  {
    icon: TruckIcon,
    title: 'Reliable Shipping',
    description: 'Dependable shipping service between Imphal and Delhi with safety guarantees.'
  },
  {
    icon: Timer,
    title: 'Real-time Tracking',
    description: 'Track your shipments in real-time with detailed status updates.'
  },
  {
    icon: MapPin,
    title: 'Extensive Coverage',
    description: 'Delivery across all areas in Imphal and Delhi with detailed area mapping.'
  },
  {
    icon: ArrowRightLeft,
    title: 'Two-way Services',
    description: 'Ship packages in both directions between Imphal and Delhi with ease.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Handling',
    description: 'Your packages are handled with care and delivered securely.'
  }
];

const Index = () => {
  return (
    <PageTransition>
      {/* <Helmet>
        <title>Mateng - Professional Shipping & Invoice Management</title>
        <meta name="description" content="Streamline your shipping process between Imphal and Delhi with professional invoice management and real-time tracking." />
      </Helmet> */}

      <Navbar />
      
      <main className="overflow-hidden">
        <HeroSection />
        
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Everything You Need for Seamless Shipping
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground"
              >
                Our comprehensive tools help you manage shipments efficiently
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
        
        <HowItWorks />
        
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-mateng-600/10 to-mateng-400/5 z-0"></div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8 md:p-12 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to Simplify Your Shipping?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Join Mateng today and experience hassle-free shipping between Imphal and Delhi with professional invoice management.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/services">
                  <Button size="lg" className="bg-mateng-600 hover:bg-mateng-700">
                    Get Started
                  </Button>
                </Link>
                <Link to="/track">
                  <Button size="lg" variant="outline">
                    Track a Shipment
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        <footer className="bg-background py-12 border-t border-border">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="h-6 w-6 text-mateng-600" />
                  <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-mateng-700 to-mateng-500">
                    Mateng
                  </span>
                </div>
                <p className="text-muted-foreground">Professional shipping services between Imphal and Delhi.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Shipping</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Invoice Management</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Tracking</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Delivery Areas</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Contact</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Careers</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">support@mateng.com</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-mateng-600">+91 123 456 7890</a></li>
                  <li className="flex gap-4 mt-4">
                    <a href="#" className="text-muted-foreground hover:text-mateng-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-mateng-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-mateng-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-mateng-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p className="mb-2">© 2024 Mateng Shipping. All rights reserved.</p>
              <p className="flex justify-center space-x-4">
                <Link to="/login" className="hover:text-mateng-600">User Login</Link>
                <Link to="/register" className="hover:text-mateng-600">User Register</Link>
                <Link to="/admin/dashboard" className="hover:text-mateng-600">Admin Portal</Link>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </PageTransition>
  );
};

export default Index;
