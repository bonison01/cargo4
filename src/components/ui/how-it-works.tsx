
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Package, TruckIcon, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: "Create Invoice",
    description: "Fill out the shipping details and generate a professional invoice",
    color: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: Package,
    title: "Package Pickup",
    description: "We collect your package from the specified location",
    color: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: TruckIcon,
    title: "In Transit",
    description: "Track your shipment in real-time as it travels to its destination",
    color: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    icon: CheckCircle,
    title: "Delivery",
    description: "Package is delivered safely to the recipient",
    color: "bg-green-50",
    iconColor: "text-green-600"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            Our streamlined process makes shipping between Imphal and Delhi simple and efficient
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card rounded-xl p-6 h-full flex flex-col items-center text-center">
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-5`}>
                  <step.icon className={`h-8 w-8 ${step.iconColor}`} />
                </div>
                
                <span className="absolute top-6 right-6 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-4 w-8 h-0.5 bg-muted z-10">
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-muted rotate-45"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
