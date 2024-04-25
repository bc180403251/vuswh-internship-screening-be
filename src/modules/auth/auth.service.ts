import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { USER_SERVICE, saltOrRounds } from 'src/common/constants';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly _usersService: UsersService,
    private _jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this._usersService.findOneByEmail(email);
    if (user) {
      if (!user.is_active) {
        throw new HttpException('Account is in active, contact to admin', 404);
      }
      if (!user.is_validated) {
        throw new HttpException('Account is not verified so far', 404);
      }
      const extractedRoles = user.roles.map((role) => {
        return { id: role.id, name: role.name };
      });

      const matched = bcrypt.compareSync(pass, user.password);
      if (matched) {
        const userRecord = {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          roles: extractedRoles,
        };
        // const extractedRoles = [];
        // for (const obj of user.roles) {
        //   extractedRoles.push({
        //     id: obj.id,
        //     name: obj.name,
        //   });
        // }

        const userPermissions = await this._usersService.getUserPermissions(
          user.id,
        );
        const arrayOfPermissions = userPermissions.permissions.map(
          (permission) => {
            return { id: permission.id, name: permission.name };
          },
        );
        const rolesPermissions = await this._usersService.userRolesPermissions(
          user.id,
        );
        for (const obj of rolesPermissions) {
          arrayOfPermissions.push({
            id: obj.id,
            name: obj.name,
          });
        }
        const permissionset = new Set(arrayOfPermissions);

        // const { password, ...result } = user;
        const payload = { sub: user.id, user: userRecord };
        const login_token = await this._jwtService.signAsync(payload);

        this._usersService.updateLoginToken(user.email, login_token);

        return {
          user: userRecord,
          permissions: permissionset,
          access_token: login_token,
        };
      } else {
        throw new HttpException('Incorrect Password', 404);
      }
    } else {
      throw new HttpException('email not exists', 404);
    }
  }

  async sendResetToken(email: string): Promise<void> {
    const user = await this._usersService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Generate a random reset token
    const resetToken = bcrypt.genSaltSync(saltOrRounds);

    // Store the reset token in the database
    await this._usersService.updateResetToken(email, resetToken);

    // Send the reset token to the user (e.g., via email)
    // You can use libraries like Nodemailer for this purpose
  }

  async updatePassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    const user = await this._usersService.findByResetToken(resetToken);
    if (!user) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.NOT_FOUND,
      );
    }

    // Hash the new password before storing it in the database
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
    const hashedConfirmPassword = await bcrypt.hash(
      confirmPassword,
      saltOrRounds,
    );
    await this._usersService.updatePassword(
      user.email,
      hashedPassword,
      hashedConfirmPassword,
    );

    // Clear the reset token after the password is successfully updated
    await this._usersService.updateResetToken(user.email, null);
  }

  async accountVerification(
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    const user = await this._usersService.findByResetToken(resetToken);
    if (!user) {
      throw new HttpException('Invalid or expired reset token', 408);
    }

    // Hash the new password before storing it in the database
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
    const hashedConfirmPassword = await bcrypt.hash(
      confirmPassword,
      saltOrRounds,
    );
    await this._usersService.accountVerification(
      user.email,
      hashedPassword,
      hashedConfirmPassword,
    );

    // Clear the reset token after the password is successfully updated
    await this._usersService.updateResetToken(user.email, null);
  }

  async signout(token) {
    await this._usersService.signout(token);
    return `Logged Out`;
  }

  async verifyacountbyToken(resetToken: string) {
    const user = await this._usersService.verifyResetToken(resetToken);

    // console.log(user);
    if (!user) {
      throw new HttpException('user not exist', 404);
    }
    return user;
  }
  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
