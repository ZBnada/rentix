// src/app/core/services/file-upload.service.ts

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export interface ImagePreview {
    file: File;
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    private readonly MAX_FILE_SIZE_MB = 5;
    private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;
    private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    private readonly ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

    /**
     * Valide un fichier image
     */
    validateImageFile(file: File): FileValidationResult {
        if (!file) {
            return {
                isValid: false,
                error: 'Aucun fichier sélectionné'
            };
        }

        if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return {
                isValid: false,
                error: `Type de fichier non autorisé. Formats acceptés: ${this.ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
            };
        }

        if (file.size > this.MAX_FILE_SIZE_BYTES) {
            return {
                isValid: false,
                error: `La taille du fichier dépasse ${this.MAX_FILE_SIZE_MB} MB. Taille actuelle: ${this.formatFileSize(file.size)}`
            };
        }

        const fileExtension = this.getFileExtension(file.name);
        if (!this.ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension)) {
            return {
                isValid: false,
                error: `Extension de fichier non autorisée. Extensions acceptées: ${this.ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Crée une prévisualisation d'image
     */
    createImagePreview(file: File): Observable<ImagePreview> {
        return from(this.processImagePreview(file));
    }

    /**
     * Formate la taille d'un fichier pour affichage
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Extrait l'extension d'un nom de fichier
     */
    getFileExtension(filename: string): string {
        return filename.substring(filename.lastIndexOf('.')).toLowerCase();
    }

    /**
     * Vérifie si un fichier est une image
     */
    isImageFile(file: File): boolean {
        return this.ALLOWED_IMAGE_TYPES.includes(file.type);
    }

    /**
     * Nettoie une URL d'objet (libère la mémoire)
     */
    revokeObjectUrl(url: string): void {
        if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Obtient l'URL complète d'une image
     * NOTE: Le backend (UserMapper) retourne déjà des URLs complètes
     * Cette méthode gère aussi les chemins relatifs en fallback
     */
    getFullImageUrl(imagePath: string | null | undefined, baseUrl: string = 'http://localhost:3000'): string | null {
        if (!imagePath) return null;

        // Si c'est déjà une URL complète, on la retourne directement
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // Sinon, on construit l'URL complète (fallback)
        return `${baseUrl}${imagePath}`;
    }

    // ============================================
    // MÉTHODES PRIVÉES
    // ============================================

    private async processImagePreview(file: File): Promise<ImagePreview> {
        const url = URL.createObjectURL(file);

        return {
            file,
            url
        };
    }
}