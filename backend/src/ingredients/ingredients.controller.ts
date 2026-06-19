import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.ingredientsService.findAll(req.user.atelierId);
  }

  @Post()
  create(@Body() dto: CreateIngredientDto, @Request() req: any) {
    return this.ingredientsService.create(dto, req.user.atelierId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIngredientDto, @Request() req: any) {
    return this.ingredientsService.update(id, dto, req.user.atelierId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.ingredientsService.remove(id, req.user.atelierId);
  }
}
