
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NavigationLink, NavigationLinksMobile } from './navigation-links';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  isAuthenticated: boolean;
  userName: string;
  activePath: string;
  navLinks: NavigationLink[];
  adminLinks: NavigationLink[];
  isAdmin: boolean;
  handleLogout: () => Promise<void>;
}

const MobileMenu = ({
  isOpen,
  toggleMenu,
  isAuthenticated,
  userName,
  activePath,
  navLinks,
  adminLinks,
  isAdmin,
  handleLogout
}: MobileMenuProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
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
            
              <NavigationLinksMobile 
                links={isAuthenticated ? navLinks : navLinks.filter(link => !link.path.includes('/dashboard'))} 
                activePath={activePath} 
              />
              
              {isAdmin && (
                <NavigationLinksMobile 
                  links={adminLinks} 
                  activePath={activePath} 
                />
              )}
              
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  className="mt-4 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <span className="h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </span>
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
    </>
  );
};

export default MobileMenu;
