import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityCriteriasController } from './eligibility_criterias.controller';
import { EligibilityCriteriasService } from './eligibility_criterias.service';

describe('EligibilityCriteriasController', () => {
  let controller: EligibilityCriteriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EligibilityCriteriasController],
      providers: [EligibilityCriteriasService],
    }).compile();

    controller = module.get<EligibilityCriteriasController>(EligibilityCriteriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
