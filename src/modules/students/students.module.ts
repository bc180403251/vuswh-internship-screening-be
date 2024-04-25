import { Module, forwardRef } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/db/entities/student.entity';
import { DegreesModule } from '../degrees/degrees.module';
import { UsersModule } from '../users/users.module';
import { STUDENT_SERVICE, USER_SERVICE } from 'src/common/constants';
import { StudentRegistration } from 'src/db/entities/student_registrations.entity';
import { User } from 'src/db/entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { EmailTemplateModule } from '../email.template/email.template.module';
import { BatchesModule } from '../batches/batches.module';
import { StudentRegistrationsModule } from '../student-registrations/student_registrations.module';
import { EligibilityCriteriasModule } from '../eligibility_criterias/eligibility_criterias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => StudentRegistrationsModule),
    DegreesModule,
    UsersModule,
    RolesModule,
    EmailTemplateModule,
    BatchesModule,
    EligibilityCriteriasModule
  ],
  controllers: [StudentsController],
  providers: [
    {
      provide: STUDENT_SERVICE,
      useClass: StudentsService,
    },
  ],
  exports: [STUDENT_SERVICE],
})
export class StudentsModule {}
