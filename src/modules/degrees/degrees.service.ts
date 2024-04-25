import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { degrees } from 'src/db/entities/degree.entity';
import { In, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { Request } from 'express';
import { SUBJECT_SERVICE } from 'src/common/constants';
import { SubjectsService } from '../subjects/subjects.service';
import { Subject } from 'src/db/entities/subject.entity';

@Injectable()
export class DegreesService {
  constructor(
    @InjectRepository(degrees)
    private readonly _degreeRepository: Repository<degrees>,
    @Inject(SUBJECT_SERVICE)
    private readonly _subjectsSurvice: SubjectsService,
  ) {}
  async create(createDegreeDto: CreateDegreeDto) {
    // console.log(createDegreeDto);
    const subject = await this._subjectsSurvice.getSubjetsByIds(
      createDegreeDto.subjectsIDs,
    );
    if (subject.length !== createDegreeDto.subjectsIDs.length) {
      throw new HttpException('Give subjects are not found', 404);
    }

    const record = this._degreeRepository.create({
      subjects: subject,
      title: createDegreeDto.title,
    });
    // return 'This action adds a new degree';
    return this._degreeRepository.save(record);
  }

  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
  ): Promise<PageDto<degrees>> {
    const queryBuilder = this._degreeRepository
      .createQueryBuilder('degree')
      .leftJoinAndSelect('degree.subjects', 'subjects');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('degree.title', pageOptionsDto.order);
        break;
      case 'title':
        queryBuilder.orderBy('degree.title', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('degree.title', pageOptionsDto.order);
        break;
    }

    queryBuilder.select([
      'degree.id',
      'degree.title',
      'subjects.id',
      'subjects.title',
    ]); // added selection

    if (req.query.search) {
      queryBuilder.andWhere('degree.title LIKE :search ', {
        search: `%${req.query.search}%`,
      });
    }
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<degrees>(entities, pageMetaDto);
  }

  // async lookup() {
  //   const data = await this._degreeRepository.find({
  //     select: ['id', 'title'],

  //   });
  //   // console.log(data);
  //   return data;
  // }
  async lookup() {
    const data = await this._degreeRepository.find({
      select: ['id', 'title'],
      relations: ['subjects'],
    });
    // console.log(data);
    return data;
  }

  findAll() {
    return this._degreeRepository.find();
  }

  async findOne(id: string) {
    const degree = await this._degreeRepository.findOne({
      where: { id },
      relations: ['subjects'],
    });
    return degree;
  }

  // findById(id: string) {
  //   return this._degreeRepository.findBy({ id });
  //   // return "this will return findbyone"
  // }

  async findOneBy(id: string): Promise<degrees> {
    return this._degreeRepository
      .createQueryBuilder('degree')
      .leftJoinAndSelect('degree.subjects', 'subjects')
      .where('degree.id = :id', { id })
      .select(['degree.id', 'degree.title', 'subjects.id', 'subjects.title'])
      .getOne();
  }

  async getUpdateDegreeDetails(id: string) {
    const degree = await this._degreeRepository
      .createQueryBuilder('degree')
      .select(['degree.id', 'degree.title'])
      .where('degree.id = :id', { id })
      .getOne();

    if (!degree) {
      throw new NotFoundException('Degree not found');
    }

    return degree;
  }

  async update(id: string, updateDegreeDto: UpdateDegreeDto) {
    const record = await this._degreeRepository.findOneBy({ id });
    const subjects = await this._subjectsSurvice.getSubjetsByIds(
      updateDegreeDto.subjectsIDs,
    );
    if (!subjects) {
      throw new HttpException('given subjects not found', 404);
    }
    if (record) {
      // record.title = updateDegreeDto.title;
      record.subjects = subjects;
      return this._degreeRepository.save(record);
    } else {
      throw new HttpException('record not found', 405);
    }
    // return `This action updates a #${id} degree`;
  }

  async remove(Id: string) {
    const degree = await this._degreeRepository.findOne({
      where: {
        id: Id,
      },
    });
    if (!degree) {
      throw new HttpException('Unable to remove degree', 406);
    }

    const deletedDegrees = await this._degreeRepository.softRemove(degree);
    return deletedDegrees;
  }

  async getdegreeByIds(degreeIDs: string[]) {
    return await this._degreeRepository.find({
      where: {
        id: In([...degreeIDs]),
      },
    });
  }

  async finddegreeByName(title: string): Promise<degrees | null> {
    return await this._degreeRepository.findOneBy({ title });
  }
}
