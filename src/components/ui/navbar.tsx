import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Package, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          const userData = session.user.user_metadata || {};
          setUserName(userData.name || userData.email || session.user.email || '');
        } else {
          setIsAuthenticated(false);
          setUserName('');
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
      } else {
        setUserName('');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Track Shipment', path: '/track' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const authenticatedLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'New Invoice', path: '/invoices/new' },
    { name: 'My Shipments', path: '/shipments' },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' 
      : 'py-5 bg-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Package className="h-8 w-8 text-mateng-600" />
          <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-mateng-700 to-mateng-500">
            Mateng
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {(isAuthenticated ? authenticatedLinks : navLinks).map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm font-medium relative transition-colors duration-200 hover:text-mateng-600 ${
                    location.pathname === link.path
                      ? 'text-mateng-600'
                      : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-mateng-500"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          {isAuthenticated ? (
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
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-mateng-600 hover:bg-mateng-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md"
          >
            <div className="container px-4 py-4 mx-auto flex flex-col">
              {isAuthenticated && (
                <div className="mb-4 pb-3 border-b border-border">
                  <p className="font-medium">{userName}</p>
                </div>
              )}
            
              <ul className="flex flex-col gap-3">
                {(isAuthenticated ? authenticatedLinks : navLinks).map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`block py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === link.path
                          ? 'bg-mateng-50 text-mateng-600'
                          : 'text-foreground/80 hover:bg-mateng-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  className="mt-4 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full bg-mateng-600 hover:bg-mateng-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
