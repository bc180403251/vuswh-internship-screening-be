import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { degrees } from 'src/db/entities/degree.entity';
import { DEGREE_SERVICE } from 'src/common/constants';
import { EligibilityCriteriasModule } from '../eligibility_criterias/eligibility_criterias.module';
import { SubjectsModule } from '../subjects/subjects.module';

@Module({
  imports: [TypeOrmModule.forFeature([degrees]), SubjectsModule],
  controllers: [DegreesController],
  providers: [
    {
      provide: DEGREE_SERVICE,
      useClass: DegreesService,
    },
  ],
  exports: [DEGREE_SERVICE],
})
export class DegreesModule {}
