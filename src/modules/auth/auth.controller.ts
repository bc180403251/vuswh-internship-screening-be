import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Inject,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { setPasswoedDto } from './dto/SetPasswoedDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { signIn } from './dto/signin-auth.dto';
import { ResetPasswordDto } from './dto/ResetPasswordDto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ROLES, USER_SERVICE } from 'src/common/constants';
import { UsersService } from '../users/users.service';
import { forgotPasswordDto } from './dto/forgotPasswordDto';
import { request } from 'http';
import { Request, RequestParamHandler } from 'express';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { User } from 'src/db/entities/user.entity';

@ApiTags('Auth')
// @ROLES(['Admin', 'Coordinator', 'Teacher', 'Student', 'Incharge'])
// @UseGuards(AuthenticationGuard, AuthenticationGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    @Inject(USER_SERVICE)
    private readonly _usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'user Login' })
  @ApiResponse({
    status: 404,
    description: 'Email not exists',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully login ',
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
            email: { type: 'string', example: 'bilal@vu.edu.pk' },
            username: { type: 'string', example: 'bilal' },
            phone: { type: 'string', example: '+923134613788' },
            roles: {
              type: 'string[]',
              example: '[36d0c9b6-592c-11ee-a96d-90b11c6fb389]',
            },
            mergedPermissions: {
              type: 'string[]',
              example: '[usermanage, permission manage, rolesmanage]',
            },
            access_token: {
              type: 'string',
              example: 'eyJhbGc8bFfrfdghfjhfgQSQ',
            },
          },
        },
      },
    },
  })
  @Post('signin')
  async signIn(@Body() signInDto: signIn) {
    const data = await this._authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    // console.log(data);
    return {
      data,
      message: 'You are SignIn Successfully!',
    };
  }

  @ApiOperation({ summary: 'verifyaccount' })
  @ApiResponse({
    status: 404,
    description: 'Invalid or expired reset token',
  })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Passwords do not matched',
  // })
  @ApiResponse({ status: 200, description: 'Password set successfully' })
  @Patch('verify_account/:id')
  update(@Param('id') id: string, @Body() resetPasswoedDto: setPasswoedDto) {
    // console.log(id, ": ", resetPasswoedDto);

    if (resetPasswoedDto.password !== resetPasswoedDto.confirmPassword) {
      throw new HttpException('Passwords do not matched', 404);
    }
    const Data = this._authService.accountVerification(
      id,
      resetPasswoedDto.password,
      resetPasswoedDto.confirmPassword,
    );
    return {
      data: Data,
      message: 'Password set successfully',
    };
  }

  @ApiOperation({
    summary: 'SignOut',
  })
  @ApiResponse({
    status: 200,
    description: 'You are Sign Out Successfully!',
  })
  @UseGuards(AuthenticationGuard)
  @Get('signout')
  async signout(@Req() request) {
    // This id is userid to rest login's access_token
    const token = request.token;
    const data = await this._authService.signout(token);
    return {
      data,
      message: 'You are Sign Out Successfully!',
    };
  }

  @ApiOperation({
    summary: 'Forgot Password',
  })
  @ApiResponse({
    status: 404,
    description: 'email not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Unable to send reset token',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset password link has been sent on your email.',
  })
  @Post('forgot_password')
  async forgotPassword(
    @Body() forgotPassword: forgotPasswordDto,
    @Req() req: Request,
  ) {
    const protocol = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    try {
      const token = await this._usersService.generateResetToken(
        forgotPassword.email,
        protocol.slice(7),
      );
      return {
        message: 'Reset password link has been sent to your email.',
        token,
      };
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  @ApiOperation({
    summary: 'Reset Password',
  })
  @ApiResponse({
    status: 409,
    description: 'Invalid or expired reset token',
  })
  @ApiResponse({
    status: 500,
    description: 'Error resetting password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully.',
  })
  @Patch('reset_password/:resetToken')
  async resetPassword(
    @Param('resetToken') resetToken: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    // try {
    const user = await this._authService.verifyacountbyToken(resetToken);
    // console.log(user);

    if (user) {
      await this._usersService.resetPassword(
        user.email,
        resetPasswordDto.password,
        resetPasswordDto.confirmPassword,
      );
      return { message: 'Password has been reset successfully.' };
    } else {
      throw new HttpException('Invalid or expired reset token', 404);
    }
    // } catch (error) {
    //   console.log(error);
    //   if (error) {
    //     throw new HttpException(error.message, 404);
    //   }

    //   throw error;
    // }
  }
  // @Post('createPassword')
  // create(@Body() createPasswordDto: CreatePasswordDto) {
  //   // return this._authService.create(createPasswordDto);
  // }

  // @Get()
  // findAll() {
  //   return this._authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this._authService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this._authService.remove(+id);
  // }
}
