import { Test, TestingModule } from '@nestjs/testing';
import { StudentRegistrationsController } from './student_registrations.controller';
import { StudentRegistrationsService } from './student_registrations.service';

describe('StudentRegistrationsController', () => {
  let controller: StudentRegistrationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentRegistrationsController],
      providers: [StudentRegistrationsService],
    }).compile();

    controller = module.get<StudentRegistrationsController>(StudentRegistrationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
