import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from 'src/db/entities/batch.entity';
import { Repository } from 'typeorm';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import {
  DEGREE_SERVICE,
  MAX_ACTIVE_BATCH,
  SEMESTER_SERVICE,
} from 'src/common/constants';
import { SemestersService } from '../semesters/semesters.service';
import { Request } from 'express';
import { DegreesService } from '../degrees/degrees.service';
import { degrees } from 'src/db/entities/degree.entity';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
import { TestWeightage } from 'src/db/entities/test_weightage.entity';
import { createTestWieghtagedto } from './dto/create-test-weightage.dto';

@Injectable()
export class BatchesService {
  constructor(
    @Inject(SEMESTER_SERVICE)
    private readonly _semestersservice: SemestersService,
    @InjectRepository(Batch)
    private readonly _batchRepository: Repository<Batch>,
    @InjectRepository(TestWeightage)
    private readonly _testweightageRepository: Repository<TestWeightage>,
  ) { }
  async create(createBatchDto: CreateBatchDto) {
    // console.log(CreateBatchDto);
    const semester_for_start_date_id = await this._semestersservice.findOne(
      createBatchDto.semester_for_start_date_id,
    );
    if (!semester_for_start_date_id) {
      throw new HttpException('startInSemester is not found', 404);
    }
    const semester_for_end_date_id = await this._semestersservice.findOne(
      createBatchDto.semester_for_end_date_id,
    );
    if (!semester_for_end_date_id) {
      throw new HttpException('endInSemester is not found', 404);
    }
    const start_date=new Date(createBatchDto.start_date)
    const end_date= new Date(createBatchDto.end_date)
    const batch = this._batchRepository.create({
      name: createBatchDto.name,
      start_date: start_date,
      end_date: end_date,
      startInSemester: semester_for_start_date_id,
      endInSemester: semester_for_end_date_id,
    });
    try {

      if(batch.start_date.getTime()>=batch.startInSemester.start_date.getTime()){
    
        if(batch.end_date.getTime()<=batch.endInSemester.end_date.getTime()
          ){
              return await this._batchRepository.save(batch);
          }else{
            
            throw new  HttpException(`EndDate of the batch must be smaller then endInSemester's endDate`,404)
          }
      }else{
        console.log(batch.start_date>=batch.startInSemester.start_date)
        throw new HttpException(`StartDate of the batch must be greater then StartInSemester's startDate`,404)
      }
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(error.sqlMessage, 404);
      }
      throw error;
    }
  }

  lookup() {
    return this._batchRepository.find({
      select: ['id', 'name'],
    });
  }

  async getAllPageData(
    batchpageOptionsDto: PageOptionsDto,
    req: Request,
  ): Promise<PageDto<Batch>> {
    const queryBuilder = this._batchRepository
      .createQueryBuilder('batch')
      .leftJoin('batch.startInSemester', 'startInSemester') // Join with startInSemester relation
      .leftJoin('batch.endInSemester', 'endInSemester'); // Join with endInSemester relation

    switch (batchpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('batch.name', batchpageOptionsDto.order);
        break;
      case 'name':
        queryBuilder.orderBy('batch.name', batchpageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('batch.name', batchpageOptionsDto.order);
        break;
    }
    queryBuilder.select([
      'batch.id',
      'batch.name',
      'batch.start_date',
      'batch.end_date',
      'batch.is_current',
      'startInSemester.name', // Include startInSemester columns as needed
      'endInSemester.name', // Include endInSemester columns as needed
    ]);

    if (req.query.search) {
      queryBuilder.andWhere(
        'batch.name LIKE :keyword OR startInSemester.name LIKE :keyword OR endInSemester.name LIKE :keyword',
        {
          keyword: `%${req.query.search}%`,
        },
      );
    }

    if (req.query.batch) {
      queryBuilder.andWhere('batch.is_current LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }

    if (batchpageOptionsDto.page !== 1) {
      batchpageOptionsDto.skip =
        (batchpageOptionsDto.page - 1) * batchpageOptionsDto.take;
    }

    queryBuilder.skip(batchpageOptionsDto.skip).take(batchpageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageOptionsDto: PageOptionsDto = batchpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Batch>(entities, pageMetaDto);
  }

  findAll() {
    const batchlist = this._batchRepository.find();
    return batchlist;
  }

  async findOne(id: string): Promise<Batch> {
    const batch = await this._batchRepository.findOneBy({ id });
    return batch;
  }

  async remove(Id: string) {
    const record = await this._batchRepository.findOne({
      where: {
        id: Id,
      },
    });
    if (!record) {
      throw new HttpException('Batch record not found!', 404);
    }

    const deletedRecords = await this._batchRepository.softRemove(record);
    return deletedRecords;
  }

  // Check if the batch is_current = true
  async findCurrentBatch(id: string): Promise<Batch | null> {
    const currentBatch = await this._batchRepository
      .createQueryBuilder('batch')
      .select(['batch.id', 'batch.name'])
      .where('batch.is_current = :isCurrent', { isCurrent: true })
      .andWhere('batch.registration_status=:value', { value: true })
      .andWhere('batch.id = :id', { id })
      .getOne();
    // console.log(currentBatch);
    return currentBatch || null;
  }

  async findOpenCurrentBatch(): Promise<Batch | null> {
    const currentBatch = await this._batchRepository
      .createQueryBuilder('batch')
      .select(['batch.id', 'batch.name'])
      .where('batch.is_current = :isCurrent', { isCurrent: true })
      .andWhere('batch.registration_status=:value', { value: true })
      .getOne();
    // console.log(currentBatch);
    return currentBatch || null;
  }

  async getBatchCriterias(id: string) {
    const batchCriteria = await this._batchRepository
      .createQueryBuilder('batch')
      .leftJoin('batch.eligibility_criteria', 'eligibility_criteria')
      .leftJoin('eligibility_criteria.degree', 'degree')
      .leftJoin(
        'eligibility_criteria.eligibility_criteria_subjects',
        'eligibility_criteria_subjects',
      )
      .leftJoin('eligibility_criteria_subjects.subjects', 'subjects')
      .addSelect([
        'eligibility_criteria.id',
        'eligibility_criteria.minimum_cgpa',
        'degree.id',
        'degree.title',
        'eligibility_criteria_subjects.grade',
        'subjects.code',
        'eligibility_criteria.project_enrollment',
      ]) // Select the 'name' property from EligibilityCriteria
      .where('batch.id = :batchId', { batchId: id }) // Replace with your specific condition
      .getOne();

    return batchCriteria;
  }

  async getEmailsThroughBatchId(id: string) {
    const emails = await this._batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.studentregistrations', 'studentregistrations')
      .leftJoinAndSelect('studentregistrations.phase', 'phase')
      .leftJoinAndSelect('studentregistrations.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .select([
        'batch.id',
        'studentregistrations.id',
        'student.id',
        'user.id',
        'user.email',
      ])
      .where('batch.id=:Id', { Id: id })
      .andWhere('batch.is_current=:value', { value: true })
      .andWhere('phase.name=:name', { name: 'shortlisted' })
      .getMany();
    // console.log(emails);
    return emails;
  }

  async findAllActivebatch() {
    const batches = await this._batchRepository.find({
      where: { is_current: true },
    });
    // for (const batch of batches) {
    //   const data = { batchID: batch.id, name: batch.name };

    //   return data
    // }
    return batches;
  }

  async activateAndDeactivate(id: string) {
    const batch = await this._batchRepository.findOne({ where: { id } });
    if (batch.is_current) {
      const batchDeactivate = this._batchRepository.update(
        { id },
        { is_current: false },
      );
      return {
        message: 'From batch list ' + batch.name + ' deactivate successfully!',
      };
    }

    const activebatches = await this.findAllActivebatch();

    if (activebatches.length >= MAX_ACTIVE_BATCH) {
      const activebatchesName = activebatches
        .map((activebatch) => activebatch.name)
        .join(',');
      throw new HttpException(
        `Two Batches ${activebatchesName} are already activated`,
        404,
      );
    } else {
      if (!batch.is_current) {
        const batchActivate = this._batchRepository.update(
          { id },
          { is_current: true },
        );
        return {
          message: 'From batch list ' + batch.name + ' activate successfully!',
        };
      }
    }
  }

  async getEmailsThroughBatch(id: string) {
    const emails = await this._batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.studentregistrations', 'studentregistrations')
      .leftJoinAndSelect('studentregistrations.phase', 'phase')
      .leftJoinAndSelect('studentregistrations.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .select([
        'batch.id',
        'studentregistrations.id',
        'student.id',
        'user.id',
        'user.email',
      ])
      .where('batch.id=:Id', { Id: id })
      .andWhere('batch.is_current=:value', { value: true })
      .andWhere('phase.name=:name', { name: 'Recommended' })
      .getMany();
    // console.log(emails);
    return emails;
  }

  async getUpdateBatchDetails(id: string) {
    const letastbatch = await this._batchRepository.find({
      where: { is_current: true },
      order: { start_date: 'DESC' },
    });

    if (letastbatch.length == 0) {
      throw new HttpException('Acitvate a batch First', 404);
    }

    let isEditable = false;
    const batch = await this._batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.eligibility_criteria', 'eligibility_criteria')
      .select([
        'batch.id',
        'batch.name',
        'batch.start_date',
        'batch.end_date',
        'batch.is_current',
        'batch.registration_status',

        'batch.registration_startdate',
        'batch.registration_enddate',
      ])
      .where('batch.id = :id', { id })
      // .andWhere('batch.is_current:=value', { value: true })
      .getOne();

    if (!batch) {
      throw new HttpException('batch not found', 404);
    }

    const batchcriteria = await this._batchRepository.findOne({
      where: { id },
      relations: ['eligibility_criteria', 'eligibility_criteria.degree']
    })
    if (letastbatch[0].id === batch.id) {
      if(batchcriteria.eligibility_criteria.length!==0){
      isEditable = true;
      }
    }
    if (!batch) {
      throw new HttpException('Batch not found!', 404);
    }
    return { batch, isEditable };
  }

  async update(id: string, updateBatchDto: UpdateBatchDto) {
    const activebatches = await this._batchRepository.find({
      where: { is_current: true },
      order: { start_date: 'DESC' },
    });

    const record = await this._batchRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new HttpException('Batch not found', 404);
    }

    const batchcriteria = await this._batchRepository.findOne({
      where: { id },
      relations: ['eligibility_criteria', 'eligibility_criteria.degree']
    })
    // console.log(batchcriteria.eligibility_criteria)/

    // if (batchcriteria.eligibility_criteria.length === 0) {
    //   throw new HttpException('batch eligibility criteria is not set', 404)
    // }

    if (activebatches[0].name === record.name) {
      if (batchcriteria.eligibility_criteria.length !== 0) {
        record.end_date = updateBatchDto.end_date;
        record.registration_status = updateBatchDto.registration_status;
        record.registration_startdate = updateBatchDto.registration_startdate;
        record.registration_enddate = updateBatchDto.registration_enddate;
      } else {
        throw new HttpException('First set the Eligibility criteria of this batch then you can cahnge the Registration status', 404)
      }

    } else if (activebatches[1].name === record.name) {
      // console.log('batch for edit just end date', record.name);
      record.end_date = updateBatchDto.end_date;
      // console.log('updated Record', record);
    }
    try {
      // Save the updated batch
      const updatedRecord = await this._batchRepository.save(record);
      // console.log('Updated Record:', updatedRecord);
      return updatedRecord;
    } catch (error) {
      // console.error('Error saving record:', error);
      throw new HttpException(error.message, 404); // Adjust the status code accordingly
    }
  }
  // ---------------------------------------------------------------------------------------
  // Create Test weightage Criteria for test result evaluation

  async getsetweightageCritera(id: string) {
    const batch = await this._batchRepository.findOne({
      where: { id },
      relations: ['test_weightage'],
    });

    if (!batch) {
      throw new HttpException('batch not found', 404);
    }
    // console.log(batch);
    if (batch.is_current === false) {
      throw new HttpException('Batch is not active', 404);
    } else {
      return batch;
    }
  }

  async entertestweightage(
    id: string,
    createtestweightageDto: createTestWieghtagedto,
  ) {
    // Get the current batch
    const batchId = await this.findCurrentBatch(id);

    if (!batchId) {
      throw new HttpException('Batch is not current', 404);
    }

    const testWeightageRecord = this._testweightageRepository.create({
      batch: batchId,
      test_total_marks: createtestweightageDto.test_total_marks,
      interview_total_marks: createtestweightageDto.interview_total_marks,
      test_weightage: createtestweightageDto.test_weightage,
      interview_weightage: createtestweightageDto.interview_weightage,
      total_marks: createtestweightageDto.total_marks,

      total_weightage: createtestweightageDto.total_weightage,
    });

    return await this._testweightageRepository.save(testWeightageRecord);
  }

  //view batch assessment

  async viewBatchAssessment(id: string) {
    const assessment = await this._batchRepository.findOne({
      where: { id },
      relations: ['test_weightage'],
    });
    if (!assessment) {
      throw new HttpException('batch Assessment Not found', 404);
    }
    if (assessment.assessments === null) {
      throw new HttpException('Batch Assessment is not defined', 404);
    }

    return assessment;
  }

  async activebatches() {
    const batchCount = await this._batchRepository
      .createQueryBuilder('batch')
      .where('batch.is_current=:value', { value: true })
      .getCount();
    const activeBatches = await this._batchRepository
      .createQueryBuilder('batch')
      .select(['batch.id', 'batch.name'])
      .where('batch.is_current=:value', { value: true })
      .getMany();

    return { activeBatches: activeBatches, activebatchCount: batchCount };
  }

  async getbatchCriteria() {
    const batch = await this._batchRepository
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.eligibility_criteria', 'eligibility_criteria')
      .leftJoinAndSelect('eligibility_criteria.degree', 'degree')
      .leftJoinAndSelect(
        'eligibility_criteria.eligibility_criteria_subjects',
        'eligibility_criteria_subjects',
      )
      .leftJoinAndSelect('eligibility_criteria_subjects.subjects', 'subjects')
      .select([
        'batch.id',
        'batch.name',
        'batch.is_current',
        'batch.registration_status',
        'eligibility_criteria.id',
        'eligibility_criteria.minimum_cgpa',
        'degree.id',
        'degree.title',
        'eligibility_criteria_subjects.grade',
        'subjects.id',
        'subjects.code',
        'eligibility_criteria.project_enrollment',
      ]) // Select the 'name' property from EligibilityCriteria
      .where('batch.is_current=:value', { value: true })
      .andWhere('batch.registration_status=:status', { status: true }) // Replace with your specific condition
      .getOne();

    // console.log(batch);
    return batch;
  }

  // async activebatchwithregistrations() {
  //   const batchwithregistration = await this._batchRepository
  //     .createQueryBuilder('batch')
  //     .leftJoinAndSelect('batch.studentregistrations', 'studentregistrations')
  //     .select([
  //       'batch.id',
  //       'batch.name',
  //       'studentregistrations.id',
  //       'studentregistrations.cgpa',
  //     ])
  //     .where('batch.is_current=:value', { value: true })
  //     .andWhere('batch.registration_status=:value', { value: false })
  //     .getMany();

  //   // const count =;

  //   return { batch: batchwithregistration, count: count };
  // }
}
