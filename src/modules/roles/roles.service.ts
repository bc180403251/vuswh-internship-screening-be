import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/db/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PERMISSION_SERVICE } from 'src/common/constants';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateRolePermissionsDto } from './dto/UpdateRolePermissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: Repository<Role>,
    @Inject(PERMISSION_SERVICE)
    private readonly _PermissionService: PermissionsService,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this._roleRepository.save(createRoleDto);
  }
  // create lookup function which should return all roles which are not archived
  // records should have the columns id, name

  async disableLookup() {
    return await this._roleRepository.find({
      select: ['id', 'name'],
      where: {
        name: Not(In(['student', 'admin'])),
      },
    });
  }

  async lookup() {
    return await this._roleRepository.find({
      select: ['id', 'name'],
    });
  }

  async findAll(): Promise<Role[]> {
    return await this._roleRepository.find();
  }
  //fetch roll with the given id and all associated permissions with it
  // all existing role list should be dispatched
  // {
  //    role:
  //    permissions:
  // }
  async findOne(Id: string) {
    const role = await this._roleRepository.findOne({
      where: {
        id: Id,
      },
    });
    // console.log(role);
    if (!role) {
      throw new HttpException('given role not found', 404);
    }
  }
  // async findbyname(name: string): Promise<Role | null> {
  //   return await this._roleRepository.findOneBy({ name });
  // }

  //get role (obtainedRole)using the given id
  async update(Id: string, updateRoleDto: UpdateRoleDto) {
    const roleRecord = await this._roleRepository.findOne({
      where: {
        id: Id,
      },
    });
    // check record not exit throw exception
    if (!roleRecord) {
      throw new HttpException('Record Not Found', 404);
    }
    roleRecord.name = updateRoleDto.name;

    return this._roleRepository.save(roleRecord);
  }

  // async remove(Id: string) {
  //   const record = await this._roleRepository.findOne({
  //     where: {
  //       id: Id,
  //     },
  //   });
  //   if (!record) {
  //     throw new HttpException('Given Roles not Exists', 405);
  //   }

  //   const deletedRecords = await this._roleRepository.softRemove(record);
  //   return deletedRecords;
  // }

  async getRoleByIds(roleIDs: string[]) {
    return await this._roleRepository.find({
      where: {
        id: In([...roleIDs]),
      },
    });
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return await this._roleRepository.findOneBy({ name });
  }

  async getAllPageData(pageOptionsDto: PageOptionsDto): Promise<PageDto<Role>> {
    // const queryBuilder = this._userRepository.createQueryBuilder('user');
    const queryBuilder = this._roleRepository.createQueryBuilder('role');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('role.name', pageOptionsDto.order);
        break;
      case 'name':
        queryBuilder.orderBy('role.name', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('role.name', pageOptionsDto.order);
        break;
    }
    queryBuilder.select(['role.id', 'role.name']); // added selection
    queryBuilder
      .where('role.id LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .orWhere('role.name LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      })
      .andWhere('role.deleted_at IS NULL');
    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<Role>(entities, pageMetaDto);
  }

  async getRolePermissions(Id: string) {
    const records = this._roleRepository
      .createQueryBuilder('roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('roles.id = :rolesId', { rolesId: Id })
      .select(['roles.id', 'roles.name', 'permissions.id', 'permissions.name'])
      .getOne();
    return records;
  }

  async updateRolePermissions(
    Id: string,
    updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    const record = await this._roleRepository.findOne({
      where: {
        id: Id,
      },
    });

    if (!record) {
      throw new HttpException('Record Not Found', 404);
    }

    const permissions = await this._PermissionService.getPermissionByIds(
      updateRolePermissionsDto.permissionIds,
    );

    if (permissions.length !== updateRolePermissionsDto.permissionIds.length) {
      throw new HttpException('One of the Given Permissions not Found', 405);
    }

    record.permissions = permissions;

    const roleRecord = await this._roleRepository.save(record);

    return roleRecord;
  }
}
