import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const productLimit = limit || 10;
    const actualPage = page || 1;

    const totalPages = await this.prisma.product.count();

    const totalPoducts = await this.prisma.product.findMany({
      skip: (actualPage - 1) * productLimit,
      take: limit,
    });

    const lastPage = Math.ceil(totalPages / productLimit);
    return {
      data: totalPoducts,
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const productToUpdate = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    return productToUpdate;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
