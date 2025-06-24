import { User, Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email', required: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'User role', enum: Role })
  userRole: Role;

  @ApiProperty({ description: 'Is user email verified' })
  emailVerified: boolean | null;

  @ApiProperty({ description: 'Is user phone verified' })
  phoneVerified: boolean | null;
}
