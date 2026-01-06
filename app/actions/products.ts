// app/actions/products.ts
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { productSchema, type ProductInput } from '@/lib/validation'

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  inStock?: boolean
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const skip = (page - 1) * limit

  const where: any = {
    userId: session.user.id,
  }

  if (search) {
    where.name = { contains: search, mode: 'insensitive' }
  }

  if (category) {
    where.category = category
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  if (inStock !== undefined) {
    where.status = inStock ? 'in_stock' : 'out_of_stock'
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export async function createProduct(data: ProductInput) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const validated = productSchema.parse(data)

  const product = await prisma.product.create({
    data: {
      ...validated,
      userId: session.user.id,
      status: validated.stock > 0 ? 'in_stock' : 'out_of_stock',
    },
  })

  return product
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product || product.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  const validated = productSchema.partial().parse(data)

  const status = validated.stock !== undefined ? (validated.stock > 0 ? 'in_stock' : 'out_of_stock') : undefined

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...validated,
      ...(status && { status }),
    },
  })

  return updated
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Verify ownership
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product || product.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  await prisma.product.delete({
    where: { id },
  })

  return { success: true }
}

export async function getProductStats() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
  })

  // Category distribution
  const categoryStats = products.reduce(
    (acc, product) => {
      const existing = acc.find((p) => p.category === product.category)
      if (existing) {
        existing.count++
      } else {
        acc.push({ category: product.category, count: 1 })
      }
      return acc
    },
    [] as Array<{ category: string; count: number }>
  )

  // Stock availability
  const inStock = products.filter((p) => p.status === 'in_stock').length
  const outOfStock = products.length - inStock

  // Price distribution
  const priceRanges = {
    '0-100': products.filter((p) => p.price < 100).length,
    '100-500': products.filter((p) => p.price >= 100 && p.price < 500).length,
    '500-1000': products.filter((p) => p.price >= 500 && p.price < 1000).length,
    '1000+': products.filter((p) => p.price >= 1000).length,
  }

  // Products over time (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const productsOverTime = products
    .filter((p) => p.createdAt >= thirtyDaysAgo)
    .reduce(
      (acc, product) => {
        const date = product.createdAt.toISOString().split('T')[0]
        const existing = acc.find((p) => p.date === date)
        if (existing) {
          existing.count++
        } else {
          acc.push({ date, count: 1 })
        }
        return acc
      },
      [] as Array<{ date: string; count: number }>
    )

  return {
    categoryStats,
    stockAvailability: {
      inStock,
      outOfStock,
    },
    priceDistribution: priceRanges,
    productsOverTime,
    totalProducts: products.length,
  }
}
