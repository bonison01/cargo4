
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ShieldCheck } from 'lucide-react';
import AuthStatus, { useAuthStatus } from './auth-status';
import NavigationLinks, { NavigationLink } from './navigation-links';
import MobileMenu from './mobile-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const { isAuthenticated, isAdmin, userName, handleLogout } = useAuthStatus();

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

  const navLinks: NavigationLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Track Shipment', path: '/track' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const authenticatedLinks: NavigationLink[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'New Invoice', path: '/invoices/new' },
    { name: 'My Shipments', path: '/shipments' },
  ];
  
  const adminLinks: NavigationLink[] = [
    { 
      name: 'Admin', 
      path: '/admin/dashboard', 
      icon: <ShieldCheck className="h-4 w-4" /> 
    },
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
          <NavigationLinks 
            links={isAuthenticated ? authenticatedLinks : navLinks} 
            activePath={location.pathname} 
          />
          
          {isAdmin && (
            <NavigationLinks 
              links={adminLinks} 
              activePath={location.pathname.includes('/admin') ? '/admin/dashboard' : ''} 
            />
          )}
          
          <AuthStatus 
            isAuthenticated={isAuthenticated} 
            userName={userName} 
            isAdmin={isAdmin}
            handleLogout={handleLogout} 
          />
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isAuthenticated={isAuthenticated}
          userName={userName}
          activePath={location.pathname}
          navLinks={authenticatedLinks}
          adminLinks={adminLinks}
          isAdmin={isAdmin}
          handleLogout={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;
