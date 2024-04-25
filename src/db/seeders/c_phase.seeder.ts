import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Phases } from "../entities/phases.entity";

export default class phaseSeeder implements Seeder {
   public async run(
      dataSource: DataSource,
   ): Promise<void> {

      const phaseRepository = dataSource.getRepository(Phases)

      await phaseRepository.insert([
         {
            name: 'Registered',
            sequence: 1,
         },
         {
            name: 'Shortlisted',
            sequence: 2,
         },
         {
            name: 'Rejected',
            sequence: 3,
         },
         {
            name: 'Assessment',
            sequence: 4,
         },
         {
            name: 'Recommended',
            sequence: 5,
         },
         {
            name: 'Not Recommended',
            sequence: 6,
         },
         {
            name: 'Invited',
            sequence: 7,
         },
         {
            name: 'Joined',
            sequence: 8,
         },
         {
            name: 'Not Joined',
            sequence: 9,
         },
         {
            name: 'Quite',
            sequence: 10,
         },
         {
            name: 'Passout',
            sequence: 11,
         }
      ])
   }
}
