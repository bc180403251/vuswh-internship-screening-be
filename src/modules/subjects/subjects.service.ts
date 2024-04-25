import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from 'src/db/entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
import { EligibilityCriteriasService } from '../eligibility_criterias/eligibility_criterias.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}
  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const subject = this.subjectRepository.create({
        code: createSubjectDto.code,
        title: createSubjectDto.title,
      });

      const savingrecord = await this.subjectRepository.save(subject);
      return savingrecord;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Deplicate Entry', 404);
      }
      throw error;
    }
  }

  findAll() {
    return this.subjectRepository.find();
  }
  async getSubjetsByIds(subjectsIDs: string[]) {
    return await this.subjectRepository.find({
      where: {
        id: In([...subjectsIDs]),
      },
    });
  }

  findById(id: string) {
    return this.subjectRepository.findOneBy({ id });
  }

  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Subject>> {
    const queryBuilder = this.subjectRepository.createQueryBuilder('subject');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('subject.code', pageOptionsDto.order);
        break;
      case 'code':
        queryBuilder.orderBy('subject.code', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('subject.code', pageOptionsDto.order);
        break;
    }
    queryBuilder.select(['subject.id', 'subject.code', 'subject.title']); // added selection
    queryBuilder
      .where('subject.id LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .orWhere('subject.title LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .andWhere('subject.deleted_at IS NULL');

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Subject>(entities, pageMetaDto);
  }

  lookup() {
    return this.subjectRepository.find({
      select: ['id', 'title'],
    });
  }
  async remove(id: string) {
    const record = await this.subjectRepository.findOne({ where: { id } });
    if (!record) {
      throw new HttpException('Record not found Unable to delete', 403);
    }
    const deleteRecord = this.subjectRepository.softRemove(record);
    return deleteRecord;
  }

  findOne(id: string) {
    const subject = this.subjectRepository.findOneBy({ id });
    if (!subject) {
      throw new HttpException('subject not found', 404);
    }
    return subject;
  }

  getupdate(id: string) {
    const subject = this.subjectRepository.findOneBy({ id });
    if (!subject) {
      throw new HttpException('subject not found', 404);
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.findOneBy({ id });
    if (subject) {
      subject.code = updateSubjectDto.code;
      subject.title = updateSubjectDto.title;
    } else {
      throw new HttpException('Subject not exist', 402);
    }
    return this.subjectRepository.save(subject);
  }
  async findSubjectBycode(code: string): Promise<Subject | null> {
    return await this.subjectRepository.findOneBy({ code });
  }
}
