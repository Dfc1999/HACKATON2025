import { useState, useCallback, useEffect, useRef } from 'react';

interface StorageItem<T> {
  data: T;
  expiresAt: number;
  encrypted: boolean;
}

interface UseSecureStorageReturn {
  storeTemporary: <T>(key: string, data: T, expirationMinutes?: number) => void;
  retrieve: <T>(key: string) => T | null;
  clear: (key: string) => void;
  clearExpired: () => void;
  clearAll: () => void;
  hasKey: (key: string) => boolean;
  getExpirationTime: (key: string) => number | null;
  getAllKeys: () => string[];
}

const useSecureStorage = (): UseSecureStorageReturn => {
  const [storageMap] = useState<Map<string, StorageItem<any>>>(new Map());
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const simpleEncrypt = useCallback((data: string): string => {
    const encoded = btoa(unescape(encodeURIComponent(data)));
    return encoded.split('').reverse().join('');
  }, []);

  const simpleDecrypt = useCallback((encrypted: string): string => {
    const reversed = encrypted.split('').reverse().join('');
    return decodeURIComponent(escape(atob(reversed)));
  }, []);

  const storeTemporary = useCallback(<T>(
    key: string,
    data: T,
    expirationMinutes: number = 20
  ): void => {
    try {
      const expiresAt = Date.now() + expirationMinutes * 60 * 1000;
      
      const serialized = JSON.stringify(data);
      const encrypted = simpleEncrypt(serialized);

      const item: StorageItem<string> = {
        data: encrypted,
        expiresAt,
        encrypted: true,
      };

      storageMap.set(key, item);
    } catch (error) {
      console.error('Error al almacenar datos:', error);
    }
  }, [storageMap, simpleEncrypt]);

  const retrieve = useCallback(<T>(key: string): T | null => {
    try {
      const item = storageMap.get(key);

      if (!item) {
        return null;
      }

      if (Date.now() > item.expiresAt) {
        storageMap.delete(key);
        return null;
      }

      if (item.encrypted) {
        const decrypted = simpleDecrypt(item.data);
        return JSON.parse(decrypted) as T;
      }

      return item.data as T;
    } catch (error) {
      console.error('Error al recuperar datos:', error);
      storageMap.delete(key);
      return null;
    }
  }, [storageMap, simpleDecrypt]);

  const clear = useCallback((key: string): void => {
    storageMap.delete(key);
  }, [storageMap]);

  const clearExpired = useCallback((): void => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    storageMap.forEach((item, key) => {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => storageMap.delete(key));
  }, [storageMap]);

  const clearAll = useCallback((): void => {
    storageMap.clear();
  }, [storageMap]);

  const hasKey = useCallback((key: string): boolean => {
    const item = storageMap.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiresAt) {
      storageMap.delete(key);
      return false;
    }

    return true;
  }, [storageMap]);

  const getExpirationTime = useCallback((key: string): number | null => {
    const item = storageMap.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      storageMap.delete(key);
      return null;
    }

    return item.expiresAt;
  }, [storageMap]);

  const getAllKeys = useCallback((): string[] => {
    const now = Date.now();
    const validKeys: string[] = [];

    storageMap.forEach((item, key) => {
      if (now <= item.expiresAt) {
        validKeys.push(key);
      }
    });

    return validKeys;
  }, [storageMap]);

  useEffect(() => {
    cleanupIntervalRef.current = setInterval(() => {
      clearExpired();
    }, 60000);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      clearAll();
    };
  }, [clearExpired, clearAll]);

  return {
    storeTemporary,
    retrieve,
    clear,
    clearExpired,
    clearAll,
    hasKey,
    getExpirationTime,
    getAllKeys,
  };
};

export default useSecureStorage;