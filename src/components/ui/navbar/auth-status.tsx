
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

export interface AuthStatusProps {
  isAuthenticated: boolean;
  userName: string;
  isAdmin: boolean;
  handleLogout: () => Promise<void>;
}

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          const userData = session.user.user_metadata || {};
          setUserName(userData.name || userData.email || session.user.email || '');
          
          // Check if user is admin
          const userEmail = session.user.email || '';
          setIsAdmin(userEmail.endsWith('@mateng.com') || userEmail.includes('admin'));
        } else {
          setIsAuthenticated(false);
          setUserName('');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        const userData = session.user.user_metadata || {};
        setUserName(userData.name || userData.email || session.user.email || '');
        
        // Check if user is admin
        const userEmail = session.user.email || '';
        setIsAdmin(userEmail.endsWith('@mateng.com') || userEmail.includes('admin'));
      } else {
        setUserName('');
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error logging out",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isAuthenticated,
    isAdmin,
    userName,
    isLoading,
    handleLogout
  };
};

const AuthStatus = ({ isAuthenticated, userName, handleLogout }: AuthStatusProps) => {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Hello, {userName.split('@')[0]}
        </span>
        <Button 
          variant="ghost" 
          className="rounded-full p-2"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      <Link to="/login">
        <Button variant="ghost" size="sm">Log In</Button>
      </Link>
      <Link to="/register">
        <Button size="sm" className="bg-mateng-600 hover:bg-mateng-700">Sign Up</Button>
      </Link>
    </div>
  );
};

export default AuthStatus;
