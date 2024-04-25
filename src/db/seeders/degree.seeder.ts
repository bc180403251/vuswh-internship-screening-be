import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { degrees } from "../entities/degree.entity";

export default class degreesSeeder implements Seeder {
   public async run(
      dataSource: DataSource,
   ): Promise<void> {
      const degreesRepository = dataSource.getRepository(degrees)

      await degreesRepository.insert([
         {
            title: 'MCS',
         },
         {
            title: 'MIT',
         },
         {
            title: 'BSCS',
         },
         {
            title: 'BSIT',
         },
         {
            title: 'BSSE',
         }
      ])
   }
}