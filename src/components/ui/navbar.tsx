
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Package, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check authentication status from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || ''
  );

  // Update authentication status when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      setUserName(localStorage.getItem('userName') || '');
    };
    
    window.addEventListener('storage', checkAuthStatus);
    checkAuthStatus();
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Check if user is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName('');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    navigate('/');
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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Package className="h-8 w-8 text-mateng-600" />
          <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-mateng-700 to-mateng-500">
            Mateng
          </span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
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
