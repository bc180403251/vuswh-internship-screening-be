import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EligibilityCriteriasService } from './eligibility_criterias.service';
import { CreateEligibilityCriteriaDto } from './dto/create-eligibility_criteria.dto';
import { UpdateEligibilityCriteriaDto } from './dto/update-eligibility_criteria.dto';
import {
  BATCH_SERVICE,
  DEGREE_SERVICE,
  ELIGIBILITYCRITERIA_SERVICE,
  GRADE_SERVICE,
  ROLES,
} from 'src/common/constants';
import { BatchesService } from '../batches/batches.service';
import { DegreesService } from '../degrees/degrees.service';
import { GradesService } from '../grades/grades.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { EligibilityCriteria } from 'src/db/entities/eligibility_criteria.entity';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';

@ApiTags('Eligibility Criterias')
@ROLES(['admin', 'coordinator'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('eligibility_criterias')
export class EligibilityCriteriasController {
  constructor(
    @Inject(ELIGIBILITYCRITERIA_SERVICE)
    private readonly eligibilityCriteriasService: EligibilityCriteriasService,
    @Inject(BATCH_SERVICE)
    private readonly _BatchesService: BatchesService,
    @Inject(DEGREE_SERVICE)
    private readonly _DegreesService: DegreesService,
    @Inject(GRADE_SERVICE)
    private readonly gradesService: GradesService,
  ) {}

  @ApiOperation({ summary: 'Find degree Criteria' })
  @Get('get_create_degree')
  async lookup() {
    const degree = await this._DegreesService.lookup();
    // const batches = await this._BatchesService.lookup();
    return {
      degrees: degree,
      // batches: batches,
    };
  }
  @Get('get_degreesub/:id')
  degreeSub(@Param('id') id: string) {
    const degreeSub = this._DegreesService.findOne(id);
    return degreeSub;
  }

  @ApiOperation({ summary: 'Define Eligibility Criteria' })
  @ApiResponse({
    status: 404,
    description: 'batchObj Not Found',
  })
  @Post('create')
  async create(
    @Body() createEligibilityCriteriaDto: CreateEligibilityCriteriaDto,
  ) {
    // Call the service to create eligibility criteria
    const eligibilityCriteria = await this.eligibilityCriteriasService.create(
      createEligibilityCriteriaDto,
    );

    // Return a success message along with the created eligibility criteria
    return {
      message: 'EligibilityCriteria Created Successfully!',
      data: eligibilityCriteria, // Include the created eligibility criteria
    };
  }

  @ApiOperation({ summary: 'Eligibility Criteria List' })
  @Get('list')
  findAll() {
    return this.eligibilityCriteriasService.findAll();
  }

  @Get('pagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(@Query() pageOptionsDto: PageOptionsDto) {
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
    const batch = await this._BatchesService.lookup();
    const data = await this.pageData(pageOptionsDto);
    return { data, batch };
  }

  async pageData(pageOptionsDto: PageOptionsDto) {
    const pageDto = await this.eligibilityCriteriasService.getAllPageData(
      pageOptionsDto,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({ summary: 'FindOne' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.eligibilityCriteriasService.findOne(id);
  }

  @ApiOperation({ summary: 'Find subjects Criteria' })
  @Get('subjects_criteria/degree_id/:id')
  async findSubjectCriteria(@Param('id') id: string) {
    try {
      const degreeSub = await this._DegreesService.findOneBy(id);
      const grades = await this.gradesService.lookup();

      return {
        grades,
        degreeSub,
      };
    } catch (error) {
      // Handle errors appropriately (log, return error response, etc.)
      // console.error('Error in findSubjectCriteria:', error);
      throw error;
    }
  }

  @Get('get_update/:id')
  async getUpdate(@Param('id') id: string) {
    const critera = await this.eligibilityCriteriasService.getUpdate(id);
    const degree = await this._DegreesService.findOne(id);

    return {
      critera,
      degree,
    };
  }

  @ApiOperation({ summary: 'Update Eligibility Criteria' })
  @ApiResponse({
    status: 404,
    description: 'Given Roles not Exists',
  })
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateEligibilityCriteriaDto: UpdateEligibilityCriteriaDto,
  ) {
    const result = await this.eligibilityCriteriasService.update(
      id,
      updateEligibilityCriteriaDto,
    );
    return {
      message: 'Eligibility criteria updated successfully',
      data: result,
    };
  }

  @ApiOperation({ summary: 'Delete Eligibility Criteria' })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.eligibilityCriteriasService.remove(id);
  }

  @Get('viewCriteria/:id')
  async viewCriteria(@Param('id') id: string) {
    const criteria = await this.eligibilityCriteriasService.viewCriteria(id);

    if (!criteria) {
      throw new HttpException('Eligibility Criteria Not Found', 404);
    }
    return criteria;
  }
}
