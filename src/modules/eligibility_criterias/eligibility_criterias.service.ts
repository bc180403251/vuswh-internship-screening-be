import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateEligibilityCriteriaDto } from './dto/create-eligibility_criteria.dto';
import { UpdateEligibilityCriteriaDto } from './dto/update-eligibility_criteria.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
import { EntityManager, Repository } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import {
  BATCH_SERVICE,
  DEGREE_SERVICE,
  SUBJECT_SERVICE,
} from 'src/common/constants';
import { DegreesService } from '../degrees/degrees.service';
import { SubjectsService } from '../subjects/subjects.service';
import { EligibilityCriteriaSubjects } from 'src/db/entities/eligibility_criteria_subjects.entity';
import { title } from 'process';
import { Subject } from 'src/db/entities/subject.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class EligibilityCriteriasService {
  constructor(
    @InjectRepository(EligibilityCriteria)
    private readonly _eligibility_criteriaRepository: Repository<EligibilityCriteria>,
    @InjectRepository(EligibilityCriteriaSubjects)
    private readonly _criteria_subjectsRepository: Repository<EligibilityCriteriaSubjects>,
    @Inject(BATCH_SERVICE)
    private readonly _BatchesService: BatchesService,
    // @InjectRepository(Degree)
    // private readonly _degreeRepository: Repository<Degree>,
    @Inject(DEGREE_SERVICE)
    private readonly _DegreesService: DegreesService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(SUBJECT_SERVICE)
    private readonly subjectsService: SubjectsService,
  ) {}

  async create(createEligibilityCriteriaDto: CreateEligibilityCriteriaDto) {
    try {
      const batchObj = await this._BatchesService.findOne(
        createEligibilityCriteriaDto.batch_id,
      );

      if (!batchObj) {
        throw new HttpException('batchObj Not Found', 404);
      }

      const degreeObj = await this._DegreesService.findOne(
        createEligibilityCriteriaDto.degreeId,
      );

      if (!degreeObj) {
        throw new HttpException('degreeObj Not Found', HttpStatus.NOT_FOUND);
      }

      await this.entityManager.transaction(async (manager) => {
        try {
          const parent = new EligibilityCriteria();

          parent.batch = batchObj;
          parent.degree = degreeObj;
          parent.include_grades = createEligibilityCriteriaDto.include_grades;
          parent.minimum_cgpa = createEligibilityCriteriaDto.minimum_cgpa;
          parent.project_enrollment =
            createEligibilityCriteriaDto.project_enrollment;

          const parentRecord = await manager.save(parent);

          for (const childobj of createEligibilityCriteriaDto.EligibilityCriteriaSubjects) {
            const subjectsobj = await this.subjectsService.findOne(childobj.id);

            if (!subjectsobj) {
              throw new HttpException('given subjects not found', 404);
            }

            const child = new EligibilityCriteriaSubjects();
            child.grade = childobj.grade;
            child.subjects = subjectsobj;
            child.eligibility_criteria = parentRecord;

            await manager.save(child);
          }
        } catch (error) {
          // Log the error for debugging
          if (error) {
            throw new HttpException(error.message, 404);
          }

          // Roll back the entire transaction in case of any error
          await manager.query('ROLLBACK');
          throw error;
        }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
      }
      console.error(error); // Log the main error for debugging
      throw error;
    }
  }

  findOne(id: string) {
    return this._eligibility_criteriaRepository.findOneBy({ id });
  }

  async getUpdate(id: string) {
    const record = await this._eligibility_criteriaRepository.findOne({
      where: { id },
      relations: [
        'degree',
        'eligibility_criteria_subjects',
        'eligibility_criteria_subjects.subjects',
      ],
    });
    if (!record) {
      throw new HttpException('Criteria Not found', 404);
    }

    return record;
  }

  async update(id: string, updateDto: UpdateEligibilityCriteriaDto) {
    const record = await this._eligibility_criteriaRepository.findOne({
      where: { id: id },
      relations: ['eligibility_criteria_subjects'],
    });

    if (!record) {
      throw new HttpException(
        'Eligibility criteria not found',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.entityManager.transaction(async (manager) => {
        record.minimum_cgpa = updateDto.minimum_cgpa;
        record.project_enrollment = updateDto.project_enrollment;
        record.include_grades = updateDto.include_grades;

        if (record) {
          if (record.eligibility_criteria_subjects.length > 0) {
            console.log('hey');
            const subjects = record.eligibility_criteria_subjects.map(
              (subjectobj) => subjectobj.id,
            );
            console.log(subjects);
            await this._criteria_subjectsRepository.delete(subjects);
          }
        }

        await manager.save(record);

        await Promise.all(
          updateDto.EligibilityCriteriaSubjects.map(async (subjectData) => {
            const subjectObj = await this.subjectsService.findById(
              subjectData.id,
            );

            if (!subjectObj) {
              throw new HttpException('Subjects not found', 404);
            }

            const subject = new EligibilityCriteriaSubjects();
            subject.subjects = subjectObj;
            subject.grade = subjectData.grade;
            subject.eligibility_criteria = record;

            await manager.save(subject);
          }),
        );
      });
    } catch (error) {
      if (error.code === 'Not_UPDATE') {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }
  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<EligibilityCriteria>> {
    const queryBuilder = this._eligibility_criteriaRepository
      .createQueryBuilder('eligibility_criterias')
      .leftJoinAndSelect('eligibility_criterias.degree', 'degree')
      .leftJoinAndSelect(
        'eligibility_criterias.eligibility_criteria_subjects',
        'eligibility_criteria_subjects',
      )
      .leftJoinAndSelect('eligibility_criteria_subjects.subjects', 'subjects')
      .leftJoinAndSelect('eligibility_criterias.batch', 'batch');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'eligibility_criterias.project_enrollment',
          pageOptionsDto.order,
        );
        break;
      case 'subject':
        queryBuilder.orderBy(
          'eligibility_criterias.project_enrollment',
          pageOptionsDto.order,
        );
        break;
      default:
        queryBuilder.orderBy(
          'eligibility_criterias.project_enrollment',
          pageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'eligibility_criterias.id',
      'eligibility_criterias.minimum_cgpa',
      'eligibility_criterias.project_enrollment',
      'eligibility_criterias.include_grades',
      'batch.id',
      'batch.name',
      'degree.id',
      'degree.title',
      'eligibility_criteria_subjects.id',
      'eligibility_criteria_subjects.grade',
      'subjects.id',
      'subjects.title',
    ]); // added selection
    if (pageOptionsDto.search) {
      queryBuilder.where(
        'eligibility_criterias.project_enrollment LIKE :keyword',
        {
          keyword: `%${pageOptionsDto.search}%`,
        },
      );
    }
    if (pageOptionsDto.search) {
      queryBuilder.orWhere('eligibility_criterias.minimum_cgpa LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      });
    }

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<EligibilityCriteria>(entities, pageMetaDto);
  }

  findAll() {
    return this._eligibility_criteriaRepository
      .createQueryBuilder('EligibilityCriteria')
      .leftJoinAndSelect('EligibilityCriteria.degree', 'degrees')
      .leftJoinAndSelect('EligibilityCriteria.batch', 'batches')
      .leftJoinAndSelect(
        'EligibilityCriteria.eligibility_criteria_subjects',
        'eligibility_criteria_subjects',
      )
      .getMany();
  }

  remove(id: string) {
    return `This action removes a #${id} eligibilityCriteria`;
  }

  async viewCriteria(id: string) {
    const criteria = await this._eligibility_criteriaRepository
      .createQueryBuilder('EligibilityCriteria')
      .leftJoinAndSelect('EligibilityCriteria.degree', 'degree')
      .leftJoinAndSelect('EligibilityCriteria.batch', 'batch')
      .leftJoinAndSelect(
        'EligibilityCriteria.eligibility_criteria_subjects',
        'eligibility_criteria_subjects',
      )
      .leftJoinAndSelect('eligibility_criteria_subjects.subjects', 'subjects')
      .select([
        'EligibilityCriteria.id',
        'EligibilityCriteria.minimum_cgpa',
        'EligibilityCriteria.project_enrollment',
        'EligibilityCriteria.include_grades',
        'degree.id',
        'degree.title',
        'batch.id',
        'batch.name',
        'eligibility_criteria_subjects.id',
        'eligibility_criteria_subjects.grade',
        'subjects.id',
        'subjects.code',
      ])
      .where('EligibilityCriteria.id =:Id', { Id: id })
      .getOne();

    if (!criteria) {
      throw new HttpException('Eligibility Criteria Not Found', 404);
    }

    return criteria;
  }

  async criteriasOfOpenBatch() {
    const criteria = await this._eligibility_criteriaRepository
      .createQueryBuilder('EligibilityCriteria')
      .leftJoinAndSelect('EligibilityCriteria.degree', 'degree')
      .leftJoinAndSelect('EligibilityCriteria.batch', 'batch')
      .leftJoinAndSelect(
        'EligibilityCriteria.eligibility_criteria_subjects',
        'eligibility_criteria_subjects',
      )
      .leftJoinAndSelect('eligibility_criteria_subjects.subjects', 'subjects')
      .select([
        'EligibilityCriteria.id',
        'EligibilityCriteria.minimum_cgpa',
        'EligibilityCriteria.project_enrollment',
        'EligibilityCriteria.include_grades',
        'degree.id',
        'degree.title',
        'batch.id',
        'batch.name',
        'batch.is_current',
        'batch.registration_status',
        'batch.registration_startdate',
        'batch.registration_enddate',
        'eligibility_criteria_subjects.id',
        'subjects.id',
        'subjects.code',
        'eligibility_criteria_subjects.grade',
      ])
      .where('batch.is_current =:value', { value: true })
      .andWhere('batch.registration_status =:status',{status:true})
      .getMany();

    // if (!criteria) {
    //   throw new HttpException('Eligibility Criteria Not Found', 404);
    // }

    return criteria;
  }
}
