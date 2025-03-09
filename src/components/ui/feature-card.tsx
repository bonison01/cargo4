
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="bg-mateng-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-mateng-100 transition-colors">
        <Icon className="h-6 w-6 text-mateng-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
