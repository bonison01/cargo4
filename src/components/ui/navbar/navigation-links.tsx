
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export interface NavigationLink {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export interface NavigationLinksProps {
  links: NavigationLink[];
  activePath: string;
}

const NavigationLinks = ({ links, activePath }: NavigationLinksProps) => {
  return (
    <ul className="flex items-center gap-6">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            className={`text-sm font-medium relative transition-colors duration-200 hover:text-mateng-600 ${
              activePath === link.path
                ? 'text-mateng-600'
                : 'text-foreground/80'
            } ${link.icon ? 'flex items-center' : ''}`}
          >
            {link.icon && <span className="mr-1">{link.icon}</span>}
            {link.name}
            {activePath === link.path && (
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
  );
};

export const NavigationLinksMobile = ({ links, activePath }: NavigationLinksProps) => {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            className={`block py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activePath === link.path
                ? 'bg-mateng-50 text-mateng-600'
                : 'text-foreground/80 hover:bg-mateng-50'
            } ${link.icon ? 'flex items-center' : ''}`}
          >
            {link.icon && <span className="mr-2">{link.icon}</span>}
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavigationLinks;
