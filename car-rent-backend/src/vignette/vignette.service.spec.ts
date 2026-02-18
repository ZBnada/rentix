import { Test, TestingModule } from '@nestjs/testing';
import { VignetteService } from './vignette.service';

describe('VignetteService', () => {
  let service: VignetteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VignetteService],
    }).compile();

    service = module.get<VignetteService>(VignetteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
