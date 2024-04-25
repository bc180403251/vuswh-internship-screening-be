import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { Semester } from 'src/db/entities/semester.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SEMESTER_SERVICE } from 'src/common/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Semester])],
  controllers: [SemestersController],
  providers: [
    {
      provide: SEMESTER_SERVICE,
      useClass: SemestersService,
    },
  ],
  exports: [SEMESTER_SERVICE],
})
export class SemestersModule {}
