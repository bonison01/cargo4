
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Search, FileText } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-24 md:pt-32 pb-16">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-mateng-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-mateng-50 text-mateng-700 mb-4 border border-mateng-100">
                Shipping Simplified
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              Ship with confidence between{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mateng-700 to-mateng-500">
                Imphal and Delhi
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              Streamline your shipping process with our professional invoice management and real-time tracking system. We take care of everything so you can focus on what matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/register">
                <Button size="lg" className="bg-mateng-600 hover:bg-mateng-700 text-white rounded-lg">
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="rounded-lg">
                  Track Shipment <Search size={16} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="glass-card rounded-2xl shadow-xl p-6 md:p-8 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-mateng-50 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-mateng-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Professional Invoice</h3>
                    <p className="text-sm text-muted-foreground">MT-2024050001</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-transit/10 text-status-transit">
                      In Transit
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between pb-4 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium">Imphal, Manipur</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-4">
                      <div className="w-full h-0.5 bg-muted relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-mateng-500 animate-pulse-soft"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">To</p>
                      <p className="font-medium">New Delhi, Delhi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Shipped Date</p>
                      <p className="font-medium">May 15, 2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                      <p className="font-medium">May 18, 2024</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Shipping Progress</h4>
                      <span className="text-sm text-mateng-600">60%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full mt-2">
                      <div className="h-full w-3/5 bg-mateng-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/3 -right-4 w-8 h-8 bg-mateng-100 rounded-full"></div>
              <div className="absolute bottom-1/4 -left-6 w-12 h-12 bg-mateng-200 rounded-full"></div>
              <div className="absolute -bottom-2 right-1/4 w-10 h-10 bg-blue-100 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
