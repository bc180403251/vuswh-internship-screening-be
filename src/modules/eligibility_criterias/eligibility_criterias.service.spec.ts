import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityCriteriasService } from './eligibility_criterias.service';

describe('EligibilityCriteriasService', () => {
  let service: EligibilityCriteriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityCriteriasService],
    }).compile();

    service = module.get<EligibilityCriteriasService>(EligibilityCriteriasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
