import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { CreateFormulaDto } from './dto/create-formula.dto';
import { UpdateFormulaDto } from './dto/update-formula.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('formulas')
@UseGuards(JwtAuthGuard)
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.formulasService.findAll(req.user.atelierId);
  }

  @Post()
  create(@Body() dto: CreateFormulaDto, @Request() req: any) {
    return this.formulasService.create(dto, req.user.atelierId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFormulaDto, @Request() req: any) {
    return this.formulasService.update(id, dto, req.user.atelierId);
  }
}
