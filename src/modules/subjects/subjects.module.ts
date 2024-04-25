import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from 'src/db/entities/subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SUBJECT_SERVICE } from 'src/common/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [SubjectsController],
  providers: [
    {
      provide: SUBJECT_SERVICE,
      useClass: SubjectsService
    }
  ],
  exports: [SUBJECT_SERVICE]
})
export class SubjectsModule {}
