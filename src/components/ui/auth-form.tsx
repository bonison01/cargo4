import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (type === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (type === 'login') {
        // Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        onSubmit({ ...data.user, email: formData.email });
      } else {
        // Supabase registration
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            }
          }
        });
        
        if (error) throw error;

        // Create a vendor entry for the new user
        if (data.user) {
          await supabase.from('vendors').insert({
            name: formData.name,
            user_id: data.user.id
          });
        }
        
        onSubmit({ ...data.user, email: formData.email, name: formData.name });
      }
      
      toast({
        title: type === 'login' ? "Logged in successfully" : "Account created successfully",
        description: type === 'login' 
          ? "Welcome back to Mateng!" 
          : "Your account has been created. Welcome to Mateng!",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-xl p-6 sm:p-8 max-w-md w-full mx-auto"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">
          {type === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-muted-foreground">
          {type === 'login' 
            ? 'Sign in to access your account' 
            : 'Join Mateng for seamless shipping'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-destructive text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={type === 'login' ? 'current-password' : 'new-password'}
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className="text-destructive text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" /> {errors.password}
            </p>
          )}
        </div>

        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {type === 'login' && (
          <div className="text-right">
            <a href="#" className="text-sm text-mateng-600 hover:text-mateng-700">
              Forgot password?
            </a>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-mateng-600 hover:bg-mateng-700 mt-2" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {type === 'login' ? 'Signing in...' : 'Creating account...'}
            </span>
          ) : (
            type === 'login' ? 'Sign In' : 'Create Account'
          )}
        </Button>

        <div className="mt-4 text-center text-sm">
          {type === 'login' ? (
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <a href="/register" className="text-mateng-600 hover:text-mateng-700 font-medium">
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <a href="/login" className="text-mateng-600 hover:text-mateng-700 font-medium">
                Sign in
              </a>
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AuthForm;
