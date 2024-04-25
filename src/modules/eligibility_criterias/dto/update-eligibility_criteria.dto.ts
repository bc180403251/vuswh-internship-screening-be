import { PartialType } from '@nestjs/swagger';
import { CreateEligibilityCriteriaDto } from './create-eligibility_criteria.dto';

export class UpdateEligibilityCriteriaDto extends PartialType(CreateEligibilityCriteriaDto) {
    // degreeIds: string;
}
