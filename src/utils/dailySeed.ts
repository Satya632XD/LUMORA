/**
 * Utilities for Daily Challenge seed generation and date calculations.
 */

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyChallengeNumber(dateStr: string): number {
  const baseDate = new Date('2025-01-01').getTime();
  const targetDate = new Date(dateStr).getTime();
  const diffDays = Math.max(1, Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24)));
  return diffDays;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
