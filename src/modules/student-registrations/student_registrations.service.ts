import {
  Body,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Post,
  forwardRef,
} from '@nestjs/common';
import { CreateStudentRegistrationDto } from './dto/create_student_registration.dto';
import { UpdateStudentRegistrationDto } from './dto/update_student_registration.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Equal, In, Repository } from 'typeorm';
import {
  BATCH_SERVICE,
  CITY_SERVICE,
  EMAILTEMPALTE_SERVICE,
  // Grade,
  GRADE_SERVICE,
  PHASE_HISTORIES_SERVICE,
  PHASE_SERVICE,
  STUDENT_REGISTRATION_SERVICE,
  STUDENT_SERVICE,
  SUBJECT_SERVICE,
  USER_SERVICE,
} from 'src/common/constants';
import { StudentsService } from '../students/students.service';
import { BatchesService } from '../batches/batches.service';
import { CityService } from '../city/city.service';
import { UsersService } from '../users/users.service';
import { SubjectsService } from '../subjects/subjects.service';
import { PhasesService } from '../phases/phases.service';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { cities } from 'src/db/entities/city.entity';
import { degrees } from 'src/db/entities/degree.entity';
import { User } from 'src/db/entities/user.entity';
import { Phases } from 'src/db/entities/phases.entity';
import { Grade } from 'src/common/constants';
import { Response } from 'express';
import { Request } from 'express';
import { Batch } from 'src/db/entities/batch.entity';
import * as ExcelJS from 'exceljs';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
import { getRepository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { GradesService } from '../grades/grades.service';
import { TestWeightage } from 'src/db/entities/test_weightage.entity';
import { Assessment } from 'src/db/entities/assessment.entity';
import { EmailTemplateService } from '../email.template/email.template.service';
import { Subject } from 'src/db/entities/subject.entity';
import { FinalResults } from 'src/db/entities/final_results.entity';
import { CreateFinalResultsDto } from './dto/create_final_results.dto';
import { error } from 'console';
import { PhaseHistory } from 'src/db/entities/phase_history.entity';
import { StudentRegistration } from 'src/db/entities/student_registrations.entity';
import { student_subjects } from 'src/db/entities/Student_Subjects.entity';
import { Student } from 'src/db/entities/student.entity';
// import * as CircularJSON from 'circular-json';
// import { CreateStudentResult } from './dto/create-result.dto';
// import { setTestSchedule } from './dto/set-testschedule.dto';

@Injectable()
export class StudentRegistrationsService {
  constructor(
    @Inject(forwardRef(() => STUDENT_SERVICE))
    private readonly studentsService: StudentsService,
    @Inject(BATCH_SERVICE)
    private readonly batchService: BatchesService,
    @Inject(PHASE_SERVICE)
    private readonly phasesService: PhasesService,
    @Inject(CITY_SERVICE)
    private readonly citySerivice: CityService,
    @Inject(GRADE_SERVICE)
    private readonly gradService: GradesService,
    @Inject(USER_SERVICE)
    private readonly usersService: UsersService,
    @Inject(SUBJECT_SERVICE)
    private readonly subjectsService: SubjectsService,
    @Inject(PHASE_SERVICE)
    private readonly pahsesService: PhasesService,
    @InjectRepository(StudentRegistration)
    private _student_registrationRepository: Repository<StudentRegistration>,
    @InjectRepository(student_subjects)
    private readonly student_subjectsRepository: Repository<student_subjects>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @InjectRepository(Assessment)
    private readonly _assessmentRepository: Repository<Assessment>,
    @InjectRepository(FinalResults)
    private readonly _finalResultRepository: Repository<FinalResults>,
    @Inject(EMAILTEMPALTE_SERVICE)
    private readonly _emailTempService: EmailTemplateService,
  ) {}

  async getCreateStudentData(payload) {
    // console.log(payload);
    const userId = payload.user.id;
    // const recordsub = await this.degreesubjects(payload);
    const data = await this.usersService.getstudentbyId(userId);

    const recordbatch = await this.batchService.findOpenCurrentBatch();
    const record = await this.usersService.getStudentDegree(userId);

    const recordsub = await this.usersService.getDegreeSub(userId);
    // console.log(recordbatch);

    return {
      student: data,
      batch: recordbatch,
      student_degree: record,
      degree_subjects: recordsub,
    };
  }

  async degreesubjects(paylaod) {
    const batchcriteria = await this.batchService.getbatchCriteria();

    if (batchcriteria.eligibility_criteria === null) {
      throw new HttpException('batch criteria are not defined', 404);
    }

    const studentdegree = await this.studentsService.getstudentDegree(paylaod);

    for (let degreecriteri of batchcriteria.eligibility_criteria) {
      if (studentdegree.degree.title === degreecriteri.degree.title) {
        return degreecriteri.eligibility_criteria_subjects;
      }
    }
    return null;
  }

  async create(
    payload,
    createStudentRegistrationDto: CreateStudentRegistrationDto,
    CV: Express.Multer.File,
  ) {
    // console.log(createStudentRegistrationDto);

    // Getting and placing StudentInfo in Dto
    // const studentId = createStudentRegistrationDto.userId;

    // console.log(payload.user);
    const userStudentObj = await this.usersService.getStudentInfo(
      payload.user.id,
    );
    console.log(userStudentObj);
    if (!userStudentObj) {
      throw new HttpException('Student Record Not Found', 404);
    }

    // Getting and placing Batch in Dto
    const batchId = createStudentRegistrationDto.batchId;
    const batchObj = await this.batchService.findOne(batchId);
    if (!batchObj) {
      throw new HttpException('Given Batch Not Found', 404);
    }

    // Getting and placing City in Dto
    const cityId = createStudentRegistrationDto.cityId;
    const cityObj = await this.citySerivice.getCityById(cityId);
    if (!cityObj) {
      throw new HttpException('Given City Not Found', 404);
    }

    // Getting and placing Phase titled 'Registered' in Dto
    const phaseObj = await this.pahsesService.findbyname('Registered');
    if (!phaseObj) {
      throw new HttpException('Given Phase Not Found', 404);
    }

    try {
      await this.entityManager.transaction(async (manager) => {
        try {
          // createStudentRegistrationDto['Status'] = "Open";
          const parent = new StudentRegistration();
          parent.student = userStudentObj.student;
          parent.batch = batchObj;
          parent.base_city = cityObj;
          parent.cgpa = createStudentRegistrationDto.cgpa;
          parent.cv = '\\cv\\' + CV.filename;
          parent.phase = phaseObj;
          parent.is_open = true;
          parent.is_enrolled_project =
            createStudentRegistrationDto.isEnrolledInProject;
          const parentRecord = await manager.save(parent);
          // await this._student_registrationRepository.save(parent);

          const subjects=createStudentRegistrationDto.registeredSubjects.map(
            async (childObj) => {
              const subjectObj = await this.subjectsService.findById(
                childObj.id,
              );
              if (!subjectObj) {
                throw new HttpException('Given Subject not found ', 404);
              }
              const child = new student_subjects();
              child.grade = childObj.grade;
              child.subject = subjectObj;
              child.student_registration = parentRecord;
              // await this.student_subjectsRepository.save(child);
              await manager.save(child);
            },
          );

          await Promise.all(subjects)
          return;
        } catch (error) {
          if (error) {
            throw new HttpException(error.message, 404);
          }
          await manager.query('ROLLBACK');
          throw error;
        }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Duplicate entry', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  //list of Registered Students
  async registeredStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapMany(
        'StudentRegistration.student_subjects', // Property name on the Asset entity
        student_subjects, // Entity to join (student_subjects)
        'student_subjects', // Alias for the joined entity
        'StudentRegistration.id = student_subjects.studentRegistrationId', // Join condition
      )
      .leftJoinAndMapMany(
        'student_subjects.Subject', // Property name on the Asset entity
        Subject, // Entity to join (student_subjects)
        'Subject', // Alias for the joined entity
        'student_subjects.subjectId = Subject.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.Degree',
        degrees,
        'Degree',
        'Student.degreeId = Degree.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'Batch':
        queryBuilder.orderBy('Batch.name', registrationpageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'Student.name',
      'Degree.title',
      'StudentRegistration.cgpa',
      'StudentRegistration.is_enrolled_project',
      'student_subjects.id',
      'student_subjects.grade',
      'Subject.id',
      'Subject.title',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Students.name LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }

    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :batch', {
        batch: `%${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }
    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :registered', {
      registered: 'Registered',
    });

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }

    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=registeredstudents_report.xlsx',
      );

      await this.generateRegisteredStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateRegisteredStudentReport(
    StudentRegistrationPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registered Students');

    // Define column headers
    worksheet.columns = [
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Degree', key: 'Degree', width: 30 },
      { header: 'CGPA', key: 'CGPA', width: 5 },
      { header: 'ProjectEnrollment', key: 'ProjectEnrollment', width: 4 },
      { header: 'StudentSubjects', key: 'StudentSubjects', width: 30 },
      { header: 'Grade', key: 'Grade', width: 4 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentRegistrationPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        StudentName: StudentRegistration.Student.name,
        Degree: StudentRegistration.Student.Degree.title,
        CGPA: StudentRegistration.cgpa,
        ProjectEnrollment: StudentRegistration.is_enrolled_project,
        StudentSubjects: StudentRegistration.student_subjects.subjects.title,
        Grade: StudentRegistration.student_subjects.grade,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  // Rejected Student List

  async rejectedStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapMany(
        'StudentRegistration.student_subjects', // Property name on the Asset entity
        student_subjects, // Entity to join (student_subjects)
        'student_subjects', // Alias for the joined entity
        'StudentRegistration.id = student_subjects.studentRegistrationId', // Join condition
      )
      .leftJoinAndMapMany(
        'student_subjects.Subject', // Property name on the Asset entity
        Subject, // Entity to join (student_subjects)
        'Subject', // Alias for the joined entity
        'student_subjects.subjectId = Subject.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.Degree',
        degrees,
        'Degree',
        'Student.degreeId = Degree.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'Batch':
        queryBuilder.orderBy('Batch.name', registrationpageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'Student.name',
      'Degree.title',
      'StudentRegistration.cgpa',
      'StudentRegistration.is_enrolled_project',
      'StudentRegistration.comments',
      'student_subjects.id',
      'student_subjects.grade',
      'Subject.id',
      'Subject.title',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Students.name LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }

    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :batch', {
        batch: `%${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }
    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :rejected', {
      rejected: 'Rejected',
    });

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }

    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=rejectedstudents_report.xlsx',
      );

      await this.generateRejectedStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateRejectedStudentReport(
    StudentRegistrationPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registered Students');

    // Define column headers
    worksheet.columns = [
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Degree', key: 'Degree', width: 30 },
      { header: 'CGPA', key: 'CGPA', width: 5 },
      { header: 'ProjectEnrollment', key: 'ProjectEnrollment', width: 4 },
      { header: 'StudentSubjects', key: 'StudentSubjects', width: 30 },
      { header: 'Grade', key: 'Grade', width: 4 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentRegistrationPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        StudentName: StudentRegistration.Student.name,
        Degree: StudentRegistration.Student.Degree.title,
        CGPA: StudentRegistration.cgpa,
        ProjectEnrollment: StudentRegistration.is_enrolled_project,
        StudentSubjects: StudentRegistration.student_subjects.subjects.title,
        Grade: StudentRegistration.student_subjects.grade,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  //list of Shortlisted Students
  async shortListedStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.City',
        cities,
        'City',
        'StudentRegistration.baseCityId = City.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.Degree',
        degrees,
        'Degree',
        'Student.degreeId = Degree.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.User',
        User,
        'User',
        'Student.userId = User.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'StudentRegistration.cgpa',
      'StudentRegistration.attendance',
      'StudentRegistration.testdate',
      'StudentRegistration.testaddress',
      'Student.name',
      'Student.vuid',
      'City.name',
      'Degree.title',
      'User.email',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Student.name LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }

    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :batch', {
        batch: `${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `${req.query.batch}%`,
      });
    }

    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :shortlisted', {
      shortlisted: 'Shortlisted',
    });

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }
    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=shortlistedstudents_report.xlsx',
      );

      await this.generateShortlistedStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateShortlistedStudentReport(
    StudentShortlistedPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shortlisted Students');

    // Define column headers
    worksheet.columns = [
      { header: 'VuId', key: 'VuId', width: 30 },
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Degree', key: 'Degree', width: 30 },
      { header: 'CGPA', key: 'CGPA', width: 5 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'City', key: 'City', width: 30 },
      { header: 'TestDate', key: 'TestDate', width: 10 },
      { header: 'TestAddress', key: 'TestAddress', width: 50 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentShortlistedPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        VuId: StudentRegistration.Student.vuid,
        StudentName: StudentRegistration.Student.name,
        Degree: StudentRegistration.Student.Degree.title,
        CGPA: StudentRegistration.cgpa,
        Email: StudentRegistration.Student.User.email,
        City: StudentRegistration.City.name,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  // List of student whose phase is Assessments
  async AssessmentedStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.City',
        cities,
        'City',
        'StudentRegistration.baseCityId = City.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.Degree',
        degrees,
        'Degree',
        'Student.degreeId = Degree.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.User',
        User,
        'User',
        'Student.userId = User.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'StudentRegistration.cgpa',
      'StudentRegistration.attendance',
      'Student.name',
      'Student.vuid',
      'Degree.title',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Student.name LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }

    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :batch', {
        batch: `${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `${req.query.batch}%`,
      });
    }

    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :assessment', {
      assessment: 'Assessment',
    });

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }
    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=shortlistedstudents_report.xlsx',
      );

      await this.generateShortlistedStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateAssessmentStudentReport(
    StudentShortlistedPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shortlisted Students');

    // Define column headers
    worksheet.columns = [
      { header: 'VuId', key: 'VuId', width: 30 },
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Degree', key: 'Degree', width: 30 },
      { header: 'CGPA', key: 'CGPA', width: 5 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'City', key: 'City', width: 30 },
      { header: 'TestDate', key: 'TestDate', width: 10 },
      { header: 'TestAddress', key: 'TestAddress', width: 50 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentShortlistedPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        VuId: StudentRegistration.Student.vuid,
        StudentName: StudentRegistration.Student.name,
        Degree: StudentRegistration.Student.Degree.title,
        CGPA: StudentRegistration.cgpa,
        Email: StudentRegistration.Student.User.email,
        City: StudentRegistration.City.name,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  //list of Recommended Students
  async recommendedStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.City',
        cities,
        'City',
        'StudentRegistration.baseCityId = City.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.Degree',
        degrees,
        'Degree',
        'Student.degreeId = Degree.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.User',
        User,
        'User',
        'Student.userId = User.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'Batch':
        queryBuilder.orderBy('Batch.name', registrationpageOptionsDto.order);
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'StudentRegistration.cgpa',
      'Student.name',
      'Student.vuid',
      'City.name',
      'Degree.title',
      'User.email',
      'Phases.name',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Student.name LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }
    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :search ', {
        search: `%${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }
    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :recommended', {
      recommended: 'Recommended',
    });

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }
    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename = recommendedstudents_report.xlsx',
      );

      this.generateRecommendedStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateRecommendedStudentReport(
    StudentRegistrationPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Recommended Students');

    // Define column headers
    worksheet.columns = [
      { header: 'VuId', key: 'VuId', width: 30 },
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Degree', key: 'Degree', width: 30 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'City', key: 'City', width: 30 },
      { header: 'Phase', key: 'Phase', width: 10 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentRegistrationPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        VuId: StudentRegistration.Student.vuid,
        StudentName: StudentRegistration.Student.name,
        Degree: StudentRegistration.Student.Degree.title,
        Email: StudentRegistration.Student.User.email,
        City: StudentRegistration.City.name,
        Phase: StudentRegistration.Phases.name,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }
  //list of Invited Students

  async invitedStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.City',
        cities,
        'City',
        'StudentRegistration.baseCityId = City.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.Degree',
        degrees,
        'Degree',
        'Student.degreeId = Degree.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.User',
        User,
        'User',
        'Student.userId = User.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'Batch':
        queryBuilder.orderBy('Batch.name', registrationpageOptionsDto.order);
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'StudentRegistration.cgpa',
      'Student.name',
      'Student.vuid',
      'City.name',
      'User.email',
      'Phases.name',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Student.name LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }
    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :search ', {
        search: `%${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }
    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :invited', {
      invited: 'Invited',
    });

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }
    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename = recommendedstudents_report.xlsx',
      );

      this.generateInvitedStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateInvitedStudentReport(
    StudentRegistrationPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Recommended Students');

    // Define column headers
    worksheet.columns = [
      { header: 'VuId', key: 'VuId', width: 30 },
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Degree', key: 'Degree', width: 30 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'City', key: 'City', width: 30 },
      { header: 'Phase', key: 'Phase', width: 10 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentRegistrationPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        VuId: StudentRegistration.Student.vuid,
        StudentName: StudentRegistration.Student.name,
        Degree: StudentRegistration.Student.Degree.title,
        Email: StudentRegistration.Student.User.email,
        City: StudentRegistration.City.name,
        Phase: StudentRegistration.Phases.name,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }
  //list of joined Students
  async joinedStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.City',
        cities,
        'City',
        'StudentRegistration.baseCityId = City.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.User',
        User,
        'User',
        'Student.userId = User.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'Batch':
        queryBuilder.orderBy('Batch.name', registrationpageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'StudentRegistration.cgpa',
      'Student.name',
      'Student.vuid',
      'City.name',
      'User.email',
      'Phases.name',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Student.name LIKE :search', {
        Name: `%${req.query.search}%`,
      });
    }
    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :status', {
        status: `%${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }
    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name = :joined', {
      joined: 'Joined',
    });

    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename = joinedstudents_report.xlsx',
      );

      this.generateJoinedStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generateJoinedStudentReport(
    StudentRegistrationPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Joined Students');

    // Define column headers
    worksheet.columns = [
      { header: 'VuId', key: 'VuId', width: 30 },
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'City', key: 'City', width: 30 },
      { header: 'Phase', key: 'Phase', width: 10 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentRegistrationPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        VuId: StudentRegistration.Student.vuid,
        StudentName: StudentRegistration.Student.name,
        Email: StudentRegistration.Student.User.email,
        City: StudentRegistration.City.name,
        Phase: StudentRegistration.Phases.name,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  // passout students list
  async passoutStudents(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ): Promise<PageDto<StudentRegistration>> {
    const queryBuilder = this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndMapOne(
        'StudentRegistration.Student',
        Student,
        'Student',
        'StudentRegistration.studentId = Student.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.City',
        cities,
        'City',
        'StudentRegistration.baseCityId = City.id', // Join condition
      )
      .leftJoinAndMapOne(
        'Student.User',
        User,
        'User',
        'Student.userId = User.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Batch',
        Batch,
        'Batch',
        'StudentRegistration.batchId = Batch.id', // Join condition
      )
      .leftJoinAndMapOne(
        'StudentRegistration.Phases',
        Phases,
        'Phases',
        'StudentRegistration.phaseId = Phases.id', // Join condition
      );

    switch (registrationpageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
      case 'cgpa':
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
      case 'Batch':
        queryBuilder.orderBy('Batch.name', registrationpageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy(
          'StudentRegistration.cgpa',
          registrationpageOptionsDto.order,
        );
        break;
    }
    queryBuilder.select([
      'StudentRegistration.id',
      'StudentRegistration.cgpa',
      'Student.name',
      'Student.vuid',
      'City.name',
      'User.email',
      'Phases.name',
      'Batch.id',
      'Batch.name',
    ]);

    if (req.query.search) {
      queryBuilder.andWhere('Student.name LIKE :search', {
        Name: `%${req.query.search}%`,
      });
    }

    if (req.query.status) {
      queryBuilder.andWhere('Batch.is_current LIKE :status', {
        status: `%${req.query.status}%`,
      });
    }

    if (req.query.batch) {
      queryBuilder.andWhere('Batch.name LIKE :batch', {
        batch: `%${req.query.batch}%`,
      });
    }
    // Add a condition to filter by phase name (Shortlisted)
    queryBuilder.andWhere('Phases.name=:Passout', {
      Passout: 'Passout',
    });

    queryBuilder
      .skip(registrationpageOptionsDto.skip)
      .take(registrationpageOptionsDto.take);

    if (registrationpageOptionsDto.page !== 1) {
      registrationpageOptionsDto.skip =
        (registrationpageOptionsDto.page - 1) * registrationpageOptionsDto.take;
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    if (req.query.download) {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename = joinedstudents_report.xlsx',
      );

      this.generatePassoutStudentReport(entities);
    }

    const pageOptionsDto: PageOptionsDto = registrationpageOptionsDto;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<StudentRegistration>(entities, pageMetaDto);
  }

  async generatePassoutStudentReport(
    StudentRegistrationPagedata: any[],
  ): Promise<Buffer> {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Passout Students');

    // Define column headers
    worksheet.columns = [
      { header: 'VuId', key: 'VuId', width: 30 },
      { header: 'StudentName', key: 'StudentName', width: 40 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'City', key: 'City', width: 30 },
      { header: 'Phase', key: 'Phase', width: 10 },
      // Add more columns as needed
    ];

    // Add data to the worksheet
    StudentRegistrationPagedata.forEach((StudentRegistration) => {
      worksheet.addRow({
        VuId: StudentRegistration.Student.vuid,
        StudentName: StudentRegistration.Student.name,
        Email: StudentRegistration.Student.User.email,
        City: StudentRegistration.City.name,
        Phase: StudentRegistration.Phases.name,
        // Add more properties as needed
      });
    });

    // Generate an Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  async findOne(id: string) {
    const registration = await this._student_registrationRepository.findOne({
      where: { id },
      relations: ['phase', 'batch'],
    });

    if (!registration) {
      throw new HttpException('registration not found', 404);
    }
    return registration;
  }

  async getUpdateById(id: string) {
    const queryBuilder = await this._student_registrationRepository
      .createQueryBuilder('StudentRegistration')
      .leftJoinAndSelect('StudentRegistration.base_city', 'base_city')
      .leftJoinAndSelect('StudentRegistration.student', 'student')
      .leftJoinAndSelect('student.degree', 'degree')
      .leftJoinAndMapMany(
        'StudentRegistration.student_subjects', // Property name on the Asset entity
        student_subjects, // Entity to join (student_subjects)
        'student_subjects', // Alias for the joined entity
        'StudentRegistration.id = student_subjects.studentRegistrationId', // Join condition
      )
      .leftJoinAndSelect('student_subjects.subject', 'subject')
      .where('StudentRegistration.id = :registrationId', {
        registrationId: id,
      })
      .getOne();

    // console.log(queryBuilder);

    if (!queryBuilder) {
      throw new HttpException('Student Not Found ', 404);
    }
    return queryBuilder;
  }

  async update(
    id: string,
    updateStudentRegistrationDto: UpdateStudentRegistrationDto,
  ) {
    const record = await this._student_registrationRepository.findOne({
      where: { id },
      relations: { registrationsubjects: true },
    });

    if (!record) {
      throw new HttpException('Given id not found', 404);
    }
    try {
      await this.entityManager.transaction(async (manager) => {
        record.cgpa = updateStudentRegistrationDto.cgpa;
        record.is_enrolled_project =
          updateStudentRegistrationDto.isEnrolledInProject;
        if (record) {
          if (record.registrationsubjects.length > 0) {
            const subjectIds = record.registrationsubjects.map(
              (studentsubj) => studentsubj.id,
            );

            await this.student_subjectsRepository.delete(subjectIds);
          }
        }

        await manager.save(record);

        // Create and associate new StudentSubject records

        updateStudentRegistrationDto.registeredSubjects.map(
          async (subjectData) => {
            const subjectObj = await this.subjectsService.findById(
              subjectData.id,
            );
            if (!subjectObj) {
              throw new HttpException('Given subjects not found', 404);
            }
            const studentSubject = new student_subjects();
            studentSubject.grade = subjectData.grade;
            studentSubject.subject = subjectObj;
            studentSubject.student_registration = record;
            await manager.save(studentSubject);
          },
        );
      });
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      // console.log(error.message);
      throw error;
    }
  }

  async findAll() {
    const studentRegistrations =
      await this._student_registrationRepository.find({
        relations: ['batch', 'phase', 'student', 'base_city'],
        where: {
          batch: { is_current: true },
          phase: { name: 'registered' },
        },
      });

    const records = studentRegistrations.map((registration) => ({
      id: registration.id,
      vuid: registration.student.vuid,
      studentName: registration.student.name,
      cityId: registration.base_city.id,
      cityName: registration.base_city.name,
      phaseId: registration.phase.id,
      phaseName: registration.phase.name,
      batchId: registration.batch.id,
      isCurrentBatch: registration.batch.is_current,
      batchName: registration.batch.name,
    }));

    return records;
  }

  async applyEligibilityToBatch(id: string, payload) {
    const batch = await this.batchService.getBatchCriterias(id);

    if (!batch.is_current) {
      throw new HttpException('Batch is Not current', 404);
    }

    // get all student registrations of the active batch whose phase is registered
    const registrations = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect(
        'studentRegistration.registrationsubjects',
        'registrationsubjects',
      )
      .leftJoinAndSelect('registrationsubjects.subject', 'subject')
      .leftJoinAndSelect('student.degree', 'degrees')
      .where('studentRegistration.batchId = :bId', { bId: id })
      .andWhere('phase.name = :name', { name: 'registered' })
      .getMany();

    if (registrations.length === 0) {
      throw new HttpException('there is no Registered students', 404);
    }

    for (let r of registrations) {
      // console.log(r.student.degree.title);
      const degreeEligibility = this.getDegreeEligibilityCriteria(
        r.student.degree.title,
        batch.eligibility_criteria,
      );
      if (!(degreeEligibility === undefined || degreeEligibility === null)) {
        const isCgpaCriteriaMet = r.cgpa >= degreeEligibility.minimum_cgpa;

        const isProjectEnrollmentCriteriaMet =
          r.is_enrolled_project == degreeEligibility.project_enrollment;

        const isSubjectCriteriaMet = r.registrationsubjects.every((su) =>
          this.is_subject_criteria_met(
            su,
            degreeEligibility.eligibility_criteria_subjects,
          ),
        );

        const isSubjectsLengthmatch =
          r.registrationsubjects.length ==
          degreeEligibility.eligibility_criteria_subjects.length;

        let comments = '';

        if (!isCgpaCriteriaMet) {
          comments = 'Cgpa is less then minumum Cgpa Criteria';
        }

        if (!isProjectEnrollmentCriteriaMet) {
          comments = 'Student is not Enrolled in Project';
        }
        if (!isSubjectCriteriaMet) {
          comments = 'subject Criteria not met';
        }
        if (!isSubjectsLengthmatch) {
          comments = 'Students all subject are not found in Criteria Subjects';
        }
        // // Check if all criteria are met

        if (
          isCgpaCriteriaMet &&
          isProjectEnrollmentCriteriaMet &&
          isSubjectCriteriaMet &&
          isSubjectsLengthmatch
        ) {
          comments = 'All Criterias are met';
          // Update the phase to "Shortlist"
          await this.updatePhase(r, 'Shortlisted', comments, payload);
        } else {
          await this.updatePhase(r, 'Rejected', comments, payload);
        }
      } else {
        const comments = 'Degree is not eligible';
        await this.updatePhase(r, 'Rejected', comments, payload);
      }
    }
  }

  is_subject_criteria_met(subject: any, eligibility_criteria_subjects: any) {
    const found = eligibility_criteria_subjects.find(
      (element) => subject.subject.code == element.subjects.code,
    );

    if (found) {
      function compareGrades(ec_grade, sr_grade) {
        if (Grade[ec_grade] <= Grade[sr_grade]) {
          return true;
        } else {
          return false;
        }
      }

      const ec_grade = found.grade;
      const sr_grade = subject.grade;

      const isMatch = compareGrades(ec_grade, sr_grade);
      if (isMatch) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  // console.log(subject.subject.code, ' : ', subject.Grades);

  getDegreeEligibilityCriteria(
    degreeTitle: string,
    eligibilityCriterias: any[],
  ) {
    const found = eligibilityCriterias.find(
      (element) => element.degree.title == degreeTitle,
    );
    return found;
  }

  async getUpdateAttendance(id: string) {
    const record = await this._student_registrationRepository.findOne({
      where: { id },
      relations: ['batch', 'student', 'student.degree', 'phase'],
    });
    if (record.batch.is_current != true) {
      throw new HttpException('batch is not current', 404);
    }
    if (record.phase.name != 'shortlisted') {
    }
    // console.log(record.batch.name);
    return record;
  }
  // async getAttendanceList(): Promise<{
  //   batchName: string | null;
  //   assessments: {
  //     name: string;
  //     vuid: string;
  //     degree: string;
  //     attendance: string;
  //   }[];
  // }> {
  //   try {
  //     // Get the current batch
  //     const currentBatch = await this.batchService.findCurrentBatch();

  //     // Get all student registration records where phase name is 'Assessment' or 'Absent'
  //     const studentRegistrations =
  //       await this._student_registrationRepository.find({
  //         relations: ['student', 'student.degree', 'phase'],
  //         where: [
  //           { phase: { name: 'Assessment' } },
  //           { phase: { name: 'Absent' } },
  //         ],
  //       });

  //     // Array to store assessment results
  //     const attendanceList: {
  //       name: string;
  //       vuid: string;
  //       degree: string;
  //       attendance: string;
  //     }[] = [];

  //     // Loop through each student registration
  //     for (const studentRegistration of studentRegistrations) {
  //       // Extract relevant student details
  //       const { name, vuid } = studentRegistration.student;
  //       const degreeTitle = studentRegistration.student.degree.title;

  //       // Add to the result array
  //       attendanceList.push({
  //         name,
  //         vuid,
  //         degree: degreeTitle,
  //         attendance: studentRegistration.attendance,
  //       });
  //     }

  //     // Return the result including batch information
  //     return {
  //       batchName: currentBatch ? currentBatch.name : null,
  //       assessments: attendanceList,
  //     };
  //   } catch (error) {
  //     // console.error('Error:', error.message);
  //     throw new Error('Failed to retrieve attendance list');
  //   }
  // }
  async getShortlistedStudentsInCurrentBatch(
    batchId: string,
  ): Promise<StudentRegistration[]> {
    return this._student_registrationRepository
      .createQueryBuilder('student_registration')
      .where({
        'phase.name': 'Shortlisted',
      })
      .andWhere('student_registration.batchId = :batchId', { batchId })
      .leftJoinAndSelect('student_registration.Student', 'student')
      .leftJoinAndSelect('student.Degree', 'degree')
      .getMany();
  }

  async updateAttendances(
    Id: string,
    UpdateStudentRegistrationDto: UpdateStudentRegistrationDto,
  ) {
    // const phone = updateUserDto.phone;

    const attendanceRecord = await this._student_registrationRepository.findOne(
      {
        where: {
          id: Id,
        },
      },
    );

    if (!attendanceRecord) {
      throw new HttpException('Record Not Found', 404);
    }
  }

  // method for updating phase shortlisted to assessment

  async updatePhaseAssessment(
    id: string,
    updateStudentRegistrationDto: UpdateStudentRegistrationDto,
    payload,
  ) {
    // Get all student registration records
    const studentRegistrations =
      await this._student_registrationRepository.findOne({
        where: { id },
        relations: ['batch', 'student', 'student.degree', 'phase'],
      });

    if (!studentRegistrations) {
      throw new HttpException('StudentRegistration not found', 404);
    }
    studentRegistrations.attendance = updateStudentRegistrationDto.attendance;
    studentRegistrations.attendanceDateTime =
      updateStudentRegistrationDto.attendanceDateTime;

    let comments = '';

    if (studentRegistrations.attendance === 'Present') {
      comments = 'Student is Present in Test and Interview';
      await this.updatePhase(
        studentRegistrations,
        'Assessment',
        comments,
        payload,
      );
    }
    if (studentRegistrations.attendance === 'Absent') {
      comments = 'Student is Absent in test and Interview';
      await this.updatePhase(
        studentRegistrations,
        'Shortlisted',
        comments,
        payload,
      );
    }

    return await this._student_registrationRepository.save(
      studentRegistrations,
    );
  }
  //list of assessments

  //setting test schedule for particular batch's shortlisted students
  async setTestSchedule(SRId: string[]) {
    const students = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .where('studentRegistration.id IN(:...bId)', { bId: SRId })
      .andWhere('phase.name=:name', { name: 'shortlisted' })
      .andWhere('batch.is_current=:value', { value: true })
      .getMany();

    if (students.length === 0) {
      throw new HttpException('there is no more shortlisted students', 404);
    }
    // if (!students[0].batch || !students[0].batch.is_current) {
    //   throw new HttpException('The batch is not marked as current', 404);
    // }
    return students;
  }

  async getEmailsBySRIDs(SRId: string[]) {
    const emails = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('studentRegistration.id IN (:...IDs)', { IDs: SRId })
      .andWhere('batch.is_current=:value', { value: true })
      .andWhere('phase.name=:name', { name: 'shortlisted' })
      .getMany();

    if (!emails || emails.length === 0) {
      throw new HttpException('given id is not exist', 404);
    }

    // console.log(emails);
    return emails;
  }

  async getEmailsBySRID(SRId: string) {
    const emails = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('studentRegistration.id = :id', { id: SRId }) // Fixed space between '=' and ':'
      .andWhere('batch.is_current = :value', { value: true })
      .andWhere('phase.name = :name', { name: 'Rejected' })
      .getOne();

    if (!emails) {
      throw new HttpException('Given id does not exist', 404); // Improved error message
    }

    // console.log(emails);
    return emails;
  }

  async getsetStudentResult(id: string) {
    const record = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.assessments', 'assessments')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('batch.test_weightage', 'test_weightage')
      .select([
        'studentRegistration.id',
        'assessments.id',
        'assessments.total_obtain_marks',
        'assessments.interview_obtain_weightage',
        'assessments.test_obtain_weightage',
        'assessments.total_obtain_weightage',
        'batch.id',
        'batch.name',
        'test_weightage.id',
        'test_weightage.test_weightage',
        'test_weightage.interview_weightage',
        'test_weightage.total_weightage',
        'test_weightage.test_total_marks',
        'test_weightage.interview_total_marks',
      ])
      .where('studentRegistration.id=:Id', { Id: id })
      .andWhere('batch.is_current=:value', { value: true })
      .andWhere('phase.name=:name', { name: 'assessment' })
      .getOne();
    // console.log(record);
    if (!record) {
      throw new HttpException('Record Not Found', 404);
    }
    return record;
  }

// Separate method to create the assessment result
async createAssessmentResult(updateRegistrationDto, registration, phase, manager) {
  const Result = new Assessment();
  Result.test_obtain_marks = updateRegistrationDto.testObtainMarks;
  Result.StudentRegistration = registration;
  Result.batch = registration.batch;
  Result.batch.test_weightage = registration.batch.test_weightage;
  Result.test_comment = updateRegistrationDto.testcomment;
  Result.interview_comment = updateRegistrationDto.interviewcomment;
  Result.interview_obtain_marks = updateRegistrationDto.interviewObtainMarks;
  Result.interview_obtain_weightage = updateRegistrationDto.interviewObtainweightage;
  Result.test_obtain_weightage = updateRegistrationDto.testObtainWeightage;
  Result.total_obtain_weightage = updateRegistrationDto.totalObtainweightage;
  Result.total_obtain_marks = updateRegistrationDto.totalObtainmarks;

  await manager.save(Result);
}

// Separate method to update registration and save phase history
async updateRegistrationAndSaveHistory(registration, phase, updateRegistrationDto, payload, manager) {
  registration.phase = phase;
  registration.processed_on = new Date();
  registration.processed_by = payload.user.id;
  registration.comments = updateRegistrationDto.comments;

  const updatedRegistration = await manager.save(registration);

  const phaseHistory = new PhaseHistory();
  phaseHistory.studentRegistration = updatedRegistration;
  phaseHistory.comments = updatedRegistration.comments;
  phaseHistory.processed_by = payload.user.id;
  phaseHistory.processed_on = new Date();

  await manager.save(phaseHistory);

  return updatedRegistration;
}

// Refactored setStudentResult method
async setStudentResult(id: string, updateRegistrationDto: UpdateStudentRegistrationDto, payload) {
  const registration = await this._student_registrationRepository.findOne({
    where: { id },
    relations: ['phase', 'batch'],
  });

  const phase = await this.phasesService.findOne(updateRegistrationDto.phaseId);
  if (!phase) {
    throw new HttpException('Phase not found', 404);
  }

  try {
    await this.entityManager.transaction(async (manager) => {
      // Create assessment result
      await this.createAssessmentResult(updateRegistrationDto, registration, phase, manager);

      // Update registration and save phase history
      const updatedRegistration = await this.updateRegistrationAndSaveHistory(
        registration,
        phase,
        updateRegistrationDto,
        payload,
        manager
      );

      return updatedRegistration;
    });
  } catch (error) {
    throw new HttpException(error.message , 404);
  }
}


  async sendInvitationEmailsThroughBatch(
    id: string,
    createregistationdto: CreateStudentRegistrationDto,
    payload,
  ) {
    const Registrations = await this._student_registrationRepository
    .createQueryBuilder('studentregistrations')
    .leftJoinAndSelect('studentregistrations.batch', 'batch')
    .leftJoinAndSelect('studentregistrations.phase', 'phase')
    .leftJoinAndSelect('studentregistrations.student', 'student')
    .leftJoinAndSelect('student.user', 'user')
    .where('batch.id = :Id', { Id: id })
    .andWhere('phase.name= :name', { name: 'Recommended' })
    .andWhere('batch.is_current= :value', { value: true })
    .getMany();

    // console.log('this is ', Registrations);
    if (Registrations.length === 0) {
      throw new HttpException(
        'there is no Recommended Student in this batch',
        404,
      );
    }
    const templatedb = await this._emailTempService.findTemplateByname(
      'Invitation for Joining',
    );
    // console.log(templatedb.content);

    for (let R of Registrations) {
      // console.log('emails', R.student.user.email);
      const to = R.student.user.email;
      const name = R.student.name;
      const subject = templatedb.subject;
      let html = { name, body: createregistationdto.mailbody };
      const template = templatedb.subject;

      await this._emailTempService.sendDynamicEmail(
        to,
        subject,
        html,
        template,
      );
      let comments = 'Student is Invited For Joining';
      await this.updatePhase(R, 'Invited', comments, payload);
      // return 'Email sent Successfully';
    }
  }
  async sendInvitationemialstoSelectedStudents(SRId: string[]) {
    const students = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('studentRegistration.id IN(:...bId)', { bId: SRId })
      .andWhere('phase.name=:name', { name: 'Recommended' })
      .andWhere('batch.is_current=:value', { value: true })
      .getMany();

    if (students.length === 0) {
      throw new HttpException('there is no more Recommended students', 404);
    }
    return students;
  }
  // update phase when he/she come for joining

  // get student
  async getupdatestudentphase(id: string) {
    const record = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .select([
        'studentRegistration.id',
        'student.id',
        'student.name',
        'student.vuid',
        'batch.id',
        'batch.name',
        'phase.name',
      ])
      .where('studentRegistration.id=:Id', { Id: id })
      .andWhere('batch.is_current=:value', { value: true })
      .andWhere('phase.name=:name', { name: 'invited' })
      .getOne();

    // console.log(record)

    if (!record) {
      throw new HttpException('Student not Found', 404);
    }
    return record;
  }
  //patch function for phase
  async updatephase(
    id: string,
    updateRegistrationDto: UpdateStudentRegistrationDto,
  ) {
    const record = await this._student_registrationRepository.findOne({
      where: { id },
      relations: ['phase'],
    });
    if (record) {
      record.phase = updateRegistrationDto.phaseId;

      return this._student_registrationRepository.save(record);
    } else {
      throw new HttpException('Student Not found', 404);
    }
  }

  // get set the final result of the student who are at joined phase

  async getSetFinalResults(id: string) {
    const student = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.finalResults', 'finalResults')
      .select([
        'studentRegistration.id',
        'student.id',
        'student.vuid',
        'student.name',
        'batch.id',
        'batch.name',
        'finalResults.total_marks',
      ])
      .where('studentRegistration.id = :Id', { Id: id })
      .andWhere('batch.is_current= :value', { value: true })
      .andWhere('phase.name = :name', { name: 'Joined' })
      .getOne();

    // console.log(student);
    if (!student) {
      throw new HttpException('Studen not found', 404);
    }

    return student;
  }

  async setFinalResult(
    id: string,
    creatresultdto: CreateFinalResultsDto,
    payload,
  ) {
    const student = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .select([
        'studentRegistration.id',
        'student.id',
        'student.vuid',
        'student.name',
        'batch.id',
        'batch.name',
      ])
      .where('studentRegistration.id = :Id', { Id: id })
      .andWhere('batch.is_current= :value', { value: true })
      .andWhere('phase.name = :name', { name: 'Joined' })
      .getOne();

    if (!student) {
      throw new HttpException('Student not foud', 404);
    }

    const finalResult = new FinalResults();
    finalResult.studentRegistration = student;
    finalResult.internal_viva_marks = creatresultdto.internal_viva_marks;
    finalResult.external_viva_marks = creatresultdto.external_viva_marks;
    finalResult.documentation_marks = creatresultdto.documentation_marks;
    finalResult.total_marks = creatresultdto.total_marks;
    finalResult.project_name = creatresultdto.project_name;
    finalResult.supervisor_name = creatresultdto.supervisor_name;
    finalResult.result = creatresultdto.result;
    finalResult.description = creatresultdto.description;

    await this.entityManager.save(finalResult);
    // console.log('---------------------------result');
    // console.log(finalResult);

    let comments = '';

    if (finalResult.result === 'Pass') {
      comments = 'Student Passed His/Her Internship';
      await this.updatePhase(student, 'Passout', comments, payload);
    } else {
      comments = 'Student Fail in His/Her Internship';
      await this.updatePhase(student, 'Joined', comments, payload);
    }
    // console.log('--------------------------------phase');
    // console.log(student.phase);
    await this.entityManager.save(student);

    return student;
  }

  async viewjoinedStudent(id: string) {
    const joinedStudent = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.finalResults', 'finalResults')
      .select([
        'studentRegistration.id',
        'student.id',
        'student.vuid',
        'student.name',
        'batch.id',
        'batch.name',
        'phase.id',
        'phase.name',
        'finalResults.id',
        'finalResults.internal_viva_marks',
        'finalResults.external_viva_marks',
        'finalResults.documentation_marks',
        'finalResults.total_marks',
        'finalResults.project_name',
        'finalResults.supervisor_name',
        'finalResults.result',
        'finalResults.description'
      ])
      .where('studentRegistration.id = :Id', { Id: id })
      .andWhere('phase.name = :name', { name: 'Joined' })
      .getOne();

    if (!joinedStudent) {
      throw new HttpException('Joined Student Not Found', 404);
    }
    // console.log(joinedStudent);
    return joinedStudent;
  }

  async viewPassoutStudent(id: string) {
    const passoutStudent = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .leftJoinAndSelect('studentRegistration.finalResults', 'finalResults')
      .select([
        'studentRegistration.id',
        'student.id',
        'student.vuid',
        'student.name',
        'batch.id',
        'batch.name',
        'phase.id',
        'phase.name',
        'finalResults.id',
        'finalResults.internal_viva_marks',
        'finalResults.external_viva_marks',
        'finalResults.documentation_marks',
        'finalResults.total_marks',
        'finalResults.project_name',
        'finalResults.supervisor_name',
        'finalResults.result',
        'finalResults.description'
      ])
      .where('studentRegistration.id = :Id', { Id: id })
      .andWhere('phase.name = :name', { name: 'Passout' })
      .getOne();

    // console.log(joinedStudent);
    if (!passoutStudent) {
      throw new HttpException('Passout Student Not Found', 404);
    }
    return passoutStudent;
  }

  async quiteStudent(id: string, payload) {
    const Student = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      // .leftJoinAndSelect('studentRegistration.finalResults', 'finalResults')
      .select([
        'studentRegistration.id',
        'student.id',
        'student.vuid',
        'student.name',
        'batch.id',
        'batch.name',
        'phase.id',
        'phase.name',
        // 'finalResults.id',
        // 'finalResults.internal_viva_marks',
        // 'finalResults.external_viva_marks',
        // 'finalResults.documentation_marks',
        // 'finalResults.total_marks',
        // 'finalResults.project_name',
        // 'finalResults.supervisor_name',
        // 'finalResults.result',
      ])
      .where('studentRegistration.id = :Id', { Id: id })
      .andWhere('phase.name = :name', { name: 'Joined' })
      .getOne();

    if (Student) {
      let comments = 'Student Quite the Internship ';
      await this.updatePhase(Student, 'Quite', comments, payload);
    } else {
      throw new HttpException('student not found', 404);
    }
  }

  async getRegistrationCount() {
    const Registrations = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .select(['studentRegistration.id', 'batch.id', 'batch.name'])
      .where('batch.is_current=:value', { value: true })
      .andWhere('batch.registration_status=:status', { status: false })
      .getOne();
    const countRegistrations = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      // .select(['batch.id', 'batch.name'])
      .where('batch.is_current=:value', { value: true })
      .andWhere('batch.registration_status=:status', { status: false })
      .getCount();

    return { count: countRegistrations, registration: Registrations };
  }

  async getcountofopenbatch() {
    const Registration = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .select(['studentRegistration.id', 'batch.id', 'batch.name'])
      .where('batch.is_current=:value', { value: true })
      .andWhere('batch.registration_status=:status', { status: true })
      .getOne();

    const registration = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .where('batch.is_current=:value', { value: true })
      .andWhere('batch.registration_status=:status', { status: true })
      .getCount();

    return { Count2: registration, Registration };
  }

  async getadminandCoordinatoreDashboards() {
    const activebatch = await this.batchService.activebatches();
    const currentRegistrationCount = await this.getRegistrationCount();
    // const currentRegistrationCount =
    // await this.batchService.activebatchwithregistrations();
    const openbatchRegistrationCount = await this.getcountofopenbatch();

    const joinedCount = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.batch', 'batch')
      .leftJoinAndSelect('studentRegistration.phase', 'phase')
      .where('batch.is_current= :value', { value: true })
      .andWhere('phase.name = :name', { name: 'Joined' })
      .getCount();

    return {
      JoinedCount: joinedCount,
      activebatch,
      currentRegistrationCount: currentRegistrationCount,
      openRegistrationbatchCount: openbatchRegistrationCount,
    };
  }

  // get the student registration history from student

  async getregistrationCount(paylaod: any) {
    const count = await this._student_registrationRepository
      .createQueryBuilder('studentRegistration')
      .leftJoinAndSelect('studentRegistration.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('user.id=:id', { id: paylaod.sub })
      .getCount();

    return { count: count };
  }

  async shortlistedAbsentMoveToRejected(id: string, payload: any) {
    try {
      const registration = await this._student_registrationRepository
        .createQueryBuilder('studentRegistration')
        .leftJoinAndSelect('studentRegistration.batch', 'batch')
        .leftJoinAndSelect('studentRegistration.phase', 'phase')
        .where('batch.id = :Id', { Id: id })
        .andWhere('batch.is_current = :value', { value: true })
        .andWhere('phase.name= :name', { name: 'Shortlisted' })
        .andWhere('studentRegistration.attendance = :attendance', {
          attendance: 'Absent',
        })
        .getMany();

      if (registration.length === 0) {
        // Check if there are no registrations
        throw new HttpException(
          'There are no more absent shortlisted students',
          404,
        );
      }

      for (let R of registration) {
        // console.log(R);
        let comments = 'Student is Absent in  test and interview';
        await this.updatePhase(R, 'Rejected', comments, payload);
      }
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  async updatePhase(
    registration: StudentRegistration,
    targetPhaseName: string,
    comments: string,
    payload: any,
  ) {
    const targetPhase = await this.phasesService.findOneByName(targetPhaseName);

    try {
      return await this.entityManager.transaction(async (entityManager) => {
        registration.phase = targetPhase;
        registration.comments = comments;
        registration.processed_by = payload.user.id;
        registration.processed_on = new Date();

        await entityManager.save(registration);

        const phaseHistory = new PhaseHistory();
        phaseHistory.studentRegistration = registration;
        phaseHistory.processed_by = payload.user.id;
        phaseHistory.phases = targetPhase;
        phaseHistory.comments = comments;
        phaseHistory.processed_on = new Date();

        await entityManager.save(phaseHistory);
      });
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }

      throw error;
    }
  }

  // send email to rejected student with rejection reason

  async sendRejectionEmailsThroughBatch(id: string) {
    const Registrations = await this._student_registrationRepository
      .createQueryBuilder('studentregistrations')
      .leftJoinAndSelect('studentregistrations.batch', 'batch')
      .leftJoinAndSelect('studentregistrations.phase', 'phase')
      .leftJoinAndSelect('studentregistrations.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .where('batch.id=:Id', { Id: id })
      .andWhere('batch.is_current=:value', { value: true })
      .andWhere('phase.name=:name', { name: 'Rejected' })
      .getMany();

    // console.log('this is ', Registrations);
    if (Registrations.length === 0) {
      throw new HttpException(
        'there is no Rejected Student in this batch',
        404,
      );
    }
    const templatedb = await this._emailTempService.findTemplateByname(
      'Reason Of Rejection',
    );
    // console.log(templatedb.content);

    for (let R of Registrations) {
      // console.log('emails', R.student.user.email);
      const to = R.student.user.email;
      const name = R.student.name;
      const subject = templatedb.subject;
      const reason = R.comments;
      let html = { name, reason };
      const template = templatedb.subject;

      await this._emailTempService.sendDynamicEmail(
        to,
        subject,
        html,
        template,
      );

      // return 'Email sent Successfully';
    }
  }
}
