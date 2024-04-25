import { Module } from '@nestjs/common';
import { PhaseHistoriesService } from './phase_histories.service';
import { PhaseHistoriesController } from './phase_histories.controller';
import { PHASE_HISTORIES_SERVICE } from 'src/common/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhaseHistory } from 'src/db/entities/phase_history.entity';
import { StudentRegistrationsModule } from '../student-registrations/student_registrations.module';
import { PhasesModule } from '../phases/phases.module';
import { UsersModule } from '../users/users.module';

@Module({

  imports:[
    TypeOrmModule.forFeature([PhaseHistory]),
    StudentRegistrationsModule,
    PhasesModule,
    UsersModule,
  ],

  controllers: [PhaseHistoriesController],
  providers: [
   { provide: PHASE_HISTORIES_SERVICE,
    useClass: PhaseHistoriesService
   },
  ],
  exports: [PHASE_HISTORIES_SERVICE],
})
export class PhaseHistoriesModule {}
