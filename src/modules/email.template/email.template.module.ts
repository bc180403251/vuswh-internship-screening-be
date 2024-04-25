import { Module, forwardRef } from '@nestjs/common';
import { EmailTemplateService } from './email.template.service';
import { EmailTemplateController } from './email.template.controller';
import { EmailTemplate } from 'src/db/entities/email_template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EMAILTEMPALTE_SERVICE } from 'src/common/constants';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplate]),
    forwardRef(() => UsersModule),
  ],
  controllers: [EmailTemplateController],
  providers: [
    {
      provide: EMAILTEMPALTE_SERVICE,
      useClass: EmailTemplateService,
    },
  ],
  exports: [EMAILTEMPALTE_SERVICE],
})
export class EmailTemplateModule {}
