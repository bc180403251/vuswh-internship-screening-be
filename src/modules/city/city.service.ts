import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { cities } from 'src/db/entities/city.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(cities)
    private _cityRepository: Repository<cities>,
  ) {}
  create(createCityDto: CreateCityDto) {
    return this._cityRepository.save(createCityDto);
  }

  findAll() {
    return this._cityRepository.find();
  }

  async getCityById(id: string) {
    return await this._cityRepository.findOne({ where: { id } });
  }

  findOne(id: string) {
    return `This action returns a #${id} city`;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    // return `This action updates a #${id} city`;
    const record = await this._cityRepository.findOne({ where: { id } });
    if (record) {
      record.name = updateCityDto.name;
      return this._cityRepository.save(record);
    } else {
      throw new HttpException('given id not found', HttpStatus.NOT_FOUND);
    }
  }

  // async remove(id: string) {
  //   const city = await this._cityRepository.findOne({ where: { id } });
  //   if (!city) {
  //     throw new HttpException('Given city not exist', HttpStatus.BAD_REQUEST);
  //   }
  //   const record = await this._cityRepository.softDelete(city);
  // }
  lookup() {
    return this._cityRepository.find({
      select: ['id', 'name'],
    });
  }

  async findcityByName(name: string): Promise<cities | null> {
    return await this._cityRepository.findOneBy({ name });
  }
}
