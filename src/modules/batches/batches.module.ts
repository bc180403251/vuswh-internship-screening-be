import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from 'src/db/entities/batch.entity';
import { SemestersModule } from '../semesters/semesters.module';
import { EligibilityCriteriasModule } from '../eligibility_criterias/eligibility_criterias.module';
import { BATCH_SERVICE } from 'src/common/constants';
import { DegreesModule } from '../degrees/degrees.module';
import { TestWeightage } from 'src/db/entities/test_weightage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, TestWeightage]), SemestersModule],
  controllers: [BatchesController],
  providers: [
    {
      provide: BATCH_SERVICE,
      useClass: BatchesService,
    },
  ],
  exports: [BATCH_SERVICE],
})
export class BatchesModule {}
