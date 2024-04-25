import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/db/entities/student.entity';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import {
  BATCH_SERVICE,
  DEGREE_SERVICE,
  ELIGIBILITYCRITERIA_SERVICE,
  EMAILTEMPALTE_SERVICE,
  ROLE_SERVICE,
  STUDENT_REGISTRATION_SERVICE,
  USER_SERVICE,
  saltOrRounds,
} from 'src/common/constants';
import { UsersService } from '../users/users.service';
import { DegreesService } from '../degrees/degrees.service';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
// import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/db/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { EmailTemplateService } from '../email.template/email.template.service';
import { BatchesService } from '../batches/batches.service';
import { StudentRegistrationsService } from '../student-registrations/student_registrations.service';
import { EligibilityCriteriasService } from '../eligibility_criterias/eligibility_criterias.service';

@Injectable()
export class StudentsService {
  createQueryRunner() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @Inject(DEGREE_SERVICE)
    private readonly _degreeService: DegreesService,
    @InjectRepository(Student)
    private readonly _studentRepository: Repository<Student>,
    @Inject(USER_SERVICE)
    private readonly _userService: UsersService,
    @Inject(EMAILTEMPALTE_SERVICE)
    private readonly _emailTempService: EmailTemplateService,
    @Inject(BATCH_SERVICE)
    private readonly _batchService: BatchesService,
    @Inject(forwardRef(() => STUDENT_REGISTRATION_SERVICE))
    private readonly _registrationService: StudentRegistrationsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject(ELIGIBILITYCRITERIA_SERVICE)
    private readonly _eligibilityCriteriaService: EligibilityCriteriasService,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto, remoteIP: string) {
    console.log(remoteIP);
    const atindex = createStudentDto.email.indexOf('@');
    const username = createStudentDto.email.slice(0, atindex);
    const vuid = createStudentDto.email.slice(0, 11);

    // create resetpassword token
    let resetPassCode = bcrypt.genSaltSync(saltOrRounds);
    resetPassCode = resetPassCode.replaceAll('/', '-');

    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() + 24);

    // update login token

    // create user object and assign student role to it

    try {
      await this.entityManager.transaction(async (manager) => {
        const userObj = new User();
        userObj.username = username;
        userObj.fullname = createStudentDto.name;
        userObj.email = createStudentDto.email;
        userObj.phone = createStudentDto.phone;
        userObj.reset_pass_code = resetPassCode;
        userObj.reset_till = todayDate;
        // userObj.login_token=
        userObj.roles = [createStudentDto['role']];

        const user = await manager.save(userObj);

        // create student object and associate user with it
        const studentObj = new Student();
        studentObj.vuid = vuid;
        studentObj.user = user;
        studentObj.name = createStudentDto.name;
        studentObj.cnic = createStudentDto.cnic;
        studentObj.phone = createStudentDto.phone;
        studentObj.degree = createStudentDto['degree'];

        let student = await manager.save(studentObj);

        const tamplateDb = await this._emailTempService.findTemplateByname(
          'Confirmation',
        );
        const to = user.email;
        // const time = savingrecord.reset_till;
        const setNewPasswordlink = `${remoteIP}:3000/verify-password/${resetPassCode}`;
        let subject = tamplateDb.subject;
        let html = { useremail: to, resetPasswordLink: setNewPasswordlink };
        let template = tamplateDb.subject;
        await this._emailTempService.sendDynamicEmail(
          to,
          subject,
          html,
          template,
        );

        return { user, student };
      });
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  findAll() {
    return this._studentRepository.find();
  }

  findOne(id: string) {
    const record = this._studentRepository.findOneBy({ id });
    if (!record) {
      throw new HttpException('Record Not Found', 404);
    }
    return record;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this._studentRepository.findOneBy({ id });
    const degreeRecord = await this._degreeService.findOne(
      updateStudentDto.degreeId,
    );
    const userRecord = await this._userService.findOne(updateStudentDto.userId);
    if (student) {
      student.name = updateStudentDto.name;
      student.cnic = updateStudentDto.cnic;
      student.phone = updateStudentDto.phone;
      student.degree = degreeRecord;
      student.user = userRecord;
    } else {
      throw new HttpException('student not found', 405);
    }

    return this._studentRepository.save(student);
  }

  async remove(id: string) {
    const record = await this._studentRepository.findOne({ where: { id } });
    if (!record) {
      throw new HttpException('Unable to delete Student', 403);
    }

    return await this._studentRepository.softRemove(record);
  }

  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
  ): Promise<PageDto<Student>> {
    const queryBuilder = this._studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.degree', 'degree')
      .leftJoinAndSelect('student.user', 'user');

    if (pageOptionsDto.page !== 1) {
      pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    }

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('student.name', pageOptionsDto.order);
        break;
      case 'name':
        queryBuilder.orderBy('student.name', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('student.name', pageOptionsDto.order);
        break;
    }
    queryBuilder.select([
      'student.id',
      'student.name',
      'student.cnic',
      'student.vuid',
      'student.phone',
      'degree.id',
      'degree.title',
      'user.id',
      'user.email',
    ]); // added selection

    if (req.query.search) {
      queryBuilder.andWhere('student.name LIKE :name', {
        name: `%${req.query.search}%`,
      });
    }
    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Student>(entities, pageMetaDto);
  }

  lookup() {
    return this._studentRepository.find({
      select: ['id', 'name'],
    });
  }

  viewRegistrationHistory(id: string) {
    const quesryBuilder = this._studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.studentregistrations', 'studentregistrations')
      .leftJoinAndSelect('studentregistrations.batch', 'batch')
      .leftJoinAndSelect('studentregistrations.phaseHistory', 'phaseHistory')
      .leftJoinAndSelect('phaseHistory.processed_by', 'processed_by')
      .leftJoinAndSelect('phaseHistory.phases', 'phases')
      .where('student.id=:Id', { Id: id })
      .getOne();

    return quesryBuilder;
  }

  async studentDashboard(paylaod) {
    const activebatch = await this._batchService.activebatches();

    // const batchCriteria = await this._batchService.getbatchCriteria();

    const studentDegreeCriteria = await this.studentDegreCriteria(paylaod);

    const Registrations = await this._registrationService.getregistrationCount(
      paylaod,
    );

    const registationHistory = await this.studentRegistrationswithHistory(
      paylaod,
    );
    7;

    

    // console.log(batchCriteria);
    return {
      activebatch,
      Registrations,
      studentDegreeCriteria,
      registationHistory,
      
    };
  }

  // search the degree criteria in batch's all criterias

  async studentDegreCriteria(paylaod) {
    const studentDegree = await this._userService.getStudentDegree(paylaod.sub);

    if (!studentDegree) {
      throw new HttpException('student not found', 404);
    }

    const batchCriterias =
      await this._eligibilityCriteriaService.criteriasOfOpenBatch();

    for (let degreeCriteria of batchCriterias) {
      if (studentDegree.student.degree.title === degreeCriteria.degree.title) {
        // console.log('matched criteria :', degreeCriteria)

        return degreeCriteria;
      }
    }
    return { message: 'Your degree is not eligibile for this batch' };
  }

  //students registration histories

  async studentRegistrationswithHistory(paylaod: any) {
    const history = await this._studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.degree', 'degree')
      .leftJoinAndSelect('student.studentregistrations', 'studentregistrations')
      .leftJoinAndSelect('studentregistrations.batch', 'batch')
      .leftJoinAndSelect('studentregistrations.phaseHistory', 'phaseHistory')
      .leftJoinAndSelect('phaseHistory.processed_by', 'processed_by')
      .leftJoinAndSelect('phaseHistory.phases', 'phases')
      .select([
        'student.id',
        'user.id',
        'studentregistrations.id',
        'studentregistrations.cgpa',
        'student.name',
        'student.vuid',
        'degree.id',
        'degree.title',
        'batch.id',
        'batch.name',
        'phaseHistory.id',
        'phaseHistory.comments',
        'phaseHistory.processed_on',
        'phases.id',
        'phases.name',
        'processed_by.id',
        'processed_by.fullname',
      ])
      .where('user.id=:sub', { sub: paylaod.sub })
      .getOne();

    return history;
  }

  async getstudentDegree(paylaod){
    const degree= await this._studentRepository.createQueryBuilder('student') 
    .leftJoinAndSelect('student.user','studentuser')
    .leftJoinAndSelect('student.degree','degree')
    .where('studentuser.id =:id',{id:paylaod.sub})
    .getOne()

    return degree
  }
}
