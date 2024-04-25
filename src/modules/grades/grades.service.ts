import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from 'src/db/entities/grade.entity';
import { Repository } from 'typeorm';
// import { GRADE_SERVICE } from 'src/common/constants';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}
  create(createGradeDto: CreateGradeDto) {
    return 'This action adds a new grade';
  }

  async findAll() {
    return await this.gradeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  update(id: number, updateGradeDto: UpdateGradeDto) {
    return `This action updates a #${id} grade`;
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }
  lookup() {
    return this.gradeRepository.find({
      select: ['id', 'grade'],
    });
  }

  async findGradeByName(grade: string) {
    return await this.gradeRepository.findOneBy({ grade });
  }
}
