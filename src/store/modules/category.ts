import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/utils/api";
import type { Category } from "@/types/category";

export const useCategoryStore = defineStore("category", () => {
  const categoryData = ref<Category[]>([]);

  const getCategory = async (): Promise<void> => {
    try {
      const res = await api.get("/categories");
      categoryData.value = res.data.categories;
    } catch (err) {
      console.error(err);
    }
  };

  return { categoryData, getCategory };
});
