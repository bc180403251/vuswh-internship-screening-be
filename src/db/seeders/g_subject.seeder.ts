import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Subject } from "../entities/subject.entity";
import { degrees } from "../entities/degree.entity";

export default class subjectSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<void> {
        const subjectRepository = dataSource.getRepository(Subject)
        const DegreeM1 = await dataSource.getRepository(degrees).findOne({ where: { title: 'MCS' } })
        const DegreeM2 = await dataSource.getRepository(degrees).findOne({ where: { title: 'MIT' } })
        const DegreeM3 = await dataSource.getRepository(degrees).findOne({ where: { title: 'BSCS' } })
        const DegreeM4 = await dataSource.getRepository(degrees).findOne({ where: { title: 'BSIT' } })
        const DegreeM5 = await dataSource.getRepository(degrees).findOne({ where: { title: 'BSSE' } })
        const subjectsM1 = subjectRepository.create([{
            code: 'CS201',
            title: 'Introduction To Programming',
            is_active:true,
            deleted_at:null,
            degrees: [DegreeM1, DegreeM2, DegreeM3, DegreeM4, DegreeM5],
        }])
        const subjectsM2 = subjectRepository.create([{
            code: 'CS301',
            title: 'Data Structure',
            is_active:true,
            deleted_at:null,
            degrees: [DegreeM1, DegreeM2, DegreeM3, DegreeM4, DegreeM5],
        }])
        const subjectsM3 = subjectRepository.create([{
            code: 'CS304',
            title: 'Object Oriented Programming',
            is_active:true,
            deleted_at:null,
            degrees: [DegreeM1, DegreeM2, DegreeM3, DegreeM4, DegreeM5],
        }])
        const subjectsM4 = subjectRepository.create([{
            code: 'CS403',
            title: 'Databases',
            is_active:true,
            deleted_at:null,
            degrees: [DegreeM1, DegreeM2, DegreeM3, DegreeM4, DegreeM5],
        }])
        const subjectsM5 = subjectRepository.create([{
            code: 'CS502',
            title: 'Analysis and Design of Algorithm',
            is_active:true,
            deleted_at:null,
            degrees: [DegreeM1, DegreeM2, DegreeM3, DegreeM4, DegreeM5],
        }])
        await subjectRepository.save(subjectsM1);
        await subjectRepository.save(subjectsM2);
        await subjectRepository.save(subjectsM3);
        await subjectRepository.save(subjectsM4);
        await subjectRepository.save(subjectsM5);
    }
}
