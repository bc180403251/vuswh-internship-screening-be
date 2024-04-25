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
  Req,
  UseGuards,
} from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { degrees } from 'src/db/entities/degree.entity';
import { PageDto } from 'src/common/dto/page.dto';
import { Request } from 'express';
import { DEGREE_SERVICE, ROLES, SUBJECT_SERVICE } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubjectsService } from '../subjects/subjects.service';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';

@ApiTags('Degrees')
@ROLES(['admin', 'coordinator'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('degrees')
export class DegreesController {
  constructor(
    @Inject(DEGREE_SERVICE) private readonly degreesService: DegreesService,
    @Inject(SUBJECT_SERVICE) private readonly subjectsService: SubjectsService,
  ) {}

  @ApiOperation({ summary: 'Get list of subjects' })
  @ApiResponse({
    status: 404,
    description: 'you got list of subjects',
  })
  @Get('get_create')
  async getCreate() {
    return await this.subjectsService.lookup();
  }

  @ApiOperation({ summary: 'Create Degrees' })
  @ApiResponse({
    status: 404,
    description: 'Give subjects are not found',
  })
  @Post('create')
  async create(@Body() createDegreeDto: CreateDegreeDto) {
    const createdrecord = await this.degreesService.create(createDegreeDto);
    if (!createdrecord) {
      throw new HttpException('Record data not saved', HttpStatus.CONFLICT);
    }
    const record = {
      subjects: createdrecord.subjects,
      title: createdrecord.title,
    };
    return record;
  }

  @ApiOperation({ summary: 'Degrees Lookup' })
  @Get('lookup')
  lookup() {
    return this.degreesService.lookup();
  }

  @ApiOperation({ summary: 'Degrees List' })
  @Get('list')
  findAll() {
    return this.degreesService.findAll();
  }

  @ApiOperation({ summary: 'Degrees Pagedata' })
  @Get('pagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: Request,
  ): Promise<PageDto<degrees>> {
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
    return this.pageData(pageOptionsDto, req);
  }

  async pageData(pageOptionsDto: PageOptionsDto, req: Request) {
    const pageDto = await this.degreesService.getAllPageData(
      pageOptionsDto,
      req,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Degrees FindOne' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Degree' })
  @Get('get_update/:id')
  async getUpdateDegreeDetails(@Param('id') id: string) {
    // Assuming you have a method in the service to retrieve degree details by ID
    const degreeUpdate = await this.degreesService.getUpdateDegreeDetails(id);
    const subject = await this.subjectsService.lookup();
    return { degreeUpdate, subject };
  }

  @ApiOperation({ summary: 'Update Degrees' })
  @ApiResponse({
    status: 405,
    description: 'record not found',
  })
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreesService.update(id, updateDegreeDto);
  }

  @ApiOperation({ summary: 'Delete Degrees' })
  @ApiResponse({
    status: 406,
    description: 'Unable to remove degree',
  })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.degreesService.remove(id);
  }
}
