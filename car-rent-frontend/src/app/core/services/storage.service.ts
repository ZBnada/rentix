import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    /**
     * Get item from localStorage
     */
    getItem(key: string): string | null {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('[StorageService] Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Set item in localStorage
     */
    setItem(key: string, value: string): void {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('[StorageService] Error writing to localStorage:', error);
        }
    }

    /**
     * Remove item from localStorage
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('[StorageService] Error removing from localStorage:', error);
        }
    }

    /**
     * Clear all localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('[StorageService] Error clearing localStorage:', error);
        }
    }

    /**
     * Get object from localStorage
     */
    getObject<T>(key: string): T | null {
        const item = this.getItem(key);
        if (!item) return null;

        try {
            return JSON.parse(item) as T;
        } catch (error) {
            console.error('[StorageService] Error parsing JSON from localStorage:', error);
            return null;
        }
    }

    /**
     * Set object in localStorage
     */
    setObject<T>(key: string, value: T): void {
        try {
            const jsonString = JSON.stringify(value);
            this.setItem(key, jsonString);
        } catch (error) {
            console.error('[StorageService] Error stringifying object for localStorage:', error);
        }
    }

    /**
     * Check if key exists
     */
    hasKey(key: string): boolean {
        return this.getItem(key) !== null;
    }

    /**
     * Get all keys
     */
    getAllKeys(): string[] {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.error('[StorageService] Error getting all keys:', error);
            return [];
        }
    }

    /**
     * Get storage size in bytes
     */
    getStorageSize(): number {
        try {
            let total = 0;
            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return total;
        } catch (error) {
            console.error('[StorageService] Error calculating storage size:', error);
            return 0;
        }
    }
}