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
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
  HostParam,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  PERMISSION_SERVICE,
  ROLES,
  ROLE_SERVICE,
  USER_SERVICE,
} from 'src/common/constants';
import { RolesService } from '../roles/roles.service';
import { User } from 'src/db/entities/user.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateUserPermissionsDto } from './dto/UpdateUserPermissionsDto';
import * as fs from 'fs';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, RequestParamHandler } from 'express';
import { forgotPasswordDto } from '../auth/dto/forgotPasswordDto';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';
import { HostAddress } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';

// @ROLES(['admin'])
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly usersService: UsersService,
    @Inject(ROLE_SERVICE) private readonly _roleService: RolesService,
    @Inject(PERMISSION_SERVICE)
    private readonly _permissionService: PermissionsService,
  ) {}

  //get roles list for creating user
  @ApiOperation({ summary: 'Get roles list ' })
  @ApiResponse({
    status: 404,
    description: 'You got a list of roles',
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array', // Change the type to 'array'
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'Incharge',
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('create')
  async getCreate() {
    const roles = await this._roleService.disableLookup();
    return {
      roles: roles,
    };
  }
  // @UsePipes(ValidationPipe)
  // create user and save it
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 404,
    description: 'Given roles not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Record Not Saved',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created ',
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('create')
  async postCreate(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const protocol = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    // const portww = req.socket.remotePort;
    // const puop = req.headers['x-forwarded-for'];
    // const origina = req.header;
    // const host = req.get('Host');
    // const originUrl = req.originalUrl;
    // const fullUrl = protocol + host + originUrl;
    // console.log(
    // 'remoteAddress => ' + protocol.slice(7),
    // 'header =>' + puop,
    // 'Origin =>' + origina,
    // 'host =>' + host,
    // 'originUrl =>' + originUrl,
    // );

    const record = await this.usersService.create(
      createUserDto,
      protocol.slice(7),
    );
    // if no record created, throw exception
    if (!record) {
      throw new HttpException('Record not saved', 400);
    }
    // extract required fields from role entire record
    // const selectedRoleFields = record?.roles?.map(({ id, name }) => ({
    //   id,
    //   name,
    // }));

    // const userData = {
    //   id: record.id,
    //   name: record.fullname,
    //   email: record.email,
    //   username: record.username,
    //   phone: record.phone,
    //   is_active: record.is_active,
    //   is_validated: record.is_validated,
    //   reset_pass_code: record.reset_pass_code,
    //   roles: selectedRoleFields,
    // };
    //extract reset_pass_code and generate url and send email to the creted user for reset password
    // Send the reset token to the user (e.g., via email)
    // You can use libraries like Nodemailer for this purpose
    // console.log('Account verification code: ', record.reset_pass_code);

    return {
      record,
      message:
        'User Registered Successfully!',
    };

    return;
  }

  //get user list with pagedata
  @ApiOperation({
    summary: 'Pagedata',
  })
  // @ApiResponse({
  //   status: 404,
  //   description: 'No record',
  // })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'student',
              },
            },
          },
        },
        pagedata: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            email: { type: 'string', example: 'bilal@vu.edu.pk' },
            name: { type: 'string', example: 'bilal ahmad' },
            username: { type: 'string', example: 'bilal' },
            phone: { type: 'string', example: '+923134613788' },

            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                  },
                  name: {
                    type: 'string',
                    example: 'coordinator',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('pagedata')
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
    @Req() req: Request,
  ) {
    const roles = await this._roleService.lookup();

    if (!pageOptionsDto.page) {
      pageOptionsDto.page = 1;
    }
    if (!pageOptionsDto.take) {
      pageOptionsDto.take = 10;
    }
    if (!pageOptionsDto.orderBy) {
      pageOptionsDto.orderBy = '';
    }
    if (!pageOptionsDto.roles) {
      pageOptionsDto.roles = '';
    }
    if (pageOptionsDto.page !== 1) {
      pageOptionsDto.skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    }

    const pagedata = await this.pageData(pageOptionsDto, req);

    const data = { pagedata, roles };
    return data;
  }

  async pageData(pageOptionsDto: PageOptionsDto, req: Request) {
    // const adjustedPage = (pageOptionsDto.page - 1) * pageOptionsDto.take;
    // pageOptionsDto.page = adjustedPage;
    const pageDto = await this.usersService.getAllPageData(pageOptionsDto, req);
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No pageData Record Found', 404);
    }
  }

  // get simple list of users
  @ApiOperation({
    summary: 'Get users list',
  })
  @Get('list')
  findAll() {
    return this.usersService.findAll();
  }

  //get update an existing user
  @ApiOperation({
    summary: 'Get user update',
  })
  @ApiResponse({
    status: 404,
    description: 'User record no exist',
  })
  @ApiResponse({
    status: 200,
    description: 'Userdata , Roles list ',
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
              },
              name: {
                type: 'string',
                example: 'student',
              },
            },
          },
        },
        userData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            email: { type: 'string', example: 'bilal@vu.edu.pk' },
            name: { type: 'string', example: 'bilal ahmad' },
            username: { type: 'string', example: 'bilal' },
            phone: { type: 'string', example: '+923134613788' },

            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                  },
                  name: {
                    type: 'string',
                    example: 'teacher',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('update/:id')
  async findOne(@Param('id') id: string) {
    const roles = await this._roleService.disableLookup();
    const userData = await this.usersService.getUpdateById(id);
    if (userData) {
      return {
        roles: roles,
        users: userData,
      };
    } else {
      throw new HttpException('User record no exist', 405);
    }
  }

  //update user by its id
  @ApiOperation({
    summary: 'Update user',
  })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Record not found',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Given roles are not exists',
  // })
  @ApiResponse({
    status: 404,
    description: 'Record updated successfully!',
    schema: {
      type: 'object',
      properties: {
        // message: { type: 'string', example: 'Hello, world!' },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            email: { type: 'string', example: 'ali112@vu.edu.pk' },
            name: { type: 'string', example: 'ahmad ali' },
            username: { type: 'string', example: 'ali112' },
            phone: { type: 'string', example: '+923134613788' },

            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                  },
                  name: {
                    type: 'string',
                    example: 'teacher',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const record = await this.usersService.update(id, updateUserDto);

    if (record) {
      const selectedRoleFields = record?.roles?.map(({ id, name }) => ({
        id,
        name,
      }));

      return {
        data: {
          id: record.id,
          email: record.email,
          name: record.fullname,
          username: record.username,
          phone: record.phone,
          roles: selectedRoleFields,
        },
        message: 'Record updated successfully',
      };
    }
  }

  //get assign permissions to user by it id
  @ApiOperation({
    summary: 'Get userpermissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Record updated successfully',
    schema: {
      type: 'object',
      properties: {
        // message: { type: 'string', example: 'Hello, world!' },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            email: { type: 'string', example: 'ali112@vu.edu.pk' },
            name: { type: 'string', example: 'ahmad ali' },
            username: { type: 'string', example: 'ali112' },
            phone: { type: 'string', example: '+923134613788' },
            permissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                  },
                  name: {
                    type: 'string',
                    example: 'user manage',
                  },
                },
              },
            },
            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                  },
                  name: {
                    type: 'string',
                    example: 'teacher',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get('user_permissions/:id')
  async getUserPermissions(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('User ID not provided', 404);
    }

    const user = await this.usersService.getUserPermissions(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const permissions = await this._permissionService.lookup();
    // if (!permissions) {
    //   throw new HttpException('permissions not found', 404);
    // }

    return {
      user: user,
      permissions: [...permissions],
    };
  }

  //assigning permissions to users by its id
  @ApiOperation({
    summary: 'Update userpermissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Permissions assigned successfully!',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            email: { type: 'string', example: 'ali112@vu.edu.pk' },
            name: { type: 'string', example: 'ahmad ali' },
            username: { type: 'string', example: 'ali112' },
            phone: { type: 'string', example: '+923134613788' },
            permissions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
                  },
                  name: {
                    type: 'string',
                    example: 'user manage',
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Patch('user_permissions/:id')
  async updateUserPermissions(
    @Param('id') id: string,
    @Body() updateUserPermissionsDto: UpdateUserPermissionsDto,
  ) {
    const record = await this.usersService.updateUserPermissions(
      id,
      updateUserPermissionsDto,
    );

    if (!record) {
      throw new HttpException('Record not saved', 405);
    }

    return {
      id: record.id,
      username: record.username,
      phone: record.phone,
      email: record.email,
      permissions: record?.permissions?.map((p) => {
        return {
          id: p.id,
          name: p.name,
        };
      }), // permissions.id',
      // permissions.name',
      message: 'Permissions assigned successfully!',
    };
  }

  //archived user
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    status: 404,
    description: 'Given user not found',
  })
  @ApiResponse({
    status: 404,
    description: 'Unable to delete the record, try later!...',
  })
  @ApiResponse({
    status: 404,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
        },
        email: {
          type: 'string',
          example: 'abc@vu.edu.pk',
        },
        username: {
          type: 'string',
          example: 'abc',
        },
        phone: {
          type: 'string',
          example: '+923465242119',
        },
      },
    },
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    const record = await this.usersService.remove(id);
    if (!record) {
      throw new HttpException(
        'Unable to delete the record, try later!...',
        404,
      );
    }
    return {
      id: record.id,
      username: record.username,
      email: record.email,
      phone: record.phone,
    };
  }

  @ApiOperation({ summary: 'activate/deactivate' })
  @ApiResponse({
    status: 200,
    description: 'user activated',
  })
  @ApiResponse({
    status: 200,
    description: 'user Deactivated',
  })
  @ROLES(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch('activate_user/:id')
  async activateuser(@Param('id') id: string) {
    return await this.usersService.activateuser(id);
  }

  // profile settings

  @ROLES(['admin', 'coordinator', 'incharge', 'teacher'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('getUpdateProfile')
  async getProfile(@Req() { payload }) {
    const user = this.usersService.getuserProfile(payload);

    return user;
  }

  @ROLES(['admin', 'coordinator', 'incharge', 'teacher'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('profile_pic', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const splitname = file.originalname.split('.');
          const name = splitname[0];
          const ext = splitname[1];
          const newName =
            name.replaceAll(' ', '_') + '_' + Date.now() + '.' + ext;
          cb(null, newName);
        },
      }),
    }),
  )
  @Patch('userProfile')
  async userprofile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { payload },
    @UploadedFile()
    profile_pic: Express.Multer.File,
  ) {
    // console.log(payload);
    try {
      const user = await this.usersService.Userprofile(
        updateUserDto,
        payload,
        profile_pic,
      );

      return { user: user.fullname, message: 'Profile updated Successfully!' };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      fs.unlinkSync(profile_pic.path);
      throw error;
    }
  }

  @ROLES(['student'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get('getUpdateStudentProfile')
  async getstudentProfile(@Req() { payload }) {
    const user = this.usersService.getStudentProfile(payload);
    if (!user) {
      throw new HttpException('student not found', 404);
    }

    return user;
  }

  @ROLES(['student'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UseInterceptors(
    FileInterceptor('profile_pic', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const splitname = file.originalname.split('.');
          const name = splitname[0];
          const ext = splitname[1];
          const newName =
            name.replaceAll(' ', '_') + '_' + Date.now() + '.' + ext;
          cb(null, newName);
        },
      }),
    }),
  )
  @Patch('studentProfile')
  async studentProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { payload },
    @UploadedFile()
    profile_pic: Express.Multer.File,
  ) {
    // console.log(payload);

    try {
      const student = await this.usersService.Studentprofile(
        updateUserDto,
        payload,
        profile_pic,
      );
      // console.log(student.profile_pic);
      return {
        student: student.fullname,
        message: 'Profile updated Successfully! ',
      };
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      fs.unlinkSync(profile_pic.path);
      throw error;
    }
  }

  // @UseGuards(AuthorizationGuard)
  // @Get('profile/:photopath')
  // getphoto(@Param('photopath') photopath: string) {
  //   const pic = createReadStream(join(process.cwd(), `${photopath}`));
  //   return new StreamableFile(pic);
  // }

  @Get('defaultPhoto')
  defaultPhoto() {
    const file = createReadStream(
      join(process.cwd(), './avatar/user_profile_avatar'),
    );
    return new StreamableFile(file);
  }
}
