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
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CITY_SERVICE } from 'src/common/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(
    @Inject(CITY_SERVICE)
    private readonly cityService: CityService,
  ) {}

  @ApiOperation({ summary: 'Create Cities'})
  @Post('create')
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @ApiOperation({ summary: 'Cities Lookup'})
  @Get('lookup')
  lookup() {
    return this.cityService.lookup();
  }

  @ApiOperation({ summary: 'Cities List'})
  @Get('list')
  findAll() {
    return this.cityService.findAll();
  }

  @ApiOperation({ summary: 'FindOne City'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Cities'})
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.cityService.remove(id);
  // }
}
