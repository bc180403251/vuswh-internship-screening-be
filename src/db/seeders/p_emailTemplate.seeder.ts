import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { EmailTemplate } from '../entities/email_template.entity';
import { User } from '../entities/user.entity';

export default class emailtemplateSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const emailtemplateRepository = dataSource.getRepository(EmailTemplate);
    const UserM6 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'sawan' } });

    await emailtemplateRepository.insert([
      {
        subject: 'Confirmation',
        content: `<!DOCTYPE html>
                      <html lang="en">
                      
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Set Your Password</title>
                      </head>
                      
                      <body>
                        <h1>Set Your Password</h1>
                        <p>Dear {{useremail}},</p>
                        <p>Well to Internship Screening System<p>
                        <p>Your Account has been Created<p>
                        <p>We have sent you a verification link to set your password.Create your Password and Confirm your accout. Please click on the link below:</p>
                        <p><a href="{{resetPasswordLink}}">resetPasswordLink</a></p>
                        <p>If you did not request this change, please ignore this email.</p>
                      </body>
                      
                      </html>`,
        created_at: new Date(),
        createdby: UserM6,
      },
      {
        subject: 'Forgot Password',
        content: `<!DOCTYPE html>
                      <html lang="en">
                      
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Set Your Password</title>
                      </head>
                      
                      <body>
                        <h1>Set Your Password</h1>
                        <p>Dear {{useremail}},</p>
                        <p>We have sent you a Reset Password link to set your password. Please click on the link below:</p>
                        <p><a href="{{resetPasswordLink}}">resetPasswordLink</a></p>
                        <p>If you did not request this change, please ignore this email.</p>
                      </body>
                      
                      </html>`,
        created_at: new Date(),
        createdby: UserM6,
      },
      {
        subject: 'Reason Of Rejection',
        content: `<!DOCTYPE html>
              <html lang="en">
              
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rejection Letter</title>
              </head>
              
              <body>
                <div>
                  <h1>Dear {{name}},</h1>
                  <p>We regret to inform you that your application has been rejected.</p>
                  <p><strong>Reason for Rejection:</strong> {{reason}}</p>
                  <p>We appreciate your interest and effort.</p>
                  <p>Best regards,
                  <p>The Internship management</p></p>
                  <p>IF Your are not ask for this email please ignore it its just testing emails</p>
                </div>
              </body>
              
              </html>
              `,
        created_at: new Date(),
        createdby: UserM6,
      },
      {
        subject: 'Invitation for Joining',
        content: `<!DOCTYPE html>
              <html lang="en">
              
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Internship Invitation</title>
              </head>
              
              <body >
              
                <div>
              
                  <h2 >Internship Invitation</h2>
              
                  <p>Hello {{name}}</p>
              
                  <p>Congratulations! We are pleased to offer you an internship position with Virtual university software house. Your skills and qualifications have impressed us, and we believe you will make valuable contributions to our team.</p>
              
                  <p><strong>Internship Details:</strong></p>
              
                  <ul>
                    <li><strong>Start Date:{{body}}</strong></li>
                    <li><strong>Duration:</strong>1 year and Two consecutive semesters </li>
                    <li><strong>Location:</strong>VU Software House Lawrance Road, Lahore, Punjab, Pakistan</li>
                  </ul>
              
                  <p> We look forward to your positive response and to welcoming you as part of our team.</p>
              
                  <p>If you have any questions or need further clarification, feel free to contact us at <strong>wajahathashmi@vu.edu.pk</strong>.</p>
              
                  <p>Best Regards,<br> Coordinator:wajahat hashmi<br> Coordinator<br> Virtual University</p>
              
                </div>
              
              </body>
              
              </html>`,
        created_at: new Date(),
        createdby: UserM6,
      },
      {
        subject: 'Invitation for Test',
        content: `<!DOCTYPE html>
              <html lang="en">
              
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Test Schedules</title>
              </head>
              
              <body>
                <div>
                  <h1>Dear {{name}},</h1>
                  <p>This is to confirm your appointment for the upcoming test.</p>
                  <p><strong>Test Date:</strong> {{test_date}}</p>
                  <p><strong>Test Address:</strong> {{test_address}}</p>
                  <p>Please ensure that you arrive on time and bring all necessary documents.</p>
                  <p>Best regards,</p>
                  <p>Virtural University of Pakistan</p>
                </div>
              </body>
              
              </html>`,
        created_at: new Date(),
        createdby: UserM6,
      },
    ]);
  }
}
