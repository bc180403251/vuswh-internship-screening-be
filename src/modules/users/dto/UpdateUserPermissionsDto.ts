import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPermissionsDto {
  @ApiProperty()
  permissionIds: string[];
}
