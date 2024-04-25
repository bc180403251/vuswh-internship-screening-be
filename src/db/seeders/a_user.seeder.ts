import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "../entities/user.entity";

export default class usersSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<void> {
        const userRepository = dataSource.getRepository(User)

        await userRepository.insert([
            {
                fullname: 'Sarfraz Ahmad',
                username: 'sawan',
                email: 'sawan@vu.edu.pk',
                phone: '+923534947897',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'wajahat Hashmi',
                username: 'wajahat.hashmi',
                email: 'wajahat.hashmi@vu.edu.pk',
                phone: '+923534947591',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Mian Umair',
                username: 'mc220203482uma',
                email: 'mc220203482uma@vu.edu.pk',
                phone: '+923034947550',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Elsa Mahmood',
                username: 'bc190402469',
                email: 'bc190402469@vu.edu.pk',
                phone: '+923034947550',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'kianat Rajpoot',
                username: 'bc190402372',
                email: 'bc190402372@vu.edu.pk',
                phone: '+923034949554',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Fareed Zafar',
                username: 'bc190402701',
                email: 'bc190402701@vu.edu.pk',
                phone: '+923034949564',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Iqra Yasmeen',
                username: 'mc220200610iya',
                email: 'mc220200610iya@vu.edu.pk',
                phone: '+923034948880',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Muhammad Ahmad',
                username: 'bc210427979mah',
                email: 'bc210427979mah@vu.edu.pk',
                phone: '+923124948981',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Mohsan Ali',
                username: 'bc180403251',
                email: 'bc180403251@vu.edu.pk',
                phone: '+923135949949',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Muhammad Bilal',
                username: 'bc180402941',
                email: 'bc180402941@vu.edu.pk',
                phone: '+923034947550',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Waqar Ahmad',
                username: 'bc200201108',
                email: 'bc200201108@vu.edu.pk',
                phone: 's+923134648558',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Meral Khan',
                username: 'mc220201542mer',
                email: 'mc220201542mer@vu.edu.pk',
                phone: '+923154648661',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Usman',
                username: 'bc200200801',
                email: 'bc200200801@vu.edu.pk',
                phone: '+923164649781',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null

            },
            {
                fullname: 'Jawairia Bibi',
                username: 'mc220202075jbi',
                email: 'mc220202075jbi@vu.edu.pk',
                phone: '+923066425629',
                password: '$2a$12$yMhXMlI2RC5CTar1SVXzYu20RIZYMImgctiiPEJrjlsHoRW4EtlGS',
                is_active: true,
                is_validated: true,
                created_at: new Date(),
                reset_code_upto: null,
                reset_till: null,
                reset_pass_code: null,
                profile_pic: null,
                login_token: null,
                updated_at: new Date(),
                deleted_at: null
            },
        ])
    }
}