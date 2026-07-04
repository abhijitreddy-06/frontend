import { Birthday } from '../types';
import { generateId } from '../utils';

const BIRTHDAYS_STORAGE_KEY = '@birthdays';

// Mock data for development
const mockBirthdays: Birthday[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    date: '1990-03-15',
    month: 3,
    day: 15,
    year: 1990,
    notes: 'Best friend from college',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Michael Chen',
    date: '1985-07-22',
    month: 7,
    day: 22,
    year: 1985,
    notes: 'Work colleague',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    date: '1995-12-08',
    month: 12,
    day: 8,
    year: 1995,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'David Brown',
    date: '1988-01-30',
    month: 1,
    day: 30,
    year: 1988,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    date: '1992-05-05',
    month: 5,
    day: 5,
    year: 1992,
    notes: 'Sister',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '6',
    name: 'Alex Martinez',
    date: '1998-07-05',
    month: 7,
    day: 5,
    year: 1998,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

class BirthdayService {
  private birthdays: Birthday[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    // Start with mock data for development
    this.birthdays = [...mockBirthdays];
    this.initialized = true;
  }

  async getAll(): Promise<Birthday[]> {
    await this.initialize();
    return [...this.birthdays];
  }

  async getById(id: string): Promise<Birthday | null> {
    await this.initialize();
    return this.birthdays.find(b => b.id === id) || null;
  }

  async create(data: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>): Promise<Birthday> {
    await this.initialize();
    const now = new Date().toISOString();
    const birthday: Birthday = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.birthdays.push(birthday);
    return birthday;
  }

  async update(id: string, data: Partial<Omit<Birthday, 'id' | 'createdAt'>>): Promise<Birthday | null> {
    await this.initialize();
    const index = this.birthdays.findIndex(b => b.id === id);
    if (index === -1) return null;

    this.birthdays[index] = {
      ...this.birthdays[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.birthdays[index];
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const index = this.birthdays.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.birthdays.splice(index, 1);
    return true;
  }
}

export const birthdayService = new BirthdayService();
