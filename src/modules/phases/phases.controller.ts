import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { PhasesService } from './phases.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { PHASE_SERVICE } from 'src/common/constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Phases')
@Controller('phases')
export class PhasesController {
  constructor(
    @Inject(PHASE_SERVICE)
    private readonly phasesService: PhasesService,
  ) {}

  @ApiOperation({ summary: 'Create Phases'})
  @Post('create')
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }


  @ApiOperation({ summary: 'Phases List'})
  @Get('list')
  findAll() {
    return this.phasesService.findAll();
  }

  @ApiOperation({ summary: 'FindOne'})
  @ApiResponse({
    status: 404,
    description: 'given phase not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Phase'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
    return this.phasesService.update(id, updatePhaseDto);
  }

  // // @ApiOperation({ summary: 'Delete Phase'})
  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.phasesService.remove(id);
  // }
}
