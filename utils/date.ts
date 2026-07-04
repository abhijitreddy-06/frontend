import { Birthday, Countdown } from '../types';
import { MONTHS_SHORT } from '../constants';

export function calculateCountdown(birthday: Birthday): Countdown {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Create date for this year's birthday
  let nextBirthday = new Date(currentYear, birthday.month - 1, birthday.day);

  // If birthday has passed this year, use next year
  if (nextBirthday < now) {
    nextBirthday = new Date(currentYear + 1, birthday.month - 1, birthday.day);
  }

  const diff = nextBirthday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Calculate age if birth year is known
  let age: number | undefined;
  if (birthday.year) {
    age = nextBirthday.getFullYear() - birthday.year;
  }

  // Check if today or tomorrow
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birthdayDate = new Date(nextBirthday.getFullYear(), nextBirthday.getMonth(), nextBirthday.getDate());
  const daysDiff = Math.round((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    isToday: daysDiff === 0,
    isTomorrow: daysDiff === 1,
    age,
  };
}

export function formatDate(birthday: Birthday): string {
  const month = MONTHS_SHORT[birthday.month - 1];
  return birthday.year
    ? `${month} ${birthday.day}, ${birthday.year}`
    : `${month} ${birthday.day}`;
}

export function getDaysUntilBirthday(birthday: Birthday): number {
  const countdown = calculateCountdown(birthday);
  return countdown.days;
}

export function getAge(birthday: Birthday): number | null {
  if (!birthday.year) return null;
  const now = new Date();
  let age = now.getFullYear() - birthday.year;
  const hasPassed = new Date(now.getFullYear(), birthday.month - 1, birthday.day) < now;
  if (!hasPassed) age--;
  return age;
}

export function getUpcomingAge(birthday: Birthday): number | null {
  if (!birthday.year) return null;
  const now = new Date();
  let nextYear = now.getFullYear();
  const thisYearBirthday = new Date(now.getFullYear(), birthday.month - 1, birthday.day);
  if (thisYearBirthday < now) {
    nextYear++;
  }
  return nextYear - birthday.year;
}

export function sortBirthdaysByUpcoming(birthdays: Birthday[]): Birthday[] {
  return [...birthdays].sort((a, b) => {
    const daysA = getDaysUntilBirthday(a);
    const daysB = getDaysUntilBirthday(b);
    return daysA - daysB;
  });
}

export function isBirthdayToday(birthday: Birthday): boolean {
  const now = new Date();
  return now.getMonth() === birthday.month - 1 && now.getDate() === birthday.day;
}

export function getBirthdayMessage(birthday: Birthday): string {
  const countdown = calculateCountdown(birthday);
  if (countdown.isToday) {
    return `Happy Birthday${birthday.year ? `, turning ${countdown.age}` : ''}!`;
  }
  if (countdown.isTomorrow) {
    return `Tomorrow${countdown.age ? `, turning ${countdown.age}` : ''}!`;
  }
  return `${countdown.days} days${countdown.age ? `, turning ${countdown.age}` : ''}`;
}
