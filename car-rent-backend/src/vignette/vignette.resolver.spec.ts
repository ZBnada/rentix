import { Test, TestingModule } from '@nestjs/testing';
import { VignetteResolver } from './vignette.resolver';
import { VignetteService } from './vignette.service';

describe('VignetteResolver', () => {
  let resolver: VignetteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VignetteResolver, VignetteService],
    }).compile();

    resolver = module.get<VignetteResolver>(VignetteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
