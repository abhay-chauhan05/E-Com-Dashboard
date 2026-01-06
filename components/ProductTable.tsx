// components/ProductTable.tsx
'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'

interface ProductTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => Promise<void>
  isLoading?: boolean
}

export function ProductTable({ products, onEdit, onDelete, isLoading }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeletingId(id)
    try {
      await onDelete?.(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border-2 border-blue-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-800 p-8 text-center card">
        <p className="text-blue-600 dark:text-blue-300">No products found. Create your first product!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b-2 border-slate-300 bg-gradient-to-r from-teal-100 to-amber-100 dark:bg-gray-800 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-blue-900 dark:text-gray-200">Product</th>
            <th className="px-6 py-3 text-left font-semibold text-blue-900 dark:text-gray-200">Category</th>
            <th className="px-6 py-3 text-left font-semibold text-blue-900 dark:text-gray-200">Price</th>
            <th className="px-6 py-3 text-left font-semibold text-blue-900 dark:text-gray-200">Stock</th>
            <th className="px-6 py-3 text-left font-semibold text-blue-900 dark:text-gray-200">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-blue-900 dark:text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-blue-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
              <td className="px-6 py-4 font-medium text-blue-900 dark:text-gray-100">{product.name}</td>
              <td className="px-6 py-4 text-blue-700 dark:text-blue-300">{product.category}</td>
              <td className="px-6 py-4 text-blue-700 dark:text-blue-300">${product.price.toFixed(2)}</td>
              <td className="px-6 py-4 text-blue-700 dark:text-blue-300">{product.stock}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    product.status === 'in_stock'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50 hover:underline"
                  >
                    {deletingId === product.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
