import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import Button from '@/components/common/Button';

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-primary-sm">
                <span className="font-serif font-black text-2xl">V</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Venue<span className="text-primary">Aura</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Discover, compare, and book verified event venues and top-tier vendors
              for weddings, birthdays, engagements, and corporate events across India.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/venues" className="hover:text-primary transition-colors">
                  All Venues
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="hover:text-primary transition-colors">
                  Event Vendors
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-primary transition-colors">
                  Compare Venues
                </Link>
              </li>
              <li>
                <Link to="/budget" className="hover:text-primary transition-colors">
                  Budget Planner
                </Link>
              </li>
              <li>
                <Link to="/venues?eventType=wedding" className="hover:text-primary transition-colors">
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link to="/venues?eventType=corporate" className="hover:text-primary transition-colors">
                  Corporate Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/register?role=vendor" className="hover:text-primary transition-colors">
                  List Your Venue / Service
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-white font-serif font-semibold text-base mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Bandra Kurla Complex, Mumbai, Maharashtra 400051</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 (022) 8000-AURA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>hello@venueaura.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} VenueAura Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-primary" /> Verified Venues & Certified Vendors
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

