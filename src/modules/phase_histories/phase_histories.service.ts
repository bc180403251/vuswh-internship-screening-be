import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePhaseHistoryDto } from './dto/create-phase_history.dto';
import { UpdatePhaseHistoryDto } from './dto/update-phase_history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PhaseHistory } from 'src/db/entities/phase_history.entity';
import { Repository } from 'typeorm';
import {
  PHASE_SERVICE,
  STUDENT_REGISTRATION_SERVICE,
  USER_SERVICE,
} from 'src/common/constants';
import { StudentRegistrationsService } from '../student-registrations/student_registrations.service';
import { PhasesService } from '../phases/phases.service';
import { UsersService } from '../users/users.service';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Injectable()
export class PhaseHistoriesService {
  constructor(
    @InjectRepository(PhaseHistory)
    private readonly _phase_historyRepository: Repository<PhaseHistory>,
    @Inject(STUDENT_REGISTRATION_SERVICE)
    private readonly _studentRegistrationService: StudentRegistrationsService,
    @Inject(PHASE_SERVICE)
    private readonly _phaseService: PhasesService,
    @Inject(USER_SERVICE)
    private readonly _userService: UsersService,
  ) {}

  async create(createPhaseHistoryDto: CreatePhaseHistoryDto) {
    // console.log(createPhaseHistoryDto);

    // findStudentRegistrationId
    const studentRegistrationObj =
      await this._studentRegistrationService.findOne(
        createPhaseHistoryDto.studentRegistrationId,
      );

    // if  studentRegistrationObj not found throw exception
    if (!studentRegistrationObj) {
      throw new HttpException('studentRegistrationId Not Found', 404);
    }

    console.log(studentRegistrationObj);
    // return this._phase_historyRepository.save(studentRegistrationObj);

    // find phasesIdObj
    const phasesIdObj = await this._phaseService.findOne(
      createPhaseHistoryDto.phasesId,
    );
    console.log(phasesIdObj);

    // if phaseIdObj not found through exception
    if (!phasesIdObj) {
      throw new HttpException('phaseId not found', 405);
    }

    // find processedByIdObj
    const processedByIdObj = await this._userService.findOne(
      createPhaseHistoryDto.processedById,
    );
    console.log(processedByIdObj);

    // if processedByIdObj not found through exception
    if (!processedByIdObj) {
      throw new HttpException('processedById Obj not found', 406);
    }

    const phase_histories_record = this._phase_historyRepository.create({
      studentRegistration: studentRegistrationObj,
      phases: phasesIdObj,
      processed_by: processedByIdObj,
      // id:createPhaseHistoryDto.id,
      processed_on: createPhaseHistoryDto.processed_on,
      comments: createPhaseHistoryDto.comments,
    });

    return this._phase_historyRepository.save(phase_histories_record);
  }

  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PhaseHistory>> {
    const queryBuilder =
      this._phase_historyRepository.createQueryBuilder('PhaseHistory');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('PhaseHistory.processed_on', pageOptionsDto.order);
        break;
      case 'PhaseHistory':
        queryBuilder.orderBy('PhaseHistory.processed_on', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('PhaseHistory.processed_on', pageOptionsDto.order);
        break;
    }
    queryBuilder.select(['PhaseHistory.id', 'PhaseHistory.processed_on']); // added selection
    queryBuilder
      .where('PhaseHistory.id LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .orWhere('PhaseHistory.processed_on LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      });

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<PhaseHistory>(entities, pageMetaDto);
  }

  findAll() {
    return this._phase_historyRepository
      .createQueryBuilder('phaseHistory')
      .leftJoinAndSelect(
        'phaseHistory.studentRegistration',
        'student_registrations',
      )
      .leftJoinAndSelect('phaseHistory.phases', 'phases')
      .leftJoinAndSelect('phaseHistory.processed_by', 'users')
      .getMany();
  }

  findOne(id: string) {
    return this._phase_historyRepository
      .createQueryBuilder('phase_History')
      .leftJoinAndSelect(
        'phase_History.studentRegistration',
        'student_registrations',
      )
      .leftJoinAndSelect('phase_History.phases', 'phases')
      .leftJoinAndSelect('phase_History.processed_by', 'users')
      .select([
        'phase_History.id',
        'phase_History.comments',
        'phase_History.processed_on',
        'student_registrations.id',
        'phases.id',
        'users.id',
      ])
      .where('phase_History.id = :id', { id: id })
      .getOne();
  }

  async update(id: string, updatePhaseHistoryDto: UpdatePhaseHistoryDto) {
    const PhaseHistoryRecord = await this._phase_historyRepository.findOneBy({
      id,
    });

    const StudentRegistrationRecord =
      await this._studentRegistrationService.findOne(
        updatePhaseHistoryDto.studentRegistrationId,
      );
    const PhaseRecord = await this._phaseService.findOne(
      updatePhaseHistoryDto.phasesId,
    );
    const UserRecord = await this._userService.findOne(
      updatePhaseHistoryDto.processedById,
    );

    if (PhaseHistoryRecord) {
      // PhaseHistoryRecord.processed_on = updatePhaseHistoryDto.processed_on;
      PhaseHistoryRecord.comments = updatePhaseHistoryDto.comments;
      PhaseHistoryRecord.phases = PhaseRecord;
      PhaseHistoryRecord.studentRegistration = StudentRegistrationRecord;
      PhaseHistoryRecord.processed_by = UserRecord;
    } else {
      throw new HttpException('student not found', 404);
    }

    return this._phase_historyRepository.save(PhaseHistoryRecord);
  }

  async remove(Id: string) {
    const phase_histories = await this._phase_historyRepository.findOne({
      where: {
        id: Id,
      },
    });
    if (!phase_histories) {
      throw new HttpException('Unable to delete phase_history', 407);
    }
    const deletedPhaseHistory = await this._phase_historyRepository.softRemove(
      phase_histories,
    );

    return deletedPhaseHistory;
  }
}
