import { useState, useEffect, useCallback } from 'react';
import { Birthday } from '../types';
import { birthdayService } from '../services';
import { sortBirthdaysByUpcoming } from '../utils';

export function useBirthdays() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBirthdays = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await birthdayService.getAll();
      const sorted = sortBirthdaysByUpcoming(data);
      setBirthdays(sorted);
    } catch (err) {
      setError('Failed to load birthdays');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBirthdays();
  }, [loadBirthdays]);

  const addBirthday = async (data: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBirthday = await birthdayService.create(data);
    setBirthdays(prev => sortBirthdaysByUpcoming([...prev, newBirthday]));
    return newBirthday;
  };

  const updateBirthday = async (id: string, data: Partial<Omit<Birthday, 'id' | 'createdAt'>>) => {
    const updated = await birthdayService.update(id, data);
    if (updated) {
      setBirthdays(prev => sortBirthdaysByUpcoming(prev.map(b => b.id === id ? updated : b)));
    }
    return updated;
  };

  const deleteBirthday = async (id: string) => {
    const success = await birthdayService.delete(id);
    if (success) {
      setBirthdays(prev => prev.filter(b => b.id !== id));
    }
    return success;
  };

  const refresh = loadBirthdays;

  return {
    birthdays,
    isLoading,
    error,
    addBirthday,
    updateBirthday,
    deleteBirthday,
    refresh,
  };
}
