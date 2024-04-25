import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { USER_SERVICE } from 'src/common/constants';
import { PermissionsModule } from '../permissions/permissions.module';
import { EmailTemplateModule } from '../email.template/email.template.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    PermissionsModule,
    forwardRef(() => EmailTemplateModule),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UsersService,
    },
  ],
  exports: [USER_SERVICE],
})
export class UsersModule {}
