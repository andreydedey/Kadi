import { api } from "./api"

export interface Category {
  id: number
  name: string
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>("/category/list")
  return data
}
