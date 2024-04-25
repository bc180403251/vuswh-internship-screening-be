import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/db/entities/permission.entity';
import { In, Repository, TreeRepository } from 'typeorm';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Role } from 'src/db/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly _permisssionRepository: Repository<Permission>,
    @InjectRepository(Permission)
    private readonly permissionTreeRepository: TreeRepository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permissionRecord = new Permission();
    permissionRecord.name = createPermissionDto.name;
    permissionRecord.parent = createPermissionDto.PerentId;
    console.log(typeof permissionRecord.parent);
    try {
      const savingRecord = await this._permisssionRepository.save(
        permissionRecord,
      );
      return savingRecord;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async PermissionsTreeView() {
    return await this.permissionTreeRepository.findTrees();
  }

  lookup() {
    return this._permisssionRepository.find({
      select: ['id', 'name'],
    });
  }

  async getPermissionByIds(permissionIDs: string[]) {
    return await this._permisssionRepository.find({
      where: {
        id: In([...permissionIDs]),
      },
    });
  }

  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Permission>> {
    const queryBuilder =
      this._permisssionRepository.createQueryBuilder('permission');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('permission.name', pageOptionsDto.order);
        break;
      case 'name':
        queryBuilder.orderBy('permission.name', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('permission.name', pageOptionsDto.order);
        break;
    }
    queryBuilder.select(['permission.id', 'permission.name']); // added selection
    queryBuilder
      .where('permission.id LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .orWhere('permission.name LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .andWhere('permission.deleted_at IS NULL');
    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Permission>(entities, pageMetaDto);
  }

  // create(createPermissionDto: CreatePermissionDto) {
  //   return 'This action adds a new permission';
  // }

  // create(createRoleDto: CreatePermissionDto) {
  //   return this._permisssionRepository.save(createRoleDto);
  // }

  async findAll(): Promise<Permission[]> {
    return this._permisssionRepository.find();
  }

  async findOne(Id: string): Promise<Permission | null> {
    return await this._permisssionRepository.findOne({
      where: {
        id: Id,
      },
    });
  }

  async update(Id: string, updatePermissionDto: UpdatePermissionDto) {
    const premissionRecord = await this._permisssionRepository.findOne({
      where: {
        id: Id,
      },
    });
    if (!premissionRecord) {
      throw new HttpException('given permission not found', 404);
    }
    premissionRecord.name = updatePermissionDto.name;

    return this._permisssionRepository.save(premissionRecord);
  }

  // async update(Id: string, updateRoleDto: UpdateRoleDto) {
  //   const roleRecord = await this._roleRepository.findOne({
  //     where: {
  //       id: Id,
  //     },
  //   });

  async remove(id: string) {
    const Permissions = await this._permisssionRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!Permissions) {
      throw new HttpException('permission not found', 404);
    }

    const deletedpermissions = await this._permisssionRepository.softRemove(
      Permissions,
    );
    return deletedpermissions;
  }
}
