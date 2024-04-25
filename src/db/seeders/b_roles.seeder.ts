import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
// console.log('Seeding start...');
export default class rolesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);
    const UserM1 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'sawan' } });
    const UserM2 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'wajahat.hashmi' } });
    const UserM3 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'mc220203482uma' } });
    const UserM4 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc190402469' } });
    const UserM5 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc190402372' } });
    const UserM6 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc190402701' } });
    const UserM7 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'mc220200610iya' } });
    const UserM8 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc210427979mah' } });
    const UserM9 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc180403251' } });
    const UserM10 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc180402941' } });
    const UserM11 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc200201108' } });
    const UserM12 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'mc220201542mer' } });
    const UserM13 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'bc200200801' } });
    const UserM14 = await dataSource
      .getRepository(User)
      .findOne({ where: { username: 'mc220202075jbi' } });

    const role1 = roleRepository.create([
      {
        name: 'admin',
        users: [UserM1],
      },
    ]);
    const role2 = roleRepository.create([
      {
        name: 'teacher',
        // users: [UserM3],
      },
    ]);
    const role3 = roleRepository.create([
      {
        name: 'student',
        users: [
          UserM4,
          UserM3,
          UserM5,
          UserM6,
          UserM7,
          UserM8,
          UserM9,
          UserM10,
          UserM11,
          UserM12,
          UserM13,
          UserM14,
        ],
      },
    ]);
    const role4 = roleRepository.create([
      {
        name: 'incharge',
        // users: [UserM3,],
      },
    ]);
    const role5 = roleRepository.create([
      {
        name: 'Coordinator',
        users: [UserM2],
      },
    ]);
    await roleRepository.save(role1);
    await roleRepository.save(role2);
    await roleRepository.save(role3);
    await roleRepository.save(role4);
    await roleRepository.save(role5);
  }
}
