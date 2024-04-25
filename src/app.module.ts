/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/entities/user.entity';
import { Role } from './db/entities/role.entity';
import { Permission } from './db/entities/permission.entity';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsService } from './modules/permissions/permissions.service';
import { Subject } from './db/entities/subject.entity';
import { Semester } from './db/entities/semester.entity';
import { BatchesModule } from './modules/batches/batches.module';
import { Batch } from './db/entities/batch.entity';
import { DegreesModule } from './modules/degrees/degrees.module';
import { StudentsModule } from './modules/students/students.module';
import { degrees } from './db/entities/degree.entity';
import { Student } from './db/entities/student.entity';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import * as dotenv from 'dotenv';
import { StudentRegistrationsModule } from './modules/student-registrations/student_registrations.module';
import { EligibilityCriteria } from './db/entities/eligibility_criteria.entity';
import { EligibilityCriteriasModule } from './modules/eligibility_criterias/eligibility_criterias.module';
import { CityModule } from './modules/city/city.module';
import { PhasesModule } from './modules/phases/phases.module';
import { PhaseHistoriesModule } from './modules/phase_histories/phase_histories.module';
import { GradesModule } from './modules/grades/grades.module';
import { EmailTemplateModule } from './modules/email.template/email.template.module';
import { dataSourceOption } from './db/data-source';

dotenv.config();
@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOption),
    RolesModule,
    PermissionsModule,
    UsersModule,
    EmailTemplateModule,
    AuthModule,
    BatchesModule,
    SubjectsModule,
    SemestersModule,
    StudentsModule,
    DegreesModule,
    StudentRegistrationsModule,
    EligibilityCriteriasModule,
    CityModule,
    PhasesModule,
    PhaseHistoriesModule,
    GradesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
