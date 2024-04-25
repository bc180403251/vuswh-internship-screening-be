import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesController } from './phases.controller';
import { PHASE_SERVICE } from 'src/common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phases } from 'src/db/entities/phases.entity';
import { StudentRegistrationsModule } from '../student-registrations/student_registrations.module';

@Module({
  // imports: [TypeOrmModule.forFeature([Phases]), StudentRegistrationsModule],
  imports: [TypeOrmModule.forFeature([Phases])],
  controllers: [PhasesController],
  providers: [
    {
      provide: PHASE_SERVICE,
      useClass: PhasesService,
    },
  ],
  exports: [PHASE_SERVICE],
})
export class PhasesModule {}
