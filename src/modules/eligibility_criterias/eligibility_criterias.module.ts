import { Module } from '@nestjs/common';
import { EligibilityCriteriasService } from './eligibility_criterias.service';
import { EligibilityCriteriasController } from './eligibility_criterias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
// import { BatchesModule } from '../batches/batches.module';
import { DegreesModule } from '../degrees/degrees.module';
import { BatchesModule } from '../batches/batches.module';
import { ELIGIBILITYCRITERIA_SERVICE } from 'src/common/constants';
import { SubjectsModule } from '../subjects/subjects.module';
import { GradesModule } from '../grades/grades.module';
import { EligibilityCriteriaSubjects } from 'src/db/entities/eligibility_criteria_subjects.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EligibilityCriteria,
      EligibilityCriteriaSubjects,
    ]),
    BatchesModule,
    DegreesModule,
    GradesModule,
    SubjectsModule,
  ],
  controllers: [EligibilityCriteriasController],
  providers: [
    {
      provide: ELIGIBILITYCRITERIA_SERVICE,
      useClass: EligibilityCriteriasService,
    },
  ],
  exports: [ELIGIBILITYCRITERIA_SERVICE],
})
export class EligibilityCriteriasModule {}
