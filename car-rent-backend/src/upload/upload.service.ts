import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadedFileInfo {
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir =
      this.configService.get<string>('UPLOAD_DIR') || './uploads';
    this.baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';

    // Créer le dossier uploads s'il n'existe pas
    this.ensureUploadDirExists();
  }

  /**
   * Upload d'une image de profil utilisateur
   */
  async uploadProfileImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadedFileInfo> {
    // Validation du fichier
    this.validateImageFile(file);

    // Créer le dossier spécifique pour les profils
    const profileDir = path.join(this.uploadDir, 'users', 'profiles');
    this.ensureDirExists(profileDir);

    // Générer un nom unique pour le fichier
    const fileExtension = path.extname(file.originalname);
    const fileName = `${userId}-${uuidv4()}${fileExtension}`;
    const filePath = path.join(profileDir, fileName);

    // Sauvegarder le fichier
    await fs.promises.writeFile(filePath, file.buffer);

    // Construire l'URL relative
    const relativePath = `/uploads/users/profiles/${fileName}`;
    const fileUrl = `${this.baseUrl}${relativePath}`;

    return {
      fileName,
      filePath: relativePath,
      fileUrl,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  /**
   * ✨ NOUVEAU - Upload d'une image de véhicule
   */
  async uploadVehicleImage(
    file: Express.Multer.File,
    vehiculeId: string,
  ): Promise<UploadedFileInfo> {
    // Validation du fichier
    this.validateImageFile(file);

    // Créer le dossier spécifique pour les véhicules
    const vehicleDir = path.join(this.uploadDir, 'vehicles', 'images');
    this.ensureDirExists(vehicleDir);

    // Générer un nom unique pour le fichier
    const fileExtension = path.extname(file.originalname);
    const fileName = `${vehiculeId}-${uuidv4()}${fileExtension}`;
    const filePath = path.join(vehicleDir, fileName);

    // Sauvegarder le fichier
    await fs.promises.writeFile(filePath, file.buffer);

    // Construire l'URL relative
    const relativePath = `/uploads/vehicles/images/${fileName}`;
    const fileUrl = `${this.baseUrl}${relativePath}`;

    console.log('✅ Image véhicule uploadée:', {
      fileName,
      relativePath,
      fileUrl,
    });

    return {
      fileName,
      filePath: relativePath,
      fileUrl,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  /**
   * Supprimer une ancienne image de profil
   */
  async deleteProfileImage(imagePath: string): Promise<boolean> {
    if (!imagePath) return false;

    try {
      // Si c'est une URL complète, extraire le chemin relatif
      let relativePath = imagePath;
      if (imagePath.startsWith('http')) {
        const url = new URL(imagePath);
        relativePath = url.pathname;
      }

      // Construire le chemin complet du fichier
      const fullPath = path.join(process.cwd(), relativePath);

      // Vérifier si le fichier existe
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      return false;
    }
  }

  /**
   * ✨ NOUVEAU - Supprimer une image de véhicule
   */
  async deleteVehicleImage(imagePath: string): Promise<boolean> {
    if (!imagePath) return false;

    try {
      // Si c'est une URL complète, extraire le chemin relatif
      let relativePath = imagePath;
      if (imagePath.startsWith('http')) {
        const url = new URL(imagePath);
        relativePath = url.pathname;
      }

      // Construire le chemin complet du fichier
      const fullPath = path.join(process.cwd(), relativePath);

      console.log('🗑️ Suppression image véhicule:', fullPath);

      // Vérifier si le fichier existe
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log('✅ Image véhicule supprimée');
        return true;
      }

      console.log('⚠️ Fichier non trouvé');
      return false;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la suppression de l'image véhicule:",
        error,
      );
      return false;
    }
  }

  /**
   * Validation du fichier image
   */
  private validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Vérifier le type MIME
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif', // ← Ajouté GIF
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Format de fichier non autorisé. Utilisez JPG, PNG, WEBP ou GIF',
      );
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Fichier trop volumineux. Taille maximale : 5MB',
      );
    }

    // Vérifier les dimensions (optionnel - nécessite sharp)
    // const metadata = await sharp(file.buffer).metadata();
    // if (metadata.width > 2000 || metadata.height > 2000) {
    //   throw new BadRequestException('Image trop grande. Max 2000x2000px');
    // }
  }

  /**
   * Créer le dossier uploads s'il n'existe pas
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Créer aussi les sous-dossiers pour véhicules
    const vehicleDir = path.join(this.uploadDir, 'vehicles', 'images');
    this.ensureDirExists(vehicleDir);
  }

  /**
   * Créer un dossier s'il n'existe pas
   */
  private ensureDirExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Obtenir l'URL complète d'une image
   */
  getFullImageUrl(relativePath: string | null): string | null {
    if (!relativePath) return null;

    if (
      relativePath.startsWith('http://') ||
      relativePath.startsWith('https://')
    ) {
      return relativePath;
    }

    return `${this.baseUrl}${relativePath}`;
  }
}
