import { Test, TestingModule } from '@nestjs/testing';
import { PhaseHistoriesController } from './phase_histories.controller';
import { PhaseHistoriesService } from './phase_histories.service';

describe('PhaseHistoriesController', () => {
  let controller: PhaseHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhaseHistoriesController],
      providers: [PhaseHistoriesService],
    }).compile();

    controller = module.get<PhaseHistoriesController>(PhaseHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
