import { Module, forwardRef } from '@nestjs/common';
import { StudentRegistrationsService } from './student_registrations.service';
import { StudentRegistrationsController } from './student_registrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRegistration } from 'src/db/entities/student_registrations.entity';
import { StudentsModule } from '../students/students.module';
import { BatchesModule } from '../batches/batches.module';
import { UsersModule } from '../users/users.module';
import { STUDENT_REGISTRATION_SERVICE } from 'src/common/constants';
import { CityModule } from '../city/city.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { PhasesModule } from '../phases/phases.module';
import { student_subjects } from 'src/db/entities/Student_Subjects.entity';
import { PhaseHistoriesModule } from '../phase_histories/phase_histories.module';
import { GradesModule } from '../grades/grades.module';
import { TestWeightage } from 'src/db/entities/test_weightage.entity';
import { EmailTemplateModule } from '../email.template/email.template.module';
import { Assessment } from 'src/db/entities/assessment.entity';
import { FinalResults } from 'src/db/entities/final_results.entity';
import { DegreesModule } from '../degrees/degrees.module';
import { RolesModule } from '../roles/roles.module';
// import { Attendance } from 'src/db/entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentRegistration,
      student_subjects,

      Assessment,
      FinalResults,
    ]),
    forwardRef(() => StudentsModule),
    BatchesModule,
    UsersModule,
    CityModule,
    SubjectsModule,
    PhasesModule,
    GradesModule,
    EmailTemplateModule,
    DegreesModule,
    RolesModule,
  ],
  controllers: [StudentRegistrationsController],
  providers: [
    {
      provide: STUDENT_REGISTRATION_SERVICE,
      useClass: StudentRegistrationsService,
    },
  ],
  exports: [STUDENT_REGISTRATION_SERVICE],
})
export class StudentRegistrationsModule {}
