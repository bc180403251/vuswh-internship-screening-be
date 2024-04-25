import { PartialType } from '@nestjs/swagger';
import { CreatePhaseHistoryDto } from './create-phase_history.dto';

export class UpdatePhaseHistoryDto extends PartialType(CreatePhaseHistoryDto) {
}
