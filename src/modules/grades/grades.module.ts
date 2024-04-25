import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GRADE_SERVICE } from 'src/common/constants';
import { Grade } from 'src/db/entities/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grade])],
  controllers: [GradesController],
  providers: [
    {
      provide: GRADE_SERVICE,
      useClass: GradesService,
    },
  ],
  exports: [GRADE_SERVICE],
})
export class GradesModule {}
