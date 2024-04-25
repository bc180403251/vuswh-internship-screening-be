import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cities } from 'src/db/entities/city.entity';
import { CITY_SERVICE } from 'src/common/constants';

@Module({
  imports: [TypeOrmModule.forFeature([cities])],
  controllers: [CityController],
  providers: [
    {
      provide: CITY_SERVICE,
      useClass: CityService,
    },
  ],
  exports: [CITY_SERVICE],
})
export class CityModule {}
// @Module({
//   imports: [
//     TypeOrmModule.forFeature([StudentRegistration]),
//     StudentsModule,
//     BatchesModule,
//     UsersModule,
//   ],
