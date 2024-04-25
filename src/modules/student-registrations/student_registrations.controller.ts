import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Query,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudentRegistrationsService } from './student_registrations.service';
import { CreateStudentRegistrationDto } from './dto/create_student_registration.dto';
import { UpdateStudentRegistrationDto } from './dto/update_student_registration.dto';
import {
  BATCH_SERVICE,
  CITY_SERVICE,
  DEGREE_SERVICE,
  EMAILTEMPALTE_SERVICE,
  GRADE_SERVICE,
  PHASE_SERVICE,
  ROLES,
  ROLE_SERVICE,
  STUDENT_REGISTRATION_SERVICE,
  STUDENT_SERVICE,
  SUBJECT_SERVICE,
  USER_SERVICE,
  saltOrRounds,
} from 'src/common/constants';

import { StudentsService } from '../students/students.service';
import { BatchesService } from '../batches/batches.service';
import { UsersService } from '../users/users.service';
import { CityService } from '../city/city.service';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { StudentRegistration } from 'src/db/entities/student_registrations.entity';
import { EntityManager, Repository } from 'typeorm';
import { File } from 'buffer';
import { PhasesService } from '../phases/phases.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Request } from 'express';
import { Response } from 'express';
import { SubjectsService } from '../subjects/subjects.service';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
import { GradesService } from '../grades/grades.service';
import { EmailTemplateService } from '../email.template/email.template.service';
import { Assessment } from 'src/db/entities/assessment.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFinalResultsDto } from './dto/create_final_results.dto';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { promisify } from 'util';
import { exit } from 'process';
import { DegreesService } from '../degrees/degrees.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/db/entities/user.entity';
import { Student } from 'src/db/entities/student.entity';
import { RolesService } from '../roles/roles.service';
import { student_subjects } from 'src/db/entities/Student_Subjects.entity';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';

@ApiTags('Student Registrations')
@Controller('student_registrations')
export class StudentRegistrationsController {
  constructor(
    @Inject(STUDENT_SERVICE)
    private readonly StudentService: StudentsService,
    @Inject(BATCH_SERVICE)
    private readonly batchService: BatchesService,
    @Inject(USER_SERVICE)
    private readonly userService: UsersService,
    @Inject(CITY_SERVICE)
    private readonly cityService: CityService,
    @Inject(STUDENT_REGISTRATION_SERVICE)
    private readonly student_registrationsService: StudentRegistrationsService,
    @InjectRepository(StudentRegistration)
    private _student_registrationRepository: Repository<StudentRegistration>,
    @Inject(PHASE_SERVICE)
    private readonly pahsesService: PhasesService,
    @Inject(SUBJECT_SERVICE)
    private readonly subjectsService: SubjectsService,
    @Inject(GRADE_SERVICE)
    private readonly gradesService: GradesService,
    @Inject(EMAILTEMPALTE_SERVICE)
    private readonly _emailTempService: EmailTemplateService,
    @InjectRepository(Assessment)
    private readonly _assessmentRepository: Repository<Assessment>,
    @Inject(DEGREE_SERVICE)
    private readonly _degreeService: DegreesService,
    @Inject(ROLE_SERVICE)
    private readonly _rolesService: RolesService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthenticationGuard)
  @Get('admin_dashboard')
  async adminDashboard() {
    const admin =
      await this.student_registrationsService.getadminandCoordinatoreDashboards();

    return admin;
  }

  @ApiOperation({ summary: 'Get list of Cities and student data' })
  @ApiResponse({
    status: 404,
    description: 'you got list of cities and student data',
  })
  @ROLES(['student'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_create')
  async getCreate(@Req() { payload }) {
    // console.log(payload);
    const cities = await this.cityService.lookup();
    // const grades = await this.gradesService.lookup();
    const student =
      await this.student_registrationsService.getCreateStudentData(payload);

    return {
      cities: cities,
      student,
      // Grades: grades,
    };
  }

  @ApiOperation({ summary: 'Student registration' })
  @ApiResponse({
    status: 404,
    description: 'Registration failed',
  })
  //Post create method
  @ROLES(['student'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (req, file, cb) => {
          const splitname = file.originalname.split('.');
          const name = splitname[0];
          const ext = splitname[1];
          const newName =
            name.replaceAll(' ', '_') + '_' + Date.now() + '.' + ext;
          cb(null, newName);
        },
      }),
    }),
  )
  async create(
    @Req() { payload },
    @Body() createStudentRegistrationDto: CreateStudentRegistrationDto,
    @UploadedFile()
    CV: // new ParseFilePipeBuilder()
    //   .addFileTypeValidator({
    //     fileType: 'pdf/doc/docx',
    //   })
    //   .addMaxSizeValidator({
    //     maxSize: 1000,
    //   })
    //   .build({
    //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    //   }),
    Express.Multer.File,
  ) {
    // console.log(CV);
    try {
      // console.log(payload);
      const record = await this.student_registrationsService.create(
        payload,
        createStudentRegistrationDto,
        CV,
      );

      // console.log(record);

      return { data: record, message: 'You are Registered Successfully!' };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      fs.unlinkSync(CV.path);
      throw error;
    }
  }
  @ApiOperation({ summary: 'List Of registered students' })
  @Get('list')
  findAll() {
    return this.student_registrationsService.findAll();
  }

  @ApiOperation({ summary: 'Get registered student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of registered student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              cgpa: {
                type: 'string',
                example: 'Batch16',
              },
              is_enrolled_project: {
                type: 'boolean',
                example: 'true',
              },
              student: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  degree: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        example: 'MCS',
                      },
                    },
                  },
                },
              },
              student_subjects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                    },
                    grade: {
                      type: 'string',
                      example: 'A+',
                    },
                    subject: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          example: 'Introduction to Programming',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        batch: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Batch-1',
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('registered_students_pagedata')
  // @UsePipes(ValidationPipe)
  async registeredStudents(
    @Req() req: Request,
    @Res() res: Response,
    @Query() registrationpageOptionsDto: PageOptionsDto,
  ) {
    if (!registrationpageOptionsDto.page) {
      registrationpageOptionsDto.page = 1;
    }
    if (!registrationpageOptionsDto.take) {
      registrationpageOptionsDto.take = 10;
    }
    if (!registrationpageOptionsDto.orderBy) {
      registrationpageOptionsDto.orderBy = '';
    }
    if (!registrationpageOptionsDto.search) {
      registrationpageOptionsDto.search = '';
    }

    const pagedata = await this.registeredPageData(
      registrationpageOptionsDto,
      req,
      res,
    );
    const data = { pagedata };
    return data;
  }

  async registeredPageData(
    registrationpageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto = await this.student_registrationsService.registeredStudents(
      registrationpageOptionsDto,
      req,
      res,
    );
    const batch = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batch });
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({ summary: 'Get rejected student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of rejected student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              cgpa: {
                type: 'string',
                example: 'Batch16',
              },
              is_enrolled_project: {
                type: 'boolean',
                example: 'true',
              },
              student: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  degree: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        example: 'MCS',
                      },
                    },
                  },
                },
              },
              student_subjects: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                    },
                    grade: {
                      type: 'string',
                      example: 'A+',
                    },
                    subject: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          example: 'Introduction to Programming',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        batch: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Batch-1',
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('rejected_students_pagedata')
  // @UsePipes(ValidationPipe)
  async rejectedStudents(
    @Req() req: Request,
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }
    if (pageOptionsDto.page !== 1) {
      pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    }

    const pagedata = await this.rejectedPageData(pageOptionsDto, req, res);
    const data = { pagedata };
    return data;
  }

  async rejectedPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto = await this.student_registrationsService.rejectedStudents(
      pageOptionsDto,
      req,
      res,
    );
    const batch = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batch });
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({ summary: 'Get shortlisted student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of recommended student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              cgpa: {
                type: 'string',
                example: 'Batch16',
              },
              attendance: {
                type: 'string',
                example: 'present',
              },
              testdate: {
                type: 'date',
                example: '2024/01/14',
              },
              testaddress: {
                type: 'string',
                example: 'main bedina road lahore',
              },
              Student: {
                type: 'object',
                properties: {
                  vuid: {
                    type: 'string',
                    example: 'Mc220202075',
                  },
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  degree: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        example: 'MCS',
                      },
                    },
                  },
                  User: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'mc220202075jbi@vu.edu.pk',
                      },
                    },
                  },
                },
              },
              City: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Lahore',
                  },
                },
              },
            },
          },
        },
        batch: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Batch-1',
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('shortlisted_pagedata')
  // @UsePipes(ValidationPipe)
  async shortListedStudents(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }
    if (pageOptionsDto.page !== 1) {
      pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    }
    const pagedata = await this.pageData(pageOptionsDto, req, res);

    // console.log(pagedata);
    const data = { pagedata };

    return data;
  }

  async pageData(pageOptionsDto: PageOptionsDto, req: Request, res: Response) {
    const pageDto = await this.student_registrationsService.shortListedStudents(
      pageOptionsDto,
      req,
      res,
    );
    const batch = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batch });
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({ summary: 'Get assessment student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of recommended student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              batch: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Batch-1',
                  },
                },
              },
              Student: {
                type: 'object',
                properties: {
                  vuid: {
                    type: 'string',
                    example: 'Mc220202075',
                  },
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  degree: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        example: 'MCS',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('assessment_pagedata')
  // @UsePipes(ValidationPipe)
  async AssessmentStudents(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }
    if (pageOptionsDto.page !== 1) {
      pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    }
    const pagedata = await this.assassmentData(pageOptionsDto, req, res);

    // console.log(pagedata);
    const data = { pagedata };

    return data;
  }

  async assassmentData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto =
      await this.student_registrationsService.AssessmentedStudents(
        pageOptionsDto,
        req,
        res,
      );
    const batch = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batch });
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({ summary: 'Get recommended student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of recommended student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              cgpa: {
                type: 'string',
                example: 'Batch16',
              },
              Student: {
                type: 'object',
                properties: {
                  vuid: {
                    type: 'string',
                    example: 'Mc220202075',
                  },
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  degree: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                        example: 'MCS',
                      },
                    },
                  },
                  User: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'mc220202075jbi@vu.edu.pk',
                      },
                    },
                  },
                },
              },
              City: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Lahore',
                  },
                },
              },
              Phases: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Recommended',
                  },
                },
              },
            },
          },
        },
        batch: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Batch-1',
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('recommended_students_pagedata')
  // @UsePipes(ValidationPipe)
  async recommendedStudents(
    @Req() req: Request,
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StudentRegistration>> {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }
    // if (pageOptionsDto.page !== 1) {
    //   pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    // }
    return this.recommendedPageData(pageOptionsDto, req, res);
  }

  async recommendedPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto = await this.student_registrationsService.recommendedStudents(
      pageOptionsDto,
      req,
      res,
    );
    const batches = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batches: batches });
      return pageDto;
    } else {
      throw new HttpException('No Record', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Get invited student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of recommended student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              Student: {
                type: 'object',
                properties: {
                  vuid: {
                    type: 'string',
                    example: 'Mc220202075',
                  },
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  User: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'mc220202075jbi@vu.edu.pk',
                      },
                    },
                  },
                },
              },
              City: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Lahore',
                  },
                },
              },
              Phases: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Recommended',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('invited_students_pagedata')
  // @UsePipes(ValidationPipe)
  async invitedStudents(
    @Req() req: Request,
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StudentRegistration>> {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }
    // if (pageOptionsDto.page !== 1) {
    //   pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    // }
    return this.InvitedPageData(pageOptionsDto, req, res);
  }

  async InvitedPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto = await this.student_registrationsService.invitedStudents(
      pageOptionsDto,
      req,
      res,
    );
    const batches = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batches: batches });
      return pageDto;
    } else {
      throw new HttpException('No Record', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Get joined student pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'You got pagedata of recommended student',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              Student: {
                type: 'object',
                properties: {
                  vuid: {
                    type: 'string',
                    example: 'Mc220202075',
                  },
                  name: {
                    type: 'string',
                    example: 'Jaweria',
                  },
                  User: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'mc220202075jbi@vu.edu.pk',
                      },
                    },
                  },
                },
              },
              City: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Lahore',
                  },
                },
              },
              Phases: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Joined',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('joined_students_pagedata')
  // @UsePipes(ValidationPipe)
  async joinedStudents(
    @Req() req: Request,
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StudentRegistration>> {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }

    return this.joinedPageData(pageOptionsDto, req, res);
  }

  async joinedPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto = await this.student_registrationsService.joinedStudents(
      pageOptionsDto,
      req,
      res,
    );
    const batch = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batch });
      return pageDto;
    } else {
      throw new HttpException('No Record', HttpStatus.NOT_FOUND);
    }
  }

  // passout students

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('passout_students_pagedata')
  // @UsePipes(ValidationPipe)
  async passoutStudents(
    @Req() req: Request,
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StudentRegistration>> {
    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.search) {
      pageOptionsDto.search = '';
    }

    return this.passoutPageData(pageOptionsDto, req, res);
  }

  async passoutPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
    res: Response,
  ) {
    const pageDto = await this.student_registrationsService.passoutStudents(
      pageOptionsDto,
      req,
      res,
    );
    // console.log(pageDto);
    const batch = await this.batchService.lookup();
    if (pageDto) {
      res.send({ pageDto, batch });
      // console.log(pageDto);
      return pageDto;
    } else {
      throw new HttpException('No Record', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Apply eligibility criteria' })
  @ApiResponse({
    status: 404,
    description: 'there is no more Registered  Students',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('apply_eligibility/batchId/:id')
  async applyEligibility(@Param('id') id: string, @Req() { payload }) {
    const record =
      await this.student_registrationsService.applyEligibilityToBatch(
        id,
        payload,
      );
    console.log(payload);
    // console.log('batch is not current')

    return {
      record: record,
      message: 'Eligibility Criteria Applied Successfully!',
    };
  }

  @ApiOperation({ summary: 'Get update student data' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_update/:id')
  async findOne(@Param('id') id: string) {
    const subjectsrecord = await this.subjectsService.lookup();
    // console.log(subjectsrecord);
    const regisrtationrecord =
      await this.student_registrationsService.getUpdateById(id);
    // console.log(regisrtationrecord);
    return {
      Subject: subjectsrecord,
      registration: regisrtationrecord,
    };
  }

  @ApiOperation({ summary: 'Update student registration' })
  @ApiResponse({
    status: 404,
    description: 'Oops failed! try again',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateStudentRegistrationDto: UpdateStudentRegistrationDto,
  ) {
    const record = this.student_registrationsService.update(
      id,
      updateStudentRegistrationDto,
    );
    return {
      record,
      Massage: 'Record update Successfully',
    };
  }

  @ApiOperation({ summary: 'Delete registered student' })
  @ApiResponse({
    status: 405,
    description: 'Unable to delete registered student',
  })
  @ApiOperation({ summary: 'Get attendance' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('attendance/:id')
  async getUpdateAttendance(@Param('id') id: string) {
    const record = await this.student_registrationsService.getUpdateAttendance(
      id,
    );

    const data = {
      id: record.id,
      testdate: record.testdate,
      name: record.student.name,
      vuid: record.student.vuid,
      batch: record.batch.name,
      degree: record.student.degree.title,
      phase: record.phase.name,
    };
    // console.log(record.batch.name);

    return data;
  }

  @ApiOperation({ summary: 'Attendance' })
  @ApiResponse({
    status: 404,
    description: 'Oops failed!',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('attendance/:id')
  async updateAttendance(
    @Param('id') id: string,
    @Body() updateStudentRegistrationDto: UpdateStudentRegistrationDto,
    @Req() { payload },
  ) {
    try {
      const data =
        await this.student_registrationsService.updatePhaseAssessment(
          id,
          updateStudentRegistrationDto,
          payload,
        );
      console.log(payload);

      return { data: data, message: 'Student Attendance marked Successfully!' };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get attendance list' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  // @Get('attendance_list')
  // async getAttendanceList() {
  //   try {
  //     const attendanceList =
  //       await this.student_registrationsService.getAttendanceList();
  //     return {
  //       data: attendanceList,
  //       message: 'Attendance list retrieved successfully',
  //     };
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     throw new HttpException('Failed to retrieve attendance list', 404);
  //   }
  // }
  @ApiOperation({ summary: 'Get test schedule' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiOperation({ summary: 'Create test schedule' })
  @ApiResponse({
    status: 404,
    description: 'Test not schedule try again..',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('create_schedule')
  async createschedule(@Body() createDto: CreateStudentRegistrationDto) {
    const Student = createDto.SRIds;
    const data = await this.student_registrationsService.setTestSchedule(
      Student,
    );
    if (data) {
      const record = data.map((S) => {
        const registration = {
          ...S,
          testdate: createDto.testdate,
          testaddress: createDto.testaddress,
        };

        this._student_registrationRepository.save(registration);
      });
      return { record, message: 'Test Scheduled Successfully!' };
    } else {
      throw new HttpException('record not found', 404);
    }
  }

  @ApiOperation({ summary: 'Get emails' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('emails/:id')
  getemails(@Param('id') id: string) {
    return this.batchService.getEmailsThroughBatchId(id);
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_sendmailtoshortlist')
  async getSendemailShortlist() {
    return await this._emailTempService.findTemplateByname(
      'Invitation For Test',
    );
  }

  @ApiOperation({ summary: 'Send email for shortlisted students' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('send_emails_for_shortlisted')
  async sendemailsforshortlisted(
    @Body() createDto: CreateStudentRegistrationDto,
  ) {
    const emailsids = createDto.SRIds;

    const templatedb = await this.getSendemailShortlist();

    const studentmails =
      await this.student_registrationsService.getEmailsBySRIDs(emailsids);

    if (studentmails) {
      for (let E of studentmails) {
        const to = E.student.user.email;
        const studentname = E.student.name;
        const testdate = E.testdate;
        const testaddress = E.testaddress;
        const subject = templatedb.subject;
        const template = templatedb.subject;

        let html = {
          name: to,
          test_date: testdate,
          test_address: testaddress,
          Body: createDto.mailbody,
        };
        // const template= template.content

        const mail = await this._emailTempService.sendDynamicEmail(
          to,
          subject,
          html,
          template,
        );

        return { mail, message: 'Email Sent Successfully!' };
      }
    } else {
      throw new HttpException('There is NO Shortlisted Student', 404);
    }
  }

  // @ApiOperation({ summary: 'Send email for rejected students' })
  // @ApiResponse({
  //   status: 404,
  //   description: 'No Record',
  // })

  @ApiOperation({ summary: 'Get and set student result' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_set_student_result/:id')
  async getsetResult(@Param('id') id: string) {
    const phase = await this.pahsesService.recommedNotRecommend();
    const data = await this.student_registrationsService.getsetStudentResult(
      id,
    );

    return {
      phase,
      data,
    };
  }

  @ApiOperation({ summary: 'Set result' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @UseGuards(AuthenticationGuard)
  @Patch('set_result/:id')
  async setResult(
    @Param('id') id: string,
    @Body() updateRegistrationDto: UpdateStudentRegistrationDto,
    @Req() { payload },
  ) {
    const data = await this.student_registrationsService.setStudentResult(
      id,
      updateRegistrationDto,
      payload,
    );
    // const record = {};
    return { data, message: 'Result Entered Successfully!' };
  }

  @ApiOperation({ summary: 'Get through batch' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('emails_through_batch/:id')
  getemailsthroughtBatch(@Param('id') id: string) {
    const template = this._emailTempService.findTemplateByname(
      'Invitation for Joining',
    );
    if (!template) {
      throw new HttpException('template Not found', 404);
    }
    const data = this.batchService.getEmailsThroughBatch(id);

    return data;
  }

  @ApiOperation({
    summary: 'Send email to the recommended students through batch',
  })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('send_email_to_recommended_through_batch/:id')
  sendEmailToRecommendedThroughBatch(
    @Param('id') id: string,
    @Body() createregistrationDto: CreateStudentRegistrationDto,
    @Req() { payload },
  ) {
    try {
      const record =
        this.student_registrationsService.sendInvitationEmailsThroughBatch(
          id,
          createregistrationDto,
          payload,
        );

      return { record, message: 'Invitaion Sent Successfully!' };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_send_to_selected')
  getSendtoSelected() {
    const template = this._emailTempService.findTemplateByname(
      'Invitation for Joining',
    );
    if (!template) {
      throw new HttpException('Template not found', 404);
    }
    return template;
  }

  @ApiOperation({ summary: 'Send email to selected students' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('sendemailtoselectedstudents')
  async sendEmailToselectedRecommendedStudents(
    @Body() updateregistrationDto: UpdateStudentRegistrationDto,
    @Req() { payload },
  ) {
    const students = updateregistrationDto.SRIds;

    const registrations =
      await this.student_registrationsService.sendInvitationemialstoSelectedStudents(
        students,
      );

    const templatedb = await this._emailTempService.findTemplateByname(
      'Invitation for Joining',
    );

    // console.log(registrations);

    if (registrations) {
      for (let R of registrations) {
        const to = R.student.user.email;
        const studentname = R.student.name;
        const subject = templatedb.subject;
        let html = { name: studentname, Body: updateregistrationDto.mailbody };
        const template = templatedb.subject;

        await this._emailTempService.sendDynamicEmail(
          to,
          subject,
          html,
          template,
        );

        let comments = 'Student Invited For Joining';
        await this.student_registrationsService.updatePhase(
          R,
          'invited',
          comments,
          payload,
        );
        return 'Invitation sent Successfully!';
      }
    }
  }
  //update  student phase when he/she  come for joining
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_updatephase/:id')
  async getUpdatePhase(@Param('id') id: string) {
    const data = await this.student_registrationsService.getupdatestudentphase(
      id,
    );
    const phases = await this.pahsesService.joined_notjoined();

    return { student: data, phases: phases };
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('update_phaseto_joined/notjoined/:id')
  async updatePhase(
    @Param('id') id: string,
    @Body() UpdateStudentRegistrationDto: UpdateStudentRegistrationDto,
  ) {
    const data = await this.student_registrationsService.updatephase(
      id,
      UpdateStudentRegistrationDto,
    );

    //  console.log(data)

    return { data, message: 'Phase Update Successfully!' };
  }
  // get and set final results of the student who are joined
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('get_set_finalResutl/:id')
  async getSetFinalResult(@Param('id') id: string) {
    const student = await this.student_registrationsService.getSetFinalResults(
      id,
    );

    return student;
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('set_final_result/:id')
  async setFinalResult(
    @Param('id') id: string,
    @Body() creatresultdto: CreateFinalResultsDto,
    @Req() { payload },
  ) {
    const setResult = await this.student_registrationsService.setFinalResult(
      id,
      creatresultdto,
      payload,
    );

    return {
      setResult,
      message: `Student Result is created and Student's phase is: ${setResult.phase.name}`,
    };
  }
  // view joined student Result
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('view_joindedStudent/:id')
  async viewJoinedtudnet(@Param('id') id: string) {
    const joinedStudent =
      await this.student_registrationsService.viewjoinedStudent(id);
    return joinedStudent;
  }
  // view passout studnet Result
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('view_PassoutStudent/:id')
  async viewPassoutstudnet(@Param('id') id: string) {
    const passoutStudent =
      await this.student_registrationsService.viewPassoutStudent(id);
    return passoutStudent;
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('quite_student/:id')
  async quiteStudent(@Param('id') id: string, @Req() { payload }) {
    const student = await this.student_registrationsService.quiteStudent(
      id,
      payload,
    );
    return { student, message: 'Phase Update Successfully' };
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('CoordinatorDashboard')
  async CoordinatorDashboard() {
    const Coordinator =
      await this.student_registrationsService.getadminandCoordinatoreDashboards();

    return Coordinator;
  }

  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('absentShortlistedTorejected/:id')
  async absentDhortlisted(@Param('id') id: string, @Req() { payload }) {
    // console.log(payload);
    try {
      const regsitration =
        await this.student_registrationsService.shortlistedAbsentMoveToRejected(
          id,
          payload,
        );

      return {
        regsitration,
        message: 'Student moved from Shortlisted To Rejected Due to Absence',
      };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  @Post('ImportStudent')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/imports',
        filename: (req, file, cb) => {
          const splitname = file.originalname.split('.');
          const name = splitname[0];
          const ext = splitname[1];
          const newName =
            name.replaceAll(' ', '_') + '_' + Date.now() + '.' + ext;
          cb(null, newName);
        },
      }),
    }),
  )
  async importstudents(
    @Body() CreateStudentRegistrationDto: CreateStudentRegistrationDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const readXlsxFile = require('read-excel-file/node');

    const filepath = file.path;

    readXlsxFile(fs.createReadStream(filepath)).then(async (rows) => {
      let header = rows.shift();

      for (let i = 1; i < rows.length; i++) {
        // let grade = [];
        const row = rows[i];
        const email = row[0];
        const username = email.split('@')[0];
        const vuid = row[1];
        const fullname = row[2];
        const phone = row[5];
        const cnic = row[3];
        const city = row[4];
        const degree = row[6];
        const project = row[7];
        const cgpa = row[13];
        const cv = row[14];

        let is_enrolled_project = false;
        if (project.value == 0 || false || 'no' || 'No') {
          is_enrolled_project = false;
        } else {
          is_enrolled_project = true;
        }
        let ccgpa = 0;
        if (cgpa.value == null) {
          ccgpa = 0;
        } else {
          ccgpa = cgpa;
        }

        // console.log(row);

        const degreename = await this._degreeService.finddegreeByName(degree);
        if (!degreename) {
          throw new HttpException('Degree not Found', 404);
        }
        const cityname = await this.cityService.findcityByName(city);
        if (!cityname) {
          throw new HttpException('City noy found', 404);
        }
        const role = await this._rolesService.findRoleByName('student');
        if (!role) {
          throw new HttpException('Role Not found', 404);
        }
        const batch = await this.batchService.findCurrentBatch(
          CreateStudentRegistrationDto.batchId,
        );
        if (!batch) {
          throw new HttpException('batch not Found', 404);
        }
        // const subject= await this.subjectsService.findSubjectBycode()

        const phaseObj = await this.pahsesService.findbyname('Registered');
        if (!phaseObj) {
          throw new HttpException('Given Phase Not Found', 404);
        }
        try {
          await this.entityManager.transaction(async (manager) => {
            const password = 'qwerty@1122';

            const hashedPassword = await bcrypt.hash(password, saltOrRounds);

            const userobj = new User();
            userobj.email = email;
            userobj.username = username;
            userobj.fullname = fullname;
            userobj.phone = phone;
            userobj.is_active = true;
            userobj.is_validated = true;
            userobj.password = hashedPassword;
            userobj.roles = [role];

            await manager.save(userobj);

            const userStudentObj = new Student();
            userStudentObj.name = userobj.fullname;
            userStudentObj.cnic = cnic;
            userStudentObj.user = userobj;
            userStudentObj.degree = degreename;
            userStudentObj.phone = userobj.phone;
            userStudentObj.vuid = vuid;

            await manager.save(userStudentObj);

            const student_registration = new StudentRegistration();
            student_registration.base_city = cityname;
            student_registration.cgpa = ccgpa;
            student_registration.is_enrolled_project = is_enrolled_project;
            student_registration.is_open = true;
            student_registration.student = userStudentObj;
            student_registration.cv = cv;
            student_registration.phase = phaseObj;
            student_registration.batch = batch;
            student_registration.processed_on = new Date();

            await manager.save(student_registration);

            for (let j = 8; j <= 12; j++) {
              const subj = header[j];
              // console.log(subj);
              const subjobj = await this.subjectsService.findSubjectBycode(
                subj,
              );

              if (!subjobj) {
                throw new HttpException('subject not found', 404);
              }
              // console.log('------------------------------------');

              const subj_grade = row[j];
              // console.log(subj_grade);
              // break;
              const student_subject = new student_subjects();
              student_subject.student_registration = student_registration;
              student_subject.grade = subj_grade;
              student_subject.subject = subjobj;

              await manager.save(student_subject);
            }
            return { message: 'Student Registrations Imported Successfully' };
          });
        } catch (error) {
          if (error) {
            throw new HttpException(error.message, 404);
          }
          fs.unlinkSync(file.path);
          throw error;
        }
      }
    });
  }

  @Post('send_email_to_Rejected_Student_through_batch/:id')
  async sendtorejectd(@Param('id') id: string) {
    try {
      const sendemils =
        this.student_registrationsService.sendRejectionEmailsThroughBatch(id);

      return sendemils;
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }
}
