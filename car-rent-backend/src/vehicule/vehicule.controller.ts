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
import { VehiculeService } from './vehicule.service';

@Controller('vehicules')
export class VehiculeController {
  constructor(private readonly vehiculeService: VehiculeService) {}

  /**
   * POST /vehicules/:vehiculeId/image
   * Upload image
   */
  @Post(':vehiculeId/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('vehiculeId') vehiculeId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return this.vehiculeService.uploadVehicleImage(vehiculeId, file);
  }

  /**
   * DELETE /vehicules/:vehiculeId/image
   * Supprimer image
   */
  @Delete(':vehiculeId/image')
  async deleteImage(@Param('vehiculeId') vehiculeId: string) {
    return this.vehiculeService.deleteVehicleImage(vehiculeId);
  }
}
