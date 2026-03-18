import React from 'react';
import { Bus, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
        <div className="absolute -top-24 left-12 h-72 w-72 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="absolute -bottom-20 right-16 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="relative border-b border-white/10 bg-gradient-to-r from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            Better commuting for Kenya, one ride at a time.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">NTSA Aligned</span>
            <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-amber-200">M-Pesa Enabled</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-700/40">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Matatu<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Kenya's smart mobility companion for safer bookings, transparent fares, and real-time route confidence.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-emerald-300 hover:border-emerald-400/50 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-emerald-300 hover:border-emerald-400/50 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-emerald-300 hover:border-emerald-400/50 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@matatuconnect.co.ke" className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-emerald-300 hover:border-emerald-400/50 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/occupancy" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Occupancy Tracking
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  M-Pesa Payments
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Driver Directory
                </Link>
              </li>
              <li>
                <Link to="/lost-and-found" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Lost and Found
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#about" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <a href="https://photos.google.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="mailto:support@matatuconnect.co.ke" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#how-it-works" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/driver/login" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Driver Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} MatatuConnect. All rights reserved.
            </div>
            <div className="flex gap-3 text-xs text-slate-400">
              <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Kenya Digital</span>
              <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Safety First</span>
              <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Cashless Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;