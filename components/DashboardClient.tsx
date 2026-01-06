'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Product } from '@prisma/client'
import { ProductForm } from '@/components/ProductForm'
import { ProductTable } from '@/components/ProductTable'
import { DashboardCharts } from '@/components/Charts'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from '@/app/actions/products'
import { ProductInput } from '@/lib/validation'

export default function DashboardClient() {
  const { data: session } = useSession()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<(Product & { id: string }) | null>(null)
  const [activeTab, setActiveTab] = useState('products')

  // Load products
  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const result = await getProducts(page, 10, search, category)
      setProducts(result.products)
      setTotal(result.total)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Load stats
  const loadStats = async () => {
    try {
      const data = await getProductStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  useEffect(() => {
    if (session?.user) {
      loadProducts()
      loadStats()
    }
  }, [page, search, category, session])

  const handleCreateProduct = async (data: ProductInput) => {
    try {
      await createProduct(data)
      setShowAddForm(false)
      await loadProducts()
      await loadStats()
    } catch (err) {
      throw err
    }
  }

  const handleUpdateProduct = async (data: ProductInput) => {
    if (!editingProduct) return

    try {
      await updateProduct(editingProduct.id, data)
      setEditingProduct(null)
      await loadProducts()
      await loadStats()
    } catch (err) {
      throw err
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      await loadProducts()
      await loadStats()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
  }

  if (!session) {
    return null
  }

  const pages = Math.ceil(total / 10)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-amber-500 border-b border-teal-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Product Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-100 dark:text-blue-200">Welcome, {session.user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-white text-sm font-medium bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-600 hover:to-amber-600 smooth-transition"
            >
              Logout
            </button> 
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'products'
                ? 'border-blue-600 text-blue-600 dark:text-blue-300'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium border-b-2 ${
              activeTab === 'analytics'
                ? 'border-purple-600 text-purple-600 dark:text-purple-300'
                : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-lg border-2 border-teal-300 dark:border-gray-700 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 p-6 card">
                <div className="text-sm font-medium text-teal-700 dark:text-teal-200">Total Products</div>
                <div className="mt-2 text-3xl font-bold text-teal-900 dark:text-teal-100">{total}</div>
              </div>
              {stats && (
                <>
                  <div className="rounded-lg border-2 border-emerald-300 dark:border-gray-700 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 p-6 card">
                    <div className="text-sm font-medium text-emerald-700 dark:text-emerald-200">In Stock</div>
                    <div className="mt-2 text-3xl font-bold text-emerald-900 dark:text-gray-100">
                      {stats.stockAvailability.inStock}
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-amber-300 dark:border-gray-700 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 p-6 card">
                    <div className="text-sm font-medium text-amber-700 dark:text-amber-200">Out of Stock</div>
                    <div className="mt-2 text-3xl font-bold text-amber-900 dark:text-gray-100">
                      {stats.stockAvailability.outOfStock}
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-sky-300 dark:border-gray-700 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900 dark:to-sky-800 p-6 card">
                    <div className="text-sm font-medium text-sky-700 dark:text-sky-200">Categories</div>
                    <div className="mt-2 text-3xl font-bold text-sky-900 dark:text-gray-100">
                      {stats.categoryStats.length}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Add/Edit Product Form */}
            {(showAddForm || editingProduct) && (
              <div className="rounded-lg border-2 border-blue-300 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 p-6 card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-blue-900 dark:text-gray-100">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProduct(null)
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✕
                  </button>
                </div>
                <ProductForm
                  onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  initialData={editingProduct || undefined}
                  isLoading={isLoading}
                />
              </div>
            )}

            {!showAddForm && !editingProduct && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 smooth-transition"
              >
                + Add Product
              </button>
            )}

            {/* Filters */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-lg p-4 space-y-4 card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Search Products
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-md placeholder-blue-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:bg-white dark:focus:bg-gray-800 transition smooth-transition"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    Filter by Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-md text-blue-900 dark:text-gray-200 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition smooth-transition"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-lg overflow-hidden">
              <ProductTable
                products={products}
                onEdit={(product) => setEditingProduct(product as Product & { id: string })}
                onDelete={handleDeleteProduct}
                isLoading={isLoading}
              />
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-md disabled:opacity-50 hover:bg-blue-50 transition font-medium"
                >
                  Previous
                </button>
                <span className="text-purple-600 font-semibold">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-md disabled:opacity-50 hover:bg-blue-50 transition font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && stats && (
          <div>
            <DashboardCharts
              categoryStats={stats.categoryStats}
              stockAvailability={stats.stockAvailability}
              priceDistribution={stats.priceDistribution}
              productsOverTime={stats.productsOverTime}
            />
          </div>
        )}

        {activeTab === 'analytics' && !stats && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        )}
      </div>
    </div>
  )
}
