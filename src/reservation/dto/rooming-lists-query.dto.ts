import { IsOptional, IsString, IsIn } from 'class-validator';

export class RoomingListsQueryDTO {
  @IsOptional()
  @IsString()
  rfpName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['leisure', 'staff', 'artist'])
  agreement_type?: string;
}
