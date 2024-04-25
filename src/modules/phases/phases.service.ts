import { HttpException, Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { Phase } from './entities/phase.entity';
import { In, Repository } from 'typeorm';
import { Phases } from 'src/db/entities/phases.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phases)
    private readonly phasesRepository: Repository<Phases>,
  ) {}

  async create(createPhaseDto: CreatePhaseDto) {
    const record = await this.phasesRepository.create({
      name: createPhaseDto.name,
      sequence: createPhaseDto.sequence,
    });
    return this.phasesRepository.save(record);
    // console.log(createPhaseDto);
  }

  async findAll() {
    return await this.phasesRepository.find();
  }

  async findOne(Id: string) {
    const phase = await this.phasesRepository.findOne({
      where: {
        id: Id,
      },
    });
    if (!phase) {
      throw new HttpException('given phase not found', 404);
    }
    return phase;
  }

  async findbyname(name: string): Promise<Phases | null> {
    return await this.phasesRepository.findOneBy({ name });
  }

  async update(id: string, updatePhaseDto: UpdatePhaseDto) {
    const phase = await this.phasesRepository.findOneBy({ id });
    // if(phase){
    phase.name = updatePhaseDto.name;
    phase.sequence = updatePhaseDto.sequence;
    return this.phasesRepository.save(phase);
  }

  async findOneByName(name: string): Promise<Phases | undefined> {
    return this.phasesRepository.findOne({ where: { name } });
  }
  // remove(id: string) {
  //   return this.phasesRepository
  //   .createQueryBuilder('phases')
  //   .softDelete()
  //   .where('id = :id', { id: id })
  //   .execute();
  // }
  async lookup() {
    return await this.phasesRepository.find({
      select: ['id', 'name'],
    });
  }

  async recommedNotRecommend() {
    return await this.phasesRepository.find({
      select: ['id', 'name'],
      where: {
        name: In(['Recommended', 'Not Recommended']),
      },
    });
  }

  async joined_notjoined() {
    return await this.phasesRepository.find({
      select: ['id', 'name'],
      where: {
        name: In(['Joined', 'Not Joined']),
      },
    });
  }
}
