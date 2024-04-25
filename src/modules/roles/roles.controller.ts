import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PERMISSION_SERVICE, ROLES, ROLE_SERVICE } from 'src/common/constants';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Role } from 'src/db/entities/role.entity';
import { UpdateRolePermissionsDto } from './dto/UpdateRolePermissions.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';

@ApiTags('Roles')
@ROLES(['admin'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(ROLE_SERVICE) private readonly rolesService: RolesService,
    @Inject(PERMISSION_SERVICE)
    private readonly _permissionService: PermissionsService,
  ) {}

  @ApiOperation({
    summary: 'Create Role',
  })
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({
    summary: 'PageData',
  })
  @ApiResponse({
    status: 404,
    description: 'No record',
  })
  @Get('pagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Role>> {
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
    return this.pageData(pageOptionsDto);
  }

  async pageData(pageOptionsDto: PageOptionsDto) {
    const pageDto = await this.rolesService.getAllPageData(pageOptionsDto);
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({
    summary: 'Roles Lookup',
  })
  @Get('lookup')
  lookup() {
    return this.rolesService.lookup();
  }

  @ApiOperation({
    summary: 'Roles List',
  })
  @Get('list')
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({
    summary: 'FindOne',
  })
  @ApiResponse({
    status: 404,
    description: 'Given role not found',
  })
  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  // @Get('name:name')
  // findbyname(@Param('name') name: string) {
  //   return this.rolesService.findbyname(name);
  // }

  @ApiOperation({
    summary: 'Update Role',
  })
  @ApiResponse({
    status: 404,
    description: 'given phase not found',
  })
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOperation({
    summary: 'Delete Role',
  })
  @ApiResponse({
    status: 405,
    description: 'Given role are not exists',
  })

  // @Delete('delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(id);
  // }
  @ApiOperation({
    summary: 'Get Rolepermisssions',
  })
  @ApiResponse({
    status: 400,
    description: 'role ID not provided',
  })
  @ApiResponse({
    status: 404,
    description: 'role not found',
  })
  @Get('role_permissions/:id')
  async getRolePermissions(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('role ID not provided', 400);
    }

    const roleRecord = await this.rolesService.getRolePermissions(id);
    // console.log(roleRecord);
    if (!roleRecord) {
      throw new HttpException('role not found', 404);
    }

    const permissions = await this._permissionService.lookup();

    return {
      role: roleRecord,
      permissions: permissions,
    };
  }

  @ApiOperation({
    summary: 'Assign permissions to roles',
  })
  @ApiResponse({
    status: 409,
    description: 'Record not saved',
  })
  @ApiResponse({
    status: 404,
    description: 'Record Not Found',
  })
  @ApiResponse({
    status: 405,
    description: 'One of the Given Permissions not Found',
  })
  @Patch('role_permissions/:id')
  async updateUserPermissions(
    @Param('id') id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    const record = await this.rolesService.updateRolePermissions(
      id,
      updateRolePermissionsDto,
    );

    if (!record) {
      throw new HttpException('Record not saved', 409);
    }

    return record;
  }
}
