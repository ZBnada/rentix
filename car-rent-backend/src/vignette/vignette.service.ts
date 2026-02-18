import { Injectable } from '@nestjs/common';
import { CreateVignetteInput } from './dto/create-vignette.input';
import { UpdateVignetteInput } from './dto/update-vignette.input';

@Injectable()
export class VignetteService {
  create(createVignetteInput: CreateVignetteInput) {
    return 'This action adds a new vignette';
  }

  findAll() {
    return `This action returns all vignette`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vignette`;
  }

  update(id: number, updateVignetteInput: UpdateVignetteInput) {
    return `This action updates a #${id} vignette`;
  }

  remove(id: number) {
    return `This action removes a #${id} vignette`;
  }
}
