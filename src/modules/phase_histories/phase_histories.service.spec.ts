import { Test, TestingModule } from '@nestjs/testing';
import { PhaseHistoriesService } from './phase_histories.service';

describe('PhaseHistoriesService', () => {
  let service: PhaseHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhaseHistoriesService],
    }).compile();

    service = module.get<PhaseHistoriesService>(PhaseHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
