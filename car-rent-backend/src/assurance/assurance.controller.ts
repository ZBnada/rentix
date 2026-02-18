import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssuranceService } from './assurance.service';

/**
 * Controller REST pour les opérations sur fichiers d'assurance
 */
@Controller('assurances')
export class AssuranceController {
  constructor(private readonly assuranceService: AssuranceService) {}

  /**
   * POST /assurances/:assuranceId/document
   * Upload document d'assurance
   */
  @Post(':assuranceId/document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('assuranceId') assuranceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return this.assuranceService.uploadAssuranceDocument(assuranceId, file);
  }

  /**
   * DELETE /assurances/:assuranceId/document
   * Supprimer document d'assurance
   */
  @Delete(':assuranceId/document')
  async deleteDocument(@Param('assuranceId') assuranceId: string) {
    return this.assuranceService.deleteAssuranceDocument(assuranceId);
  }
}
