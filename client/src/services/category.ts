import { api } from "./api"

export interface Category {
  id: number
  name: string
}

export interface CategoryDetail {
  id: number
  name: string
  isStandard: boolean
  globalLimit: number | null
  globalSpent: number
}

export interface CategoryRequest {
  name: string
  limit?: number
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/category/list")
  return data
}

export const getCategoriesDetail = async (): Promise<CategoryDetail[]> => {
  const { data } = await api.get<CategoryDetail[]>("/category")
  return data
}

export const createCategory = async (body: CategoryRequest): Promise<CategoryDetail> => {
  const { data } = await api.post<CategoryDetail>("/category", body)
  return data
}

export const updateCategory = async (id: number, body: CategoryRequest): Promise<CategoryDetail> => {
  const { data } = await api.put<CategoryDetail>(`/category/${id}`, body)
  return data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/category/${id}`)
}
