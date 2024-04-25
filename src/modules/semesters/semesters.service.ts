import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { Semester } from 'src/db/entities/semester.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { Request } from 'express';
import { MAX_ACTIVE_SEMESTER } from 'src/common/constants';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semester)
    private _semestersRepository: Repository<Semester>,
  ) {}
  async create(createSemesterDto: CreateSemesterDto) {
    try {
      const start_date = new Date(createSemesterDto.start_date);
      const end_date = new Date(createSemesterDto.end_date);

      const sixmounthduration = new Date(start_date.getTime());

      sixmounthduration.setMonth(start_date.getMonth() + 5);

      const semester = this._semestersRepository.create({
        name: createSemesterDto.name,
        start_date: start_date,
        end_date: end_date,
        is_active: createSemesterDto.is_active,
      });

      console.log(sixmounthduration);
      if (semester.end_date.getTime() >= sixmounthduration.getTime()) {
        const savingrecord = await this._semestersRepository.save(semester);
        return savingrecord;
      } else {
        throw new HttpException(
          `Semester duration must be 6 months or less.Semester's endate must be greater then or equal to ${sixmounthduration} `,
          404,
        );
      }
    } catch (error) {
      if (error) {
        // console.log('i am in first if ');
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }

  findAll() {
    return this._semestersRepository.find();
  }

  lookup() {
    return this._semestersRepository.find({
      select: ['id', 'name', 'start_date', 'end_date'],
    });
  }

  async findOne(id: string) {
    const data = await this._semestersRepository.findOneBy({ id });
    if (!data) {
      throw new HttpException('Record Not found', 404);
    }
    return data;
  }

  async getUpdateSemesterDetails(id: string) {
    const semester = await this._semestersRepository
      .createQueryBuilder('semester')
      .select([
        'semester.id',
        'semester.name',
        'semester.start_date',
        'semester.end_date',
        'semester.is_active',
      ])
      .where('semester.id = :id', { id })
      .getOne();

    if (!semester) {
      throw new HttpException('Semester not found', 404);
    }

    return semester;
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto) {
    const semester = await this._semestersRepository.findOneBy({ id });

    // console.log('updateSemesterDto.is_active:', semester.is_active);
    if (semester) {
      if (semester.is_active) {
        semester.name = updateSemesterDto.name;
        semester.start_date = updateSemesterDto.start_date;
        semester.end_date = updateSemesterDto.end_date;
        semester.is_active = updateSemesterDto.is_active;
      } else {
        throw new HttpException('semester is not active', 404);
      }
    } else {
      throw new HttpException('Semester not found', 404);
    }

    return this._semestersRepository.save(semester);
  }

  remove(id: string) {
    const record = this._semestersRepository
      .createQueryBuilder('semesters')
      .softDelete()
      .where('id = :id', { id: id })
      .execute();

    if (!record) {
      throw new HttpException('record not found', 404);
    }
    return record;
  }
  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
    req: Request,
  ): Promise<PageDto<Semester>> {
    // const queryBuilder = this._semestersRepository.createQueryBuilder('semesters');
    const queryBuilder =
      this._semestersRepository.createQueryBuilder('semesters');

    if (pageOptionsDto.page !== 1) {
      pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    }
    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('semesters.name', pageOptionsDto.order);
        break;
      case 'name':
        queryBuilder.orderBy('semesters.name', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('semesters.name', pageOptionsDto.order);
        break;
    }
    queryBuilder.select([
      'semesters.id',
      'semesters.name',
      'semesters.start_date',
      'semesters.end_date',
      'semesters.is_active',
    ]); // added selection

    if (req.query.search) {
      queryBuilder.andWhere('semesters.name LIKE :name', {
        name: `%${req.query.search}%`,
      });
    }

    if (req.query.status) {
      queryBuilder.andWhere('semesters.is_active = :statusKeyword', {
        statusKeyword: `${req.query.status}`,
      });
    }
    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Semester>(entities, pageMetaDto);
  }

  async allActiveSem() {
    const sem = await this._semestersRepository.find({
      where: { is_active: true },
    });
    return sem;
  }

  async activateAndDeactivate(id: string) {
    const semester = await this._semestersRepository.findOne({ where: { id } });
    if (semester.is_active) {
      const deactivateSemester = this._semestersRepository.update(
        { id },
        { is_active: false },
      );
      return {
        deactivateSemester,
        message: 'Semester ' + semester.name + ' deactivate successfully!',
      };
    }
    const activeSem = await this.allActiveSem();
    if (activeSem.length >= MAX_ACTIVE_SEMESTER) {
      const activesemName = activeSem
        .map((activesem) => activesem.name)
        .join(',');
      throw new HttpException(
        `One Semester ${activesemName} is Already Activated`,
        404,
      );
    } else {
      if (!semester.is_active) {
        const activateSemester = this._semestersRepository.update(
          { id },
          { is_active: true },
        );
        return {
          activateSemester,
          message: 'Semester ' + semester.name + ' activate successfully!',
        };
      }
    }
  }
}
