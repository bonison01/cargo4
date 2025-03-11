
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/ui/navbar/navbar';
import { TruckIcon, PackageSearch, Ruler, Box } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';

const Services = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Services & Rates - Mateng</title>
        <meta name="description" content="Shipping rates and delivery services between Imphal and Delhi" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Shipping Rates & Services</h1>

            <div className="grid gap-8">
              {/* Rate Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Imphal to Delhi</h2>
                  <div className="space-y-3">
                    <p className="text-lg">
                      <span className="font-medium">Freight Charges:</span> ₹150/kg
                    </p>
                    <p className="text-lg">
                      <span className="font-medium">Docket Charges:</span> ₹80
                    </p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Delhi to Imphal</h2>
                  <div className="space-y-3">
                    <p className="text-lg">
                      <span className="font-medium">Freight Charges:</span> ₹150/kg
                    </p>
                    <p className="text-lg">
                      <span className="font-medium">Docket Charges:</span> ₹80
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Charges */}
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Additional Charges</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-mateng-600" />
                      <p>Pickup and Delivery Charges may apply</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Box className="h-5 w-5 text-mateng-600" />
                      <p>Packaging Charges may apply</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-mateng-600" />
                      <p>Dimension Charges may apply</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Locations */}
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Delivery Locations</h2>
                <div className="flex items-start gap-2">
                  <PackageSearch className="h-5 w-5 text-mateng-600 mt-1" />
                  <div>
                    <p className="font-medium">Last Mile Delivery available at:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Imphal</li>
                      <li>Delhi</li>
                    </ul>
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

export default Services;
