import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateEmailTemplateDto } from './dto/create-email.template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email.template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailTemplate } from 'src/db/entities/email_template.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { USER_SERVICE } from 'src/common/constants';
import { UsersService } from '../users/users.service';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { error } from 'console';

@Injectable()
export class EmailTemplateService {
  private transport;

  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emialTemplateRepository: Repository<EmailTemplate>,

    @Inject(forwardRef(() => USER_SERVICE))
    private readonly usersService: UsersService,
  ) {
    this.transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // MailHog SMTP server
      port: parseInt(process.env.MAIL_PORT), // MailHog SMTP port
      service: process.env.MAIL_MAILER,
      secure: false, // Use SSL (false for MailHog)

      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    // this.transport = nodemailer.createTransport({
    //   host: process.env.NODEMAILER_HOST,
    //   port: '192.',
    //   // service: process.env.SERVICE,
    //   secure: process.env.NODEMAILER_SECURE,

    //   // auth: {
    //   //   user: process.env.NODEMAILER_AUTH_USER,
    //   //   pass: process.env.NODEMAILER_AUTH_PASSWORD,
    //   // },
    // });
  }

  async sendemail(useremail, subject, mailbody) {
    const templateFromdb = await this.findTemplateByname(subject);
    // console.log(templateFromdb.subject);
    if (!templateFromdb) {
      throw new HttpException('Template Not Found', 404);
    }
    const compiledTemplate = handlebars.compile(templateFromdb.content);

    const html = compiledTemplate(mailbody);

    // console.log(html);

    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS,
      fromName: process.env.MAIL_FROM_NAME,
      to: useremail,
      subject: subject,
      html: html,
    };
    await this.transport.sendMail(mailOptions);
  }

  async sendDynamicEmail(
    to: string,
    subject: string,
    templateData: any,
    template: string,
  ) {
    try {
      const templateFromdb = await this.findTemplateByname(template);
      // console.log(templateFromdb.subject);
      if (!templateFromdb) {
        throw new HttpException('Template Not Found', 404);
      }
      // const template = this.loadTemplate(templateFromdb)/
      // console.log(templateFromdb);
      const compiledTemplate = handlebars.compile(templateFromdb.content);

      const html = compiledTemplate(templateData);

      // console.log(html);
      const mailOption = {
        from: process.env.MAIL_FROM_ADDRESS,
        fromName: process.env.MAIL_FROM_NAME,
        to: to,
        subject: subject,
        html: html,
      };

      return await this.transport.sendMail(mailOption);
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, 404);
      }
      throw error;
    }
  }
  // private loadTemplate(templateName: string): string {
  //   return fs.readFileSync(templateName, 'utf-8');
  // }

  async create(createEmailTemplateDto: CreateEmailTemplateDto, payload) {
    // const userId = await this.usersService.findOne(payload);
    // console.log('userid', payload.user);

    const record = this.emialTemplateRepository.create({
      subject: createEmailTemplateDto.subject,
      content: createEmailTemplateDto.content,
      createdby: payload.user,
    });

    const data = await this.emialTemplateRepository.save(record);
    return data;
  }

  findAll() {
    return this.emialTemplateRepository.find();
  }
  async getAllPageData(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<EmailTemplate>> {
    const queryBuilder = this.emialTemplateRepository
      .createQueryBuilder('email_templates')
      .leftJoinAndSelect('email_templates.createdby', 'createdby');

    switch (pageOptionsDto.orderBy) {
      case '':
        queryBuilder.orderBy('email_templates.subject', pageOptionsDto.order);
        break;
      case 'subject':
        queryBuilder.orderBy('email_templates.subject', pageOptionsDto.order);
        break;
      default:
        queryBuilder.orderBy('email_templates.subject', pageOptionsDto.order);
        break;
    }
    queryBuilder.select([
      'email_templates.id',
      'email_templates.subject',
      'email_templates.content',
      'createdby.id',
      'createdby.fullname',
    ]); // added selection
    if (pageOptionsDto.search) {
      queryBuilder.where('email_templates.subject LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      });
    }
    if (pageOptionsDto.search) {
      queryBuilder.orWhere('email_templates.content LIKE :keyword', {
        keyword: `%${pageOptionsDto.search}%`,
      });
    }

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto<EmailTemplate>(entities, pageMetaDto);
  }

  async findOne(id: string) {
    const record = await this.emialTemplateRepository.findOne({
      where: { id },
      relations: ['createdby'],
    });
    if (!record) {
      throw new HttpException('tamplate not found', 404);
    }
    return record;
  }

  async getupdate(id: string) {
    const template = await this.emialTemplateRepository.findBy({ id });

    if (!template) {
      throw new HttpException('tamplate not found', 404);
    }
  }
  async update(
    id: string,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
    payload,
  ) {
    const record = await this.emialTemplateRepository.findOne({
      where: { id },
    });

    if (record) {
      (record.subject = updateEmailTemplateDto.subject),
        (record.content = updateEmailTemplateDto.content),
        (record.createdby = payload.user);
    } else {
      throw new HttpException('template not found', 404);
    }

    try {
      return this.emialTemplateRepository.save(record);
    } catch (error) {
      if (error) {
        throw new HttpException(error.sqlmessage, 404);
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} emailTemplate`;
  }

  async findTemplateByname(subject: string): Promise<EmailTemplate | null> {
    return await this.emialTemplateRepository.findOneBy({ subject });
  }
}
