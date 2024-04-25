import { Test, TestingModule } from '@nestjs/testing';
import { StudentRegistrationsService } from './student_registrations.service';

describe('StudentRegistrationsService', () => {
  let service: StudentRegistrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentRegistrationsService],
    }).compile();

    service = module.get<StudentRegistrationsService>(StudentRegistrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
