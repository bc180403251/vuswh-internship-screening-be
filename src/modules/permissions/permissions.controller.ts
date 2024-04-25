import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PERMISSION_SERVICE } from 'src/common/constants';
import { Permission } from 'src/db/entities/permission.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(
    @Inject(PERMISSION_SERVICE)
    private readonly permissionsService: PermissionsService,
  ) {}

  @ApiOperation({
    summary: 'Create Permission',
  })
  @ApiResponse({
    status: 402,
    description: 'Permission not Saved',
  })
  @Post('create')
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const createdPermission = await this.permissionsService.create(
      createPermissionDto,
    );
    if (!createPermissionDto) {
      throw new HttpException('Permission not saved', HttpStatus.BAD_REQUEST);
    }
    const data = {
      id: createdPermission.id,
      name: createdPermission.name,
      parentId: createdPermission.parent,
    };
    return data;
  }

  @ApiOperation({ summary: 'Get permissions list tree' })
  @ApiResponse({
    status: 404,
    description: 'you got permissions list tree',
  })
  @Get('tree')
  tree() {
    return this.permissionsService.PermissionsTreeView();
  }

  @ApiOperation({
    summary: 'Permission Lookup',
  })
  @Get('lookup')
  lookup() {
    return this.permissionsService.lookup();
  }

  @ApiOperation({
    summary: 'PageData',
  })
  @ApiResponse({
    status: 404,
    description: 'NO Record',
  })
  @Get('pagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Permission>> {
    if (pageOptionsDto) {
      pageOptionsDto = { page: 1, take: 10, orderBy: '', search: '', skip: 0 };
    }
    return this.pageData(pageOptionsDto);
  }

  async pageData(pageOptionsDto: PageOptionsDto) {
    const pageDto = await this.permissionsService.getAllPageData(
      pageOptionsDto,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({
    summary: 'Permissions List',
  })
  @Get('list')
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @ApiOperation({
    summary: 'FindOne',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update Permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'given permission not found',
  })
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @ApiOperation({
    summary: 'Delete Permissions ',
  })
  @ApiResponse({
    status: 404,
    description: 'given permission not found',
  })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
