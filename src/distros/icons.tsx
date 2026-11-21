import React from 'react';
import { DistroId } from '../types/distro';

interface LogoProps {
  id: DistroId;
  className?: string;
}

export const DistroLogo: React.FC<LogoProps> = ({ id, className = 'w-12 h-12' }) => {
  switch (id) {
    case 'ubuntu':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="30" fill="#E95420" />
          <circle cx="32" cy="32" r="14" stroke="white" strokeWidth="4.5" strokeDasharray="24 6" />
          <circle cx="46" cy="32" r="5" fill="white" stroke="#E95420" strokeWidth="2" />
          <circle cx="25" cy="19.8" r="5" fill="white" stroke="#E95420" strokeWidth="2" />
          <circle cx="25" cy="44.2" r="5" fill="white" stroke="#E95420" strokeWidth="2" />
        </svg>
      );

    case 'mint':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <path
            d="M12 10H40C51.0457 10 60 18.9543 60 30V38C60 49.0457 51.0457 58 40 58H24C12.9543 58 4 49.0457 4 38V18C4 13.5817 7.58172 10 12 10Z"
            fill="#87CF3E"
          />
          <path
            d="M16 18V36C16 43.732 22.268 50 30 50H40C46.6274 50 52 44.6274 52 38V30C52 24.4772 47.5228 20 42 20H37V37"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 37V28C27 25.2386 29.2386 23 32 23C34.7614 23 37 25.2386 37 28V37M37 28C37 25.2386 39.2386 23 42 23C44.7614 23 47 25.2386 47 28V37"
            stroke="white"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'kubuntu':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="30" fill="#0079C1" />
          <circle cx="32" cy="32" r="14.5" stroke="white" strokeWidth="4" />
          <path d="M32 10V21" stroke="#0079C1" strokeWidth="6" />
          <path d="M13 43L22.5 37.5" stroke="#0079C1" strokeWidth="6" />
          <path d="M51 43L41.5 37.5" stroke="#0079C1" strokeWidth="6" />
          <circle cx="32" cy="14" r="4" fill="white" />
          <circle cx="16.5" cy="41" r="4" fill="white" />
          <circle cx="47.5" cy="41" r="4" fill="white" />
          <circle cx="32" cy="32" r="6" fill="white" />
        </svg>
      );

    case 'kali':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <rect x="4" y="4" width="56" height="56" rx="16" fill="#0E1A2B" stroke="#367BF0" strokeWidth="2.5" />
          <path
            d="M15 22C24 18 35 19 44 25C39 24 34 25 31 28C38 28 45 31 50 37C43 34 36 34 31 37C36 39 40 43 42 48C35 43 26 41 18 42C24 38 27 33 24 28C21 25 18 24 15 22Z"
            fill="#367BF0"
          />
          <circle cx="34" cy="24" r="2" fill="#7DD3FC" />
        </svg>
      );

    case 'zorin':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="#15A6F0" />
          <path d="M17 22H47L39 30H17V22Z" fill="white" />
          <path d="M17 42H47V34H25L17 42Z" fill="white" />
          <path d="M25 34L39 30L47 22L39 34H25Z" fill="#BFE9FF" />
        </svg>
      );

    case 'elementary':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="29" fill="url(#elemGrad)" stroke="white" strokeWidth="2.5" />
          <defs>
            <linearGradient id="elemGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#64BAFF" />
              <stop offset="1" stopColor="#2A7DE1" />
            </linearGradient>
          </defs>
          <path
            d="M21 38C25 39 36 35 41 26C44 20 39 16 33 18C25 21 21 31 24 39C27 46 37 47 45 41"
            stroke="white"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'arch':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <rect x="4" y="4" width="56" height="56" rx="16" fill="#0F172A" stroke="#1793D1" strokeWidth="2" />
          <path
            d="M32 11C29.6 17 27.6 20.8 24.7 25.3C26.5 27.2 28.8 29.4 32.5 31.8C28.5 30.2 25.8 28.6 23.7 27C19.8 34.4 14.8 43.2 11 51C18.5 46.7 24.4 44.2 30 43.3C29.7 42.1 29.6 40.8 29.6 39.4C29.6 35.8 31.3 33.1 33.5 33.2C35.7 33.3 37.3 36.1 37.2 39.6C37.2 40.9 37 42.2 36.7 43.3C42.2 44.2 48.1 46.8 53 51C49 43.2 44.2 34.6 39.7 26.2C37.8 24.8 36 23.4 33.7 22.1C35.8 22.7 37.5 23.4 39 24.2C36.4 19.3 34.5 15.8 32 11Z"
            fill="#1793D1"
          />
        </svg>
      );
  }
};

export const InfoGuideIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#guideGrad)" />
    <defs>
      <linearGradient id="guideGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="20" r="4" fill="white" />
    <rect x="28.5" y="28" width="7" height="19" rx="3.5" fill="white" />
  </svg>
);
