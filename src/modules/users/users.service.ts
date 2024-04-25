import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Search,
  Headers,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/db/entities/user.entity';
import {
  EMAILTEMPALTE_SERVICE,
  PERMISSION_SERVICE,
  ROLE_SERVICE,
  saltOrRounds,
} from 'src/common/constants';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { UpdateUserPermissionsDto } from './dto/UpdateUserPermissionsDto';
import { PermissionsService } from '../permissions/permissions.service';
import { Request } from 'express';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { EmailTemplateService } from '../email.template/email.template.service';
import { Subject } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
    @Inject(ROLE_SERVICE)
    private readonly _roleService: RolesService,
    @Inject(PERMISSION_SERVICE)
    private readonly _permissionService: PermissionsService,
    @Inject(forwardRef(() => EMAILTEMPALTE_SERVICE))
    private readonly _emailTemplateService: EmailTemplateService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  //Function to Create User and Generate Reset URL
  async create(createUserDto: CreateUserDto, remoteIP: String) {
    // console.log(createUserDto);
    // console.log(remoteIP);

    const roles = await this._roleService.getRoleByIds(createUserDto.roleIds);
    if (roles.length !== createUserDto.roleIds.length) {
      throw new HttpException('Given Roles not Exists', 404);
    }

    // Generate a random reset token
    let resetPassCode = bcrypt.genSaltSync(saltOrRounds);
    resetPassCode = resetPassCode.replaceAll('/', '-');

    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() + 24);
    const username = createUserDto.email.split('@')[0];

    const record = this._userRepository.create({
      username: username,
      fullname: createUserDto.fullname,
      email: createUserDto.email,
      phone: createUserDto.phone,
      reset_pass_code: resetPassCode,
      reset_till: todayDate,
      profile_pic: '.\\avatar\\user_profile_avatar.png',
    });
    record.roles = roles;
    try {
      const savingrecord = await this._userRepository.save(record);
      //send email to user who create account for setting password
      if (savingrecord) {
        const tamplateDb = await this._emailTemplateService.findTemplateByname(
          'Confirmation',
        );
        const to = savingrecord.email;
        const time = savingrecord.reset_till;
        const setNewPasswordlink = `${remoteIP}:3001/verify-account/${resetPassCode}`;
        let subject = tamplateDb.subject;
        let html = { useremail: to, setPasswordLink: setNewPasswordlink };
        let template = tamplateDb.subject;
        await this._emailTemplateService.sendDynamicEmail(
          to,
          subject,
          html,
          template,
        );
      }
      return savingrecord;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Duplicate Entry', 404);
      }
      throw error;
    }
  }

  async findAll() {
    const queryBuilder = this._userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.phone',
        'user.email',
        'roles.id',
        'roles.name',
        // 'permissions.id',
        // 'permissions.name',
      ]) // Include the fields you want
      .leftJoin('user.roles', 'roles')
      .getMany();

    return queryBuilder;
  }

  async getTableData() {
    const records = this._userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.phone',
        'user.email',
        'user.is_active',
        'roles.id',
        'roles.name',
      ]) // Include the fields you want
      .leftJoin('user.roles', 'roles')
      .getMany();
    return records;
  }

  async getAllPageData(
    usersPageOptionsDto: PageOptionsDto,
    req: Request,
  ): Promise<PageDto<User>> {
    // const queryBuilder = this._userRepository.createQueryBuilder('user');
    const queryBuilder = this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role');

    switch (usersPageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('user.username', usersPageOptionsDto.order);
        break;
      case 'name':
        queryBuilder.orderBy('user.fullname', usersPageOptionsDto.order);
        break;
      case 'username':
        queryBuilder.orderBy('user.username', usersPageOptionsDto.order);
        break;
      case 'role':
        queryBuilder.orderBy('role.name', usersPageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('user.username', usersPageOptionsDto.order);
        break;
    }

    // queryBuilder.orderBy('user.username', pageOptionsDto.order); // instead of switch statement we could simply code like this if the case of fullname is not given

    queryBuilder.select([
      'user.id',
      'user.fullname',
      'user.username',
      'user.email',
      'user.phone',
      'user.is_active',
      'role.id',
      'role.name',
    ]);

    if (req.query.status) {
      queryBuilder.andWhere('user.is_active LIKE :status ', {
        status: `%${req.query.status}%`,
      });
    }

    if (req.query.role) {
      queryBuilder.andWhere('role.name LIKE :role ', {
        role: `%${req.query.role}%`,
      });
    }

    if (req.query.search) {
      queryBuilder.andWhere(
        'user.username LIKE :keyword OR user.fullname LIKE :keyword OR user.email LIKE :keyword OR user.phone LIKE :keyword',
        {
          keyword: `%${req.query.search}%`,
        },
      );
    }
    // added selection
    queryBuilder.skip(usersPageOptionsDto.skip).take(usersPageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageOptionsDto: PageOptionsDto = new PageOptionsDto();
    pageOptionsDto.order = usersPageOptionsDto?.order;
    pageOptionsDto.page = usersPageOptionsDto?.page;
    pageOptionsDto.take = usersPageOptionsDto?.take;
    pageOptionsDto.orderBy = usersPageOptionsDto?.orderBy;
    pageOptionsDto.search = usersPageOptionsDto?.search;
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto<User>(entities, pageMetaDto);
  }

  async findOne(Id: string): Promise<User | null> {
    return await this._userRepository.findOne({
      where: {
        id: Id,
      },
    });
  }

  async getUpdateById(Id: string): Promise<User | null> {
    const queryBuilder = this._userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.phone',
        'user.email',
        'user.fullname',
        'roles.id',
        'roles.name',
      ]) // Include the fields you want
      .leftJoin('user.roles', 'roles')
      .where('user.id = :userId', { userId: Id })
      .getOne();

    if (!queryBuilder) {
      throw new HttpException('User Not found', 404);
    }
    return queryBuilder;
  }

  async findOneByEmail(Email: string) {
    return await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.permissions', 'permission')
      .addSelect('user.password')
      .where('user.email = :email', { email: Email })
      .getOne();
  }

  async update(Id: string, updateUserDto: UpdateUserDto) {
    // const phone = updateUserDto.phone;

    const userRecord = await this._userRepository.findOne({
      where: {
        id: Id,
      },
    });

    if (!userRecord) {
      throw new HttpException('Record Not Found', 404);
    }

    const roles = await this._roleService.getRoleByIds(updateUserDto.roleIds);
    if (roles.length !== updateUserDto.roleIds.length) {
      throw new HttpException('Given Roles not Exists', 405);
    }

    userRecord.roles = roles;
    userRecord.phone = updateUserDto.phone;
    userRecord.fullname = updateUserDto.fullname;

    return this._userRepository.save(userRecord);
  }

  async remove(Id: string) {
    const record = await this._userRepository.findOne({
      where: {
        id: Id,
      },
    });
    if (!record) {
      throw new HttpException('Given user not found', 404);
    }

    const deletedRecords = await this._userRepository.softRemove(record);
    return deletedRecords;
  }

  async updateResetToken(
    email: string,
    reset_pass_code: string,
  ): Promise<void> {
    const reset_till = null;
    await this._userRepository.update(
      { email },
      { reset_pass_code, reset_till },
    );
  }

  async findByResetToken(resetToken: string) {
    return await this._userRepository.findOne({
      where: {
        reset_pass_code: resetToken,
      },
    });
  }

  async updatePassword(
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    await this._userRepository.update({ email }, { password });
  }

  async accountVerification(
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    const is_active = true;
    const is_validated = true;
    // Update the password and confirmation password separately
    const updateResult = await this._userRepository.update(
      { email },
      { password },
    );
    if (!updateResult.affected || updateResult.affected === 0) {
      throw new HttpException(
        'Unable to set the given password',
        HttpStatus.CONFLICT,
      );
    }

    const record = await this._userRepository.update(
      { email },
      { password, is_active, is_validated },
    );

    // Update the is_active and is_validated fields
    if (!record.affected || record.affected === 0) {
      throw new HttpException('Unable to verify the account', 404);
    }
  }

  async updateLoginToken(email: string, login_token: string): Promise<void> {
    await this._userRepository.update({ email }, { login_token });
  }

  async signout(token: string) {
    const loggingOut = await this._userRepository.update(
      { login_token: token },
      { login_token: null },
    );
    if (!loggingOut) {
      throw new HttpException('ERROR', 404);
    }
  }

  async getUserPermissions(Id: string) {
    const records = this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.permissions', 'permissions')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :userId', { userId: Id })
      .select([
        'user.id',
        'user.username',
        'roles.name',
        'user.is_active',
        'permissions.id',
        'permissions.name',
      ])
      .getOne();
    return records;
  }

  async updateUserPermissions(
    Id: string,
    updateUserPermissionsDto: UpdateUserPermissionsDto,
  ) {
    const record = await this._userRepository.findOne({
      where: {
        id: Id,
      },
    });

    if (!record) {
      throw new HttpException('Record Not Found', 404);
    }

    const permissions = await this._permissionService.getPermissionByIds(
      updateUserPermissionsDto.permissionIds,
    );

    if (permissions.length !== updateUserPermissionsDto.permissionIds.length) {
      throw new HttpException('One of the Given Permissions not Found', 400);
    }

    record.permissions = permissions;

    const userRecord = await this._userRepository.save(record);

    return userRecord;
  }
  async userRolesPermissions(userId: string) {
    const user = await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //extracting role's permissions
    const rolesPermissions = [];
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        rolesPermissions.push({ id: permission.id, name: permission.name });
      }
    }

    return rolesPermissions;
  }

  async generateResetToken(email: string, remoteIP: String): Promise<void> {
    // console.log(remoteIP);
    const user = await this._userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException('Email not exist', 404);
    }
    let reset_pass_code = uuidv4();
    reset_pass_code = reset_pass_code.replaceAll('/', '-');

    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 24);

    user.reset_pass_code = reset_pass_code;
    user.reset_code_upto = resetTokenExpiration;
    const resetEmail = user.email;
    await this._userRepository.update(
      { email: resetEmail },
      {
        reset_pass_code: user.reset_pass_code,
        reset_code_upto: user.reset_code_upto,
      },
    );

    const recordsave = await this._userRepository.save(user);

    // Send an email to the user with a link that includes the resetToken
    if (recordsave) {
      const templatedb = await this._emailTemplateService.findTemplateByname(
        'Forgot Password',
      );
      const resetPasswordLink = `${remoteIP}:3001/auth/reset-password/${reset_pass_code}`;
      const to = resetEmail;
      let Subject = templatedb.subject;

      let html = {
        useremail: to,
        resetPasswordLink: resetPasswordLink,
      };
      let template = templatedb.subject;

      await this._emailTemplateService.sendDynamicEmail(
        to,
        Subject,
        html,
        template,
      );
    }
  }

  async verifyResetToken(resetToken: string) {
    const user = await this.findByResetToken(resetToken);

    // If the user is already verified, there's no need to resend the link

    if (user && user.reset_code_upto) {
      // console.log(user.reset_code_upto);
      const currentTime = new Date();
      const tokenExpiration = new Date(user.reset_code_upto);

      if (currentTime <= tokenExpiration) {
        return user;
      }
    }

    return null; // Token is invalid or expired.
  }

  async resetPassword(
    email: string,
    Password: string,
    confirmPassword: string,
  ): Promise<void> {
    // Check if newPassword and confirmPassword match.
    if (Password === confirmPassword) {
      // Hash the new password before storing it in the database.
      const hashedPassword = await bcrypt.hash(Password, saltOrRounds);
      const hashedconfirmPassword = await bcrypt.hash(
        confirmPassword,
        saltOrRounds,
      );
      await this.updatePassword(email, hashedPassword, hashedconfirmPassword);

      // Clear the reset token after the password is successfully updated.
      await this.updateResetToken(email, null);

      // The password has been successfully reset.
    } else {
      throw new HttpException(
        'Password and Confirm Password do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async activateuser(id: string) {
    const user = await this._userRepository.findOne({ where: { id } });
    if (user.is_active) {
      const userDeactivate = await this._userRepository.update(
        { id },
        { is_active: false },
      );
      return {
        userDeactivate,
        message: 'User ' + user.fullname + ' deactivate successfully!',
      };
    }
    if (!user.is_active) {
      const userActivate = await this._userRepository.update(
        { id },
        { is_active: true },
      );
      return {
        userActivate,
        message: 'User ' + user.fullname + ' activate successfully!',
      };
    }
  }

  async getStudentInfo(userId: string) {
    return await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.student', 'student')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async getstudentbyId(userId: string) {
    const studentData = await this._userRepository
      .createQueryBuilder('user' as 'userStudent')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('student.degree', 'degree')
      // .leftJoinAndSelect('student.user', 'user')
      .select([
        'user.id',
        'user.email',
        'student.id',
        'student.vuid',
        'student.name',
        'student.cnic',
        'student.phone',
        'degree.title',
      ])
      .where('user.id=:userId', { userId })
      .getOne();
    // console.log(studentData);
    return studentData;
  }
  async getStudentDegree(userId: string) {
    const degree = await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('student.degree', 'degree')
      // .select(['student.id', 'degree.id', 'degree.title'])
      .select(['user.id', 'student.id', 'degree.id', 'degree.title'])
      .where('user.id=:userId', { userId: userId })
      .getOne();

    return degree;
  }
  async getDegreeSub(userId: string) {
    const subjects = await this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('student.degree', 'degree')
      .leftJoinAndSelect('degree.subjects', 'subjects')
      .select([
        'user.id',
        'student.id',
        'degree.id',
        'subjects.id',
        'subjects.code',
      ])
      .where('user.id=:userId', { userId: userId })
      .getMany();

    return subjects;
  }

  //

  // Profiles settings

  async getuserProfile(paylaod: any) {
    const id = paylaod.sub;

    const user = this._userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new HttpException('user Not Found', 404);
    }
    return user;
  }

  async Userprofile(
    updateUserDto: UpdateUserDto,
    paylaod,
    profile_pic: Express.Multer.File,
  ) {
    const id = paylaod.user.id;

    const user = await this._userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    // console.log(updateUserDto.fullname);

    if (!user) {
      throw new HttpException('user Not found', 404);
    }

    user.fullname = updateUserDto.fullname;
    user.phone = updateUserDto.phone;
    user.profile_pic = '\\profiles\\' + profile_pic.filename;

    return await this._userRepository.save(user);
  }

  async getStudentProfile(payload: any) {
    const id = payload.sub;
    // console.log(id);

    const student = this._userRepository.findOne({
      where: { id },
      relations: ['student', 'student.degree', 'roles'],
    });

    if (!student) {
      throw new HttpException('user Not Found', 404);
    }
    return student;
  }

  async Studentprofile(
    updateUserDto: UpdateUserDto,
    paylaod,
    profile_pic: Express.Multer.File,
  ) {
    const id = paylaod.sub;
    const user = await this._userRepository.findOne({
      where: { id },
      relations: ['student', 'student.degree'],
    });

    if (!user) {
      throw new HttpException('user Not found', 404);
    }

    user.fullname = updateUserDto.fullname;
    user.phone = updateUserDto.phone;
    user.profile_pic = '\\profiles\\' + profile_pic.filename;

    if (user.student) {
      user.student.name = user.fullname;
      user.student.phone = user.phone;
    }

    try {
      await this.entityManager.transaction(async (entityManager) => {
        await entityManager.save(user);
        if (user.student) {
          await entityManager.save(user.student);
        }
      });

      return user; // Return the updated user object if needed
    } catch (error) {
      if (error) {
        throw new HttpException(error.Massage, 500);
      }
      throw error;
    }
  }
}
