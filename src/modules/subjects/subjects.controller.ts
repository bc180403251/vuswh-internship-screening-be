import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpStatus,
  Query,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ROLES, SUBJECT_SERVICE } from 'src/common/constants';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { Subject } from 'src/db/entities/subject.entity';
import { PageDto } from 'src/common/dto/page.dto';
import { lookup } from 'dns';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';
// import { Subject } from 'rxjs';
@ApiTags('Subjects')
@ROLES(['admin', 'coordinator'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(
    @Inject(SUBJECT_SERVICE) private readonly subjectsService: SubjectsService,
  ) {}

  @ApiOperation({ summary: 'Create Subjects' })
  @Post('create')
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    const record = await this.subjectsService.create(createSubjectDto);
    return { record: record, message: 'Subject Added Successfully!' };
  }
  @ApiOperation({ summary: 'PageData' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @Get('pagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Subject>> {
    if (pageOptionsDto) {
      pageOptionsDto = { page: 1, take: 10, orderBy: '', search: '', skip: 0 };
    }
    return this.pageData(pageOptionsDto);
  }

  async pageData(pageOptionsDto: PageOptionsDto) {
    const pageDto = await this.subjectsService.getAllPageData(pageOptionsDto);
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({
    summary: 'Lookup',
  })
  @Get('lookup')
  lookup() {
    return this.subjectsService.lookup();
  }

  @ApiOperation({ summary: 'list of Subjects' })
  @Get('list')
  findAll() {
    return this.subjectsService.findAll();
  }
  @ApiOperation({ summary: 'FindOne' })
  @ApiResponse({ status: 404, description: 'Subject Not Found' })
  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get update subject' })
  @ApiResponse({
    status: 404,
    description: 'you get update subject',
  })
  @Get('get_update/:id')
  getupdate(@Param('id') id: string) {
    return this.subjectsService.getupdate(id);
  }

  @ApiOperation({ summary: 'update Subject' })
  @ApiResponse({ status: 402, description: 'Subject not Exist' })
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @ApiOperation({ summary: 'Delete Subject' })
  @ApiResponse({
    status: 403,
    description: 'Record not found Unable to Delete',
  })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}
