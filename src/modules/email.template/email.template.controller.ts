import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  UseGuards,
  HttpException,
  Query,
} from '@nestjs/common';
import { EmailTemplateService } from './email.template.service';
import { CreateEmailTemplateDto } from './dto/create-email.template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email.template.dto';
import { EMAILTEMPALTE_SERVICE, ROLES } from 'src/common/constants';
import { AuthenticationGuard } from '../gaurds/authentication.gaurd';
import { AuthorizationGuard } from '../gaurds/authrization.gaurd';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { EmailTemplate } from 'src/db/entities/email_template.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Email Templates')
@ROLES(['admin', 'coordinator'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('email_templates')
export class EmailTemplateController {
  constructor(
    @Inject(EMAILTEMPALTE_SERVICE)
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  @ApiOperation({ summary: 'Create Template' })
  @ApiResponse({
    status: 404,
    description: 'Duplicate Entry',
  })
  @ApiResponse({
    status: 200,
    description: 'template created Successfully!',
  })
  // @UseGuards(AuthenticationGuard)
  @Post('create')
  async create(
    @Req() { payload },
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
  ) {
    // const token = Request.token;
    // console.log(payload);
    try {
      const data = await this.emailTemplateService.create(
        createEmailTemplateDto,
        payload,
      );
      return 'template created Successfully!';
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(error.sqlmessage, 404);
      }
    }
  }

  @Get('list')
  findAll() {
    return this.emailTemplateService.findAll();
  }
  @ApiOperation({ summary: 'getPagedata' })
  @ApiResponse({
    status: 404,
    description: 'No Record',
  })
  @ApiResponse({
    status: 200,
    description: 'List of templates',
    schema: {
      type: 'object',
      properties: {
        pagedata: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '342b25fe-44a0-4541-819b-12a43a7d98bd',
            },
            subject: { type: 'string', example: 'welcome' },
            content: { type: 'string', example: 'welcome in our community' },
            createdBy: { type: 'string', example: 'bilal' },
          },
        },
      },
    },
  })
  @Get('pagedata')
  // @UsePipes(ValidationPipe)
  async getAllPageData(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<EmailTemplate>> {
    // if (pageOptionsDto) {
    //   pageOptionsDto = { page: 1, take: 10, orderBy: '', search: '', skip: 0 };
    // }
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
    const pageDto = await this.emailTemplateService.getAllPageData(
      pageOptionsDto,
    );
    if (pageDto) {
      return pageDto;
    } else {
      throw new HttpException('No Record', 404);
    }
  }

  @ApiOperation({
    summary: ' view template',
  })
  @ApiResponse({
    status: 404,
    description: 'template Not found',
  })
  @Get('findone/:id')
  async findOne(@Param('id') id: string) {
    console.log('hey');
    const data = await this.emailTemplateService.findOne(id);

    const record = {
      id: data.id,
      subject: data.subject,
      content: data.content,
      createdbyId: data.createdby.id,
      createdbyName: data.createdby.fullname,
    };

    console.log(data);

    return record;
  }
  @ApiOperation({
    summary: 'getUpdate',
  })
  @ApiResponse({
    status: 404,
    description: 'template not found',
  })
  @Get('getupdate/:id')
  async getupddate(@Param('id') id: string) {
    const data = await this.emailTemplateService.findOne(id);

    const record = {
      subject: data.subject,
      content: data.content,
    };
    return record;
  }

  @ApiOperation({ summary: 'Update template' })
  @ApiResponse({
    status: 404,
    description: 'template Not found',
  })
  @ApiResponse({
    status: 200,
    description: 'template Updated Successfully',
  })
  @Patch('update/:id')
  async update(
    @Req() { payload },
    @Param('id') id: string,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
  ) {
    const date = await this.emailTemplateService.update(
      id,
      updateEmailTemplateDto,
      payload,
    );
    return 'template Updated Successfully!';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailTemplateService.remove(+id);
  }

  @Get('test')
  sendtestmain() {
    const nodemailer = require('nodemailer');

    // Create a Nodemailer transporter using MailHog's SMTP settings
    const transporter = nodemailer.createTransport({
      host: '192.168.50.146', // MailHog SMTP server
      port: 1025, // MailHog SMTP port
      secure: false, // Use SSL (false for MailHog)
    });

    // Define your email options
    const mailOptions = {
      from: 'your-email@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email sent with Nodemailer and MailHog.',
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error:', error);
      }
      console.log('Email sent:', info);
    });
  }
}
