import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Student } from "../entities/student.entity";
import { degrees } from "../entities/degree.entity";
import { User } from "../entities/user.entity";

export default class studentSeeder implements Seeder {
   public async run(
      dataSource: DataSource,
   ): Promise<void> {
      const studentRepository = dataSource.getRepository(Student)
      const DegreeM1 = await dataSource.getRepository(degrees).findOne({ where: { title: 'MCS' } })
      const DegreeM2 = await dataSource.getRepository(degrees).findOne({ where: { title: 'MIT' } })
      const DegreeM3 = await dataSource.getRepository(degrees).findOne({ where: { title: 'BSCS' } })
      const DegreeM4 = await dataSource.getRepository(degrees).findOne({ where: { title: 'BSIT' } })
      const DegreeM5 = await dataSource.getRepository(degrees).findOne({ where: { title: 'BSSE' } })
      const UserM3 = await dataSource.getRepository(User).findOne({ where: { username: 'mc220203482uma' } })
      const UserM4 = await dataSource.getRepository(User).findOne({ where: { username: 'bc190402469' } })
      const UserM5 = await dataSource.getRepository(User).findOne({ where: { username: 'bc190402372' } })
      const UserM6 = await dataSource.getRepository(User).findOne({ where: { username: 'bc190402701' } })
      const UserM7 = await dataSource.getRepository(User).findOne({ where: { username: 'mc220200610iya' } })
      const UserM8 = await dataSource.getRepository(User).findOne({ where: { username: 'bc210427979mah' } })
      const UserM9 = await dataSource.getRepository(User).findOne({ where: { username: 'bc180403251' } })
      const UserM10 = await dataSource.getRepository(User).findOne({ where: { username: 'bc180402941' } })
      const UserM11 = await dataSource.getRepository(User).findOne({ where: { username: 'bc200201108' } })
      const UserM12 = await dataSource.getRepository(User).findOne({ where: { username: 'mc220201542mer' } })
      const UserM13 = await dataSource.getRepository(User).findOne({ where: { username: 'bc200200801' } })
      const UserM14 = await dataSource.getRepository(User).findOne({ where: { username: 'mc220202075jbi' } })

      await studentRepository.insert([
         {
            name: 'Muhammad Umair',
            vuid: 'mc220203482',
            phone: '+923034947550',
            cnic: '37105-1254842-1',
            degree: DegreeM2,
            user: UserM3,
         },
         {
            name: 'Elsa Mahmood',
            vuid: 'bc190402469',
            phone: '+923034949554',
            cnic: '37104-2654882-8',
            degree: DegreeM4,
            user: UserM4,
         },
         {
            name: 'Kainat Rajpoot',
            vuid: 'bc190402372',
            phone: '+923034949564',
            cnic: '37105-2652825-2',
            degree: DegreeM3,
            user: UserM5,
         },
         {
            name: 'Fareed Zafar',
            vuid: 'bc190402701',
            phone: '+923034948880',
            cnic: '37103-2162852-4',
            degree: DegreeM4,
            user: UserM6,
         },
         {
            name: 'Iqra Yasmeen',
            vuid: 'mc220200610',
            phone: '+923124948981',
            cnic: '37101-2261812-1',
            degree: DegreeM1,
            user: UserM7,
         },
         {
            name: 'Ahmed Ali',
            vuid: 'bc210427979',
            phone: '+923135949949',
            cnic: '37104-6232852-2',
            degree: DegreeM5,
            user: UserM8,
         },
         {
            name: 'Mohsan Ali',
            vuid: 'bc180403251',
            phone: '+923034947550',
            cnic: '37102-2582612-4',
            degree: DegreeM1,
            user: UserM9,
         },
         {
            name: 'Muhammad Bilal',
            vuid: 'bc180402941',
            phone: '+923134648558',
            cnic: '37103-2162118-1',
            degree: DegreeM3,
            user: UserM10,
         },
         {
            name: 'Waqar Ahmad',
            vuid: 'bc200201108',
            phone: '+923154648661',
            cnic: '37106-2261441-5',
            degree: DegreeM1,
            user: UserM11,
         },
         {
            name: 'Meral Khan',
            vuid: 'mc220201542',
            phone: '+923164649781',
            cnic: '37105-2262063-1',
            degree: DegreeM3,
            user: UserM12,
         },
         {
            name: 'Usman',
            vuid: 'bc200200801',
            phone: '+923114645234',
            cnic: '37105-3602026-9',
            degree: DegreeM2,
            user: UserM13,
         },
         {
            name: 'Jaweria BiBi',
            vuid: 'mc220202075',
            phone: '+923066425629',
            cnic: '37103-2162118-2',
            degree: DegreeM2,
            user: UserM14,
         }
      ])
   }

}