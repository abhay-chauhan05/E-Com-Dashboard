// components/ProductForm.tsx
'use client'

import { useState } from 'react'
import { ProductInput } from '@/lib/validation'

interface ProductFormProps {
  onSubmit: (data: ProductInput) => Promise<void>
  initialData?: ProductInput & { id?: string }
  isLoading?: boolean
}

export function ProductForm({ onSubmit, initialData, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductInput>(
    initialData || {
      name: '',
      category: '',
      price: 0,
      stock: 0,
    }
  )
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : name === 'stock' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await onSubmit(formData)
      if (!initialData) {
        setFormData({ name: '', category: '', price: 0, stock: 0 })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-4">
          <div className="text-sm font-medium text-purple-700">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-blue-900">
          Product Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full rounded-md border-2 border-blue-300 px-3 py-2 text-blue-900 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-blue-900">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          className="mt-1 block w-full rounded-md border-2 border-blue-300 px-3 py-2 text-blue-900 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-blue-900">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-2 border-blue-300 px-3 py-2 text-blue-900 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-blue-900">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            required
            className="mt-1 block w-full rounded-md border-2 border-blue-300 px-3 py-2 text-blue-900 placeholder-blue-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? 'Saving...' : initialData?.id ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  )
}
