
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateTripCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function calculateTotalExpenses(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
