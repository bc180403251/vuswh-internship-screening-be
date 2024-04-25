import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { cities } from "../entities/city.entity";
export default class citiesSeeder implements Seeder {
   public async run(
      dataSource: DataSource,
   ): Promise<void> {

      const citiesRepository = dataSource.getRepository(cities)

      await citiesRepository.insert([
         {
            name: 'LAHORE',
         },
         {
            name: 'QUETTA',
         },
         {
            name: 'ISLAMABAD',
         },
         {
            name: 'ABBOTABAD',
         },
         {
            name: 'TURBAT',
         },
         {
            name: 'PESHAWAR',
         },
         {
            name: 'BAHAWALNAGAR',
         },
         {
            name: 'BAHAWALPUR',
         },
         {
            name: 'D.G.KHAN',
         },
         {
            name: 'FAISALABAD',
         },
         {
            name: 'GUJAR KHAN',
         }
      ])
   }
}