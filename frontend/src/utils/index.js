/**
 * Utility functions used throughout the frontend
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes safely (handles conditional classes)
 * Usage: cn('base-class', condition && 'conditional-class', 'another-class')
 */
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

/**
 * Format a number as Indian Rupee currency
 * @param {number} amount
 * @param {boolean} compact - Use compact notation (₹1.5L vs ₹1,50,000)
 */
export const formatCurrency = (amount, compact = false) => {
  if (!amount && amount !== 0) return '—';

  if (compact && amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date to a readable string
 * @param {Date|string} date
 * @param {'short'|'long'|'relative'} format
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '—';
  const d = new Date(date);

  if (format === 'relative') {
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Truncate text to a maximum length
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Generate initials from a name (for avatar fallbacks)
 */
export const getInitials = name => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

/**
 * Capitalize the first letter of each word
 */
export const toTitleCase = str => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Convert snake_case or kebab-case to Title Case
 * e.g., 'baby_shower' → 'Baby Shower'
 */
export const formatEventType = type => {
  if (!type) return '';
  return type.split(/[_-]/).map(toTitleCase).join(' ');
};

/**
 * Extract error message from Axios error response
 */
export const getErrorMessage = error => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Sleep for a given number of milliseconds (useful in development)
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

