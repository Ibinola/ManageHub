import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const slug = this.generateSlug(createProductDto.name);

        // Check if slug exists
        const existingProduct = await this.productRepository.findOne({ where: { slug } });
        if (existingProduct) {
            // If it exists, append a random string or counter (simplified here as conflict)
            throw new ConflictException(`Product with slug "${slug}" already exists`);
        }

        const product = this.productRepository.create({
            ...createProductDto,
            slug,
        });

        return await this.productRepository.save(product);
    }

    async findAll(query: {
        page?: number;
        limit?: number;
        isActive?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }) {
        const { page = 1, limit = 10, isActive, minPrice, maxPrice } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = Between(minPrice, maxPrice);
        } else if (minPrice !== undefined) {
            where.price = MoreThanOrEqual(minPrice);
        } else if (maxPrice !== undefined) {
            where.price = LessThanOrEqual(maxPrice);
        }

        const [items, total] = await this.productRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);

        const updateData = updateProductDto as any;
        if (updateData.name && updateData.name !== product.name) {
            product.slug = this.generateSlug(updateData.name);
        }

        Object.assign(product, updateProductDto);
        return await this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.softRemove(product);
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
}
