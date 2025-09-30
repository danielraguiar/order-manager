import { PartialType } from '@nestjs/swagger';
import { CreatePratoDto } from './create-prato.dto';

export class UpdatePratoDto extends PartialType(CreatePratoDto) {}
