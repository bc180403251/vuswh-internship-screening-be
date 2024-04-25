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
  ParseIntPipe,
  Inject,
  Req,
  UseGuards,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { Semester } from 'src/db/entities/semester.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { ROLES, SEMESTER_SERVICE } from 'src/common/constants';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';
// @ROLES(['Admin', 'Coordinoter'])
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('Semesters')
@ROLES(['admin', 'coordinator'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('semesters')
export class SemestersController {
  constructor(
    @Inject(SEMESTER_SERVICE)
    private readonly semestersService: SemestersService,
  ) {}

  @ApiOperation({ summary: 'Create Semester' })
  @ApiResponse({
    status: 404,
    description: 'Record not saved',
  })
  @ApiResponse({
    status: 200,
    description: 'Semester Created Successfully',
  })
  @Post('create')
  async create(@Body() createSemesterDto: CreateSemesterDto) {
    // return this.semestersService.create(createSemesterDto);
    const CreatedSemester = await this.semestersService.create(
      createSemesterDto,
    );
    // if the object is null then throw exception
    if (!CreatedSemester) {
      throw new HttpException('Record not saved', 404);
    }

    return {
      massage: 'Semester Created Successfully',
    };
  }

  // @ApiOperation({ summary: 'Semesters Lookup' })
  // @Get('lookup')
  // lookup() {
  //   console.log ("hei")
  //   return this.semestersService.lookup();
  // }

  @ApiOperation({ summary: 'Semesters List' })
  @ApiResponse({
    status: 200,
    description: 'List of Semesters',
  })
  @Get('list')
  findAll() {
    return this.semestersService.findAll();
  }

  @ApiOperation({ summary: 'Semesters Pagdata' })
  @ApiResponse({
    status: 200,
    description: 'List of Batches',
    schema: {
      type: 'object',
      properties: {
        pagedata: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            name: { type: 'string', example: 'Fall23' },
            start_date: { type: 'date', example: '2023.07.07' },
            end_date: { type: 'date', example: '2024.07.07' },
            status: { type: 'false', example: 'true' },
          },
        },
      },
    },
  })
  @ROLES(['admin', 'coordinator'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('pagedata')
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: Request,
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
    const pagedata = await this.pageData(pageOptionsDto, req);
    const data = { pagedata };
    return data;
  }
  async pageData(pageOptionsDto: PageOptionsDto, req: Request) {
    const pageDto = await this.semestersService.getAllPageData(
      pageOptionsDto,
      req,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No pageData Record Found', 404);
    }
  }

  @ApiOperation({ summary: 'Semesters Lookup' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        semester: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            name: {
              type: 'string',
              example: 'Fall2023',
            },
          },
        },
      },
    },
  })
  @Get('lookup')
  lookup() {
    return this.semestersService.lookup();
  }

  @ApiOperation({ summary: 'Semesters FindOne' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        semester: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            name: {
              type: 'string',
              example: 'Fall2023',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semestersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Semester' })
  @ApiResponse({
    status: 404,
    description: 'Semester not found',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        semester: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            name: {
              type: 'string',
              example: 'Fall2023',
            },
            startdate: { type: 'date', example: '2023.07.07' },
            enddate: { type: 'date', example: '2023.07.07' },
            is_active: { type: 'boolean', example: 'true' },
          },
        },
      },
    },
  })
  @Get('get_update/:id')
  getUpdateSemesterDetails(@Param('id') id: string) {
    // Assuming you have a method in the service to retrieve Semester details by ID
    return this.semestersService.getUpdateSemesterDetails(id);
  }

  @ApiOperation({ summary: 'Update Semester' })
  @ApiResponse({
    status: 404,
    description: 'Unable to save record',
  })
  @ApiResponse({
    status: 200,
    description: 'Semester Updated Successfully!',
  })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    const semesterUpdated = await this.semestersService.update(
      id,
      updateSemesterDto,
    );

    // see the record saved otherwise throw exception
    if (!semesterUpdated) {
      throw new HttpException('Unable to save record', 404);
    }
    // return semesterUpdated;
    return 'record updated successfully';
  }

  @ApiOperation({ summary: 'Delete Semester' })
  @ApiResponse({
    status: 404,
    description: 'Unable to Delete semester',
  })
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    const deleteSemester = await this.semestersService.remove(id);
    if (!deleteSemester) {
      throw new HttpException('Unable to Delete semester', 404);
    }
    return 'Semester Deleted Successfully';
  }

  @ApiOperation({ summary: 'Activate/Deactivate Semester' })
  @Patch('activate_deactivate/:id')
  activatesemester(@Param('id') id: string) {
    return this.semestersService.activateAndDeactivate(id);
  }
}
