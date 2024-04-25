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
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Permission } from 'src/db/entities/permission.entity';
import { Batch } from 'src/db/entities/batch.entity';
import { BATCH_SERVICE, ROLES, SEMESTER_SERVICE } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SemestersService } from '../semesters/semesters.service';
import { createTestWieghtagedto } from './dto/create-test-weightage.dto';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { Role } from 'src/db/entities/role.entity';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';

@ApiTags('Batches')
@ROLES(['admin', 'coordinator'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('batches')
export class BatchesController {
  constructor(
    @Inject(BATCH_SERVICE) private readonly batchesService: BatchesService,
    @Inject(SEMESTER_SERVICE)
    private readonly semesterService: SemestersService,
  ) {}

  @ApiOperation({ summary: 'Create Batches' })
  @ApiResponse({
    status: 404,
    description: 'failed request',
  })
  @ApiResponse({
    status: 200,
    description: 'You got two lists of Semesters',
    schema: {
      type: 'object',
      properties: {
        startInSemester: {
          type: 'array', // Change the type to 'array'
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Fall23',
              },
            },
          },
        },
        endInSemester: {
          type: 'array', // Change the type to 'array'
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Fall23',
              },
            },
          },
        },
      },
    },
  })
  @Get('create')
  async getCreate() {
    const semester = await this.semesterService.lookup();
    if (!semester) {
      throw new HttpException('failed request', 404);
    }
    return {
      startInSemester: semester,
      endInSemester: semester,
    };
  }

  @ApiOperation({ summary: 'Create Batches' })
  @ApiResponse({
    status: 404,
    description: 'failed request: try again to create batch....',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch created successfully!',
  })
  @Post('create')
  async create(@Body() createBatchDto: CreateBatchDto) {
    const createdRecord = await this.batchesService.create(createBatchDto);
    if (!createdRecord) {
      throw new HttpException(
        'failed request: try again to create batch....',
        404,
      );
    }
    return { batch: createdRecord, message: 'Batch created Successfully!' };
  }

  @ApiOperation({ summary: 'Batches Lookup' })
  @ApiResponse({
    status: 200,
    description: 'You got two lists of Semesters',
    schema: {
      type: 'object',
      properties: {
        Batches: {
          type: 'array', // Change the type to 'array'
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Batch16',
              },
            },
          },
        },
      },
    },
  })
  @Get('lookup')
  lookup() {
    return this.batchesService.lookup();
  }

  // @ApiOperation({ summary: 'Get batch criteria' })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Batch not found! try again...',
  // })
  // @Get('get_batch_criterias/:id')
  // async find(@Param('id') id: string) {
  //   const record = await this.batchesService.getBatchCriterias(id);
  //   if (!record) {
  //     throw new HttpException('Batch not found! try again...', 400);
  //   }
  //   return record;
  // }
  @ApiOperation({ summary: 'Batches Pagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
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
            name: { type: 'string', example: 'Batch16' },
            start_date: { type: 'date', example: '2023.07.07' },
            end_date: { type: 'date', example: '2024.07.07' },
            startInSemester: { type: 'string', example: 'Fall23' },
            endInSemester: { type: 'string', example: 'Spring24' },
            status: { type: 'false', example: 'true' },
          },
        },
      },
    },
  })
  @Get('pagedata')
  async getAllPageData(
    @Req() req: Request,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Batch>> {
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

    return this.pageData(pageOptionsDto, req);
  }
  async pageData(pageOptionsDto: PageOptionsDto, req: Request) {
    const pageDto = await this.batchesService.getAllPageData(
      pageOptionsDto,
      req,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({ summary: 'Batches List' })
  @ApiResponse({
    status: 404,
    description: 'list of batches not found',
  })
  @Get('list')
  async findAll() {
    const batchlist = await this.batchesService.findAll();
    if (!batchlist) {
      throw new HttpException('list of batches not found', 404);
    }
    return batchlist;
  }

  @ApiOperation({ summary: 'FindOne' })
  @ApiResponse({
    status: 404,
    description: 'Batch not found..',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const batch = await this.batchesService.findOne(id);
      if (!batch) {
        throw new HttpException('Batch not found..', 404);
      }
      return batch;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @ApiOperation({ summary: 'Get update Batch' })
  @ApiResponse({
    status: 404,
    description: 'batch not found',
  })
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
            name: { type: 'string', example: 'Batch16' },
            start_date: { type: 'date', example: '2023.07.07' },
            end_date: { type: 'date', example: '2024.07.07' },
            startInSemester: { type: 'string', example: 'Fall23' },
            endInSemester: { type: 'string', example: 'Spring24' },
            status: { type: 'false', example: 'true' },
            Registration: { type: 'false', example: 'true' },
          },
        },
      },
    },
  })
  @Get('get_update/:id')
  getUpdateBatchDetails(@Param('id') id: string) {
    const batchRecord = this.batchesService.getUpdateBatchDetails(id);
    return batchRecord;
  }

  @ApiOperation({ summary: 'Update Batch' })
  @ApiResponse({
    status: 404,
    description: 'Failed to update batch. Please try again.',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch Date Updated Successfully!',
  })
  @ApiResponse({
    status: 404,
    description: 'Batch not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch Updated Successfully!',
  })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    try {
      const BatchUpdated = await this.batchesService.update(id, updateBatchDto);

      return 'Batch Date Updated Successfully!';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @ApiOperation({ summary: 'Delete Batch' })
  @ApiResponse({
    status: 404,
    description: 'Unable to delete the record, try Later!...',
  })
  @ApiResponse({
    status: 200,
    description: 'Batch Deleted Successfully!',
  })
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    const deleteBatch = await this.batchesService.remove(id);
    if (!deleteBatch) {
      throw new HttpException(
        'Unable to delete the record, try Later!...',
        404,
      );
    }
    return 'Batch Deleted Successfully!';
  }
  @ApiOperation({ summary: 'Activate/Deactivate Batch' })
  @ApiResponse({
    status: 200,
    description: 'batch is activated',
  })
  @ApiResponse({
    status: 200,
    description: 'batch is Deactivated',
  })
  @Patch('activate_deactivate/:id')
  activatebatch(@Param('id') id: string) {
    return this.batchesService.activateAndDeactivate(id);
  }

  @Get('getset_testweightage/:id')
  async getsetTestweightage(@Param('id') id: string) {
    const batch = await this.batchesService.getsetweightageCritera(id);

    if (batch) {
      return batch;
    } else {
      throw new HttpException('batch is not active', 404);
    }
  }
  // define the assessment  mark of  a particular batch  which is active
  @ApiOperation({ summary: 'Create test weightage' })
  @ApiResponse({
    status: 200,
    description: 'test weightage',
    schema: {
      type: 'object',
      properties: {
        test_total_marks: {
          type: 'number',
          example: '100',
        },
        interview_total_marks: {
          type: 'number',
          example: '100',
        },
        test_weightage: {
          type: 'number',
          example: '40',
        },
        interview_weightage: {
          type: 'number',
          example: '60',
        },
      },
    },
  })
  @Post('test_weightage/:id')
  async enterTestWeightage(
    @Param('id') id: string,
    @Body() createtestWieghtageDto: createTestWieghtagedto,
  ) {
    try {
      const result = await this.batchesService.entertestweightage(
        id,
        createtestWieghtageDto,
      );
      return {
        message: 'Testweightage marks entered successfully',
      };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  @Get('view_batch_assessment/:id')
  async viewBatchAssessment(@Param('id') id: string) {
    const batch = await this.batchesService.viewBatchAssessment(id);

    if (batch.assessments === null) {
      throw new HttpException('batch assessment is not defined', 404);
    }

    return batch;
  }
}
