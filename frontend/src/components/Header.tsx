import { Bus, Menu, X, Home as HomeIcon, MessageSquare, CreditCard, Users, MapPin, Shield, LogIn, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { useSaccoName } from '@/hooks/useSaccoName';

const navLinks = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/feedback', label: 'Complaint/Feedback', icon: MessageSquare },
   { to: '/occupancy', label: 'Occupancy', icon: MapPin }
    ,{ to: '/payment', label: 'Payments', icon: CreditCard },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/lost-and-found', label: 'Lost and Found', icon: Package },
];

const portalLinks = [
  { to: '/admin/login', label: 'Admin', icon: Shield },
  { to: '/driver/login', label: 'Driver Login', icon: LogIn },
];

const isActiveLink = (pathname: string, to: string) => {
  if (to === '/') return pathname === '/';
  return pathname.startsWith(to);
};

// Inline top-left menu button component
function MenuButton({ pathname }: { pathname: string }) {
  const [navOpen, setNavOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (navOpen && ref.current && !ref.current.contains(target) && btnRef.current && !btnRef.current.contains(target)) {
        setNavOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNavOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setNavOpen((v) => !v)}
        className="p-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 md:hidden"
        aria-expanded={navOpen}
        aria-controls="main-nav-menu"
        aria-haspopup="true"
        aria-label="Open navigation menu"
      >
        {navOpen ? <X className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /> : <Menu className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />}
      </button>

      {navOpen && (
        <div
          ref={ref}
          id="main-nav-menu"
          className="absolute right-0 top-full mt-2 w-[88vw] max-w-sm bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden md:hidden"
        >
          <nav className="flex flex-col py-2" aria-label="Primary">
            {navLinks.map((item) => {
              const active = isActiveLink(pathname, item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all group ${
                    active
                      ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'text-black dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                  onClick={() => setNavOpen(false)}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'} transition-colors`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-2 mx-4" />

            {portalLinks.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all group ${
                    active
                      ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'text-black dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300'
                  }`}
                  onClick={() => setNavOpen(false)}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'} transition-colors`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

const Header = () => {
  const location = useLocation();
  const { saccoName } = useSaccoName();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800">
      {/* Matatu stripe accent - Kenyan flag inspired colors */}
      <div className="h-1.5 flex">
        <div className="flex-1 bg-black"></div>
        <div className="flex-1 bg-red-600"></div>
        <div className="flex-1 bg-green-600"></div>
      </div>
      
      <div className="container relative flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="flex items-center gap-3 font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity shrink-0 group"
            aria-label={`${saccoName} Home`}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
              {saccoName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const active = isActiveLink(location.pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  active
                    ? 'font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40'
                    : 'font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>

          {portalLinks.map((item) => {
            const active = isActiveLink(location.pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  active
                    ? 'font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40'
                    : 'font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <MenuButton pathname={location.pathname} />
      </div>
    </header>
  );
};

export default Header;
