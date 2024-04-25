import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, HttpException, HttpStatus, ValidationPipe, UsePipes } from '@nestjs/common';
import { PhaseHistoriesService } from './phase_histories.service';
import { CreatePhaseHistoryDto } from './dto/create-phase_history.dto';
import { UpdatePhaseHistoryDto } from './dto/update-phase_history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PhaseHistory } from 'src/db/entities/phase_history.entity';
import { PHASE_HISTORIES_SERVICE } from 'src/common/constants';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Phase Histories')
@Controller('phase-histories')
export class PhaseHistoriesController {
  constructor(
    @Inject(PHASE_HISTORIES_SERVICE)
    private readonly _phaseHistoriesService: PhaseHistoriesService,
    ) {}

  
  @ApiOperation({ summary: 'Create Phase History'})
  @ApiResponse({
    status:404,
    description:'studentRegistrationId Not Found'
  })
  
  @ApiResponse({
    status:405,
    description:'phseId not found'
  })

  @ApiResponse({
    status:406,
    description:'processedById Obj not found'
  })
  @Post('create')
  async create(@Body() createPhaseHistoryDto: CreatePhaseHistoryDto) {
    // console.log(createPhaseHistoryDto)
    const phaseHistoryRecord = await this._phaseHistoriesService.create(createPhaseHistoryDto);
    const record = {

      id:phaseHistoryRecord.id,
      Comments:phaseHistoryRecord.comments,
      process:phaseHistoryRecord.processed_on,
      processedById: phaseHistoryRecord.processed_by.id,
      studentRegistrationId: phaseHistoryRecord.studentRegistration.id,
      phaseId:phaseHistoryRecord.phases.id,
    }
    return record;
  }

  @ApiOperation({ summary: 'List Phase History'})
  @Get('list')
  findAll() {
    return this._phaseHistoriesService.findAll();
  }

  @ApiOperation({ summary: 'Phase History Pagedata'})
  @Get('pagedata')
  @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PhaseHistory>> {
    if (pageOptionsDto) {
      pageOptionsDto = { page: 1, take: 10, orderBy: '', search: '', skip: 0 };
    }
    return this.pageData(pageOptionsDto);
  }

  async pageData(pageOptionsDto: PageOptionsDto) {
    const pageDto = await this._phaseHistoriesService.getAllPageData(pageOptionsDto);
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Phase History FindOne'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._phaseHistoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Phase History'})
  @ApiResponse({
    status:404,
    description:'student not found'
  })
  
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updatePhaseHistoryDto: UpdatePhaseHistoryDto) {
    return this._phaseHistoriesService.update(id, updatePhaseHistoryDto);
  }

  @ApiOperation({ summary: 'Delete Phase History'})
  @ApiResponse({
    status:404,
    description:'Unable to delete phase_history'
  })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this._phaseHistoriesService.remove(id);
  }
}
