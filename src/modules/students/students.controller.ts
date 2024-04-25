import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  Inject,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from 'src/db/entities/student.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { DegreesService } from '../degrees/degrees.service';
import { Request, RequestParamHandler } from 'express';
// import { DEGREE_SERVICE, ROLE_SERVICE, STUDENT_SERVICE } from 'src/common/constants';
// import { RolesService } from '../roles/roles.service';
import {
  DEGREE_SERVICE,
  ROLES,
  ROLE_SERVICE,
  STUDENT_SERVICE,
} from 'src/common/constants';
import { RolesService } from '../roles/roles.service';
// import { EmailDomainValidationPipe } from 'src/common/email-domain-validation/email-domain-validation.pipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { count } from 'console';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';
// import { EmailDomainValidationPipe } from 'src/common/email-domain-validation/email-domain-validation.pipe';
@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(
    @Inject(STUDENT_SERVICE)
    private readonly studentsService: StudentsService,
    @Inject(DEGREE_SERVICE)
    private readonly degreeService: DegreesService,

    @Inject(ROLE_SERVICE)
    private readonly rolesService: RolesService,
  ) {}

  @ApiOperation({ summary: 'Get list of Degrees' })
  @ApiResponse({
    status: 404,
    description: 'you got list of degrees',
  })
  @Get('create')
  async getcreate() {
    const degreeRecords = await this.degreeService.lookup();
    return {
      degrees: degreeRecords,
    };
  }

  @ApiOperation({ summary: 'Student SignUp' })
  @ApiResponse({
    status: 400,
    description: 'Given Roles Not Found',
  })
  @ApiResponse({
    status: 401,
    description: 'Given Degree Not Found',
  })
  @ApiResponse({
    status: 200,
    description: 'Student Created Successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Duplicate Entry',
  })
  @Post('create')
  @UsePipes(ValidationPipe)
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Req() req: Request,
  ) {
    const protocol = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    //: Promise<RoleEntity>
    const role = await this.rolesService.findRoleByName('student');
    // const degree = await this.degreeService.findById(createStudentDto.degreeId)
    const degree = await this.degreeService.findOne(createStudentDto.degreeId);

    // console.log(role);

    if (!role) {
      throw new HttpException('Given Role Not Found', 404);
    }

    if (!degree) {
      throw new HttpException('Given Degree Not Found', 404);
    }

    createStudentDto['role'] = role;
    createStudentDto['degree'] = degree;

    const user = await this.studentsService.createStudent(
      createStudentDto,
      protocol.slice(7),
    );
    // if (user) {
      return {
        user: user,
        message: 'Student Created Successfully',
        status: 200,
      };
    // }
    // throw new HttpException('Record not saved', 404);

    return {
      user: user,
      message: 'Student Created Successfully',
      status: 200,
    };
  }

  @ROLES(['student'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('StudentDashboard')
  async studentDashboard(@Req() { payload }) {
    // console.log(payload);
    const record = await this.studentsService.studentDashboard(payload);

    // const data = {
    //   activeBatches: record.activebatch,
    //   openBatchForRegistration: record.batchCriteria,
    //   studentRegistrationcount: record.Registrations,
    //   studentRegistrationHistory: record.registationHistory,
    // };

    return record; // returning 'data' instead of 'record'
  }

  @ApiOperation({ summary: 'Get Pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('studentPagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: Request,
  ): Promise<PageDto<Student>> {
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
    const pagedata = await this.pageData(pageOptionsDto, req);
    return pagedata;
  }

  async pageData(pageOptionsDto: PageOptionsDto, req: Request) {
    const pageDto = await this.studentsService.getAllPageData(
      pageOptionsDto,
      req,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No pageData Record Found', 404);
    }
  }

  @ApiOperation({ summary: 'Lookup' })
  @Get('lookup')
  lookup() {
    return this.studentsService.lookup();
  }

  @ApiOperation({ summary: 'List Of Students' })
  @Get('list')
  findAll() {
    return this.studentsService.findAll();
  }

  @ApiOperation({ summary: 'Find One Student' })
  @ApiResponse({ status: 404, description: 'Record Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Student' })
  @ApiResponse({
    status: 405,
    description: 'Student Not Found',
  })
  @ApiResponse({
    status: 200,
    description: 'Student Update Successfully',
  })
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    const student = this.studentsService.update(id, updateStudentDto);

    return {
      student,
      status: 200,
      massage: 'Student Update Successfully',
    };
  }

  @ApiOperation({ summary: 'Delete Student' })
  @ApiResponse({ status: 405, description: 'Unable to delete Student' })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  // @ApiOperation({ summary: 'Get student data' })
  // @ApiResponse({
  //   status: 404,
  //   description: 'you get student data successfully!',
  // })
  // @Get('student_data/:id')
  // async studentData(@Param('id') id: string) {
  //   const data = await this.studentsService.getstudentbyId(id);
  //   return data;
  // }
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('student_registration_phaseHistory/:id')
  async studentData(@Param('id') id: string) {
    const data = await this.studentsService.viewRegistrationHistory(id);
    return data;
  }
}
