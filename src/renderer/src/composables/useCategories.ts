import _ from 'lodash';
import { supabase } from './supabase';
import { computed, ref } from 'vue';

export interface Category{
  id: number;
  name:  string;
  color_font: string;
  background_color: string;
}
const categories = ref<Category[]>();

export function useCategories() {
  const error = ref();
  const isValidColor = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

  const getCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select();
      if (error) throw error;
      categories.value = data;
    } catch (err) {
      error.value = err;
    }
  };

  const insertCategory = async (form: {name: string, colorFont: string, backgroundColor: string}) => {
    // check object properties
    if(_.isEmpty(form)) return;

    if (!form.name || !isValidColor(form.colorFont) || !isValidColor(form.backgroundColor)) {
      error.value = 'Invalid input';
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .insert([
          {
            name: form.name,
            color_font: form.colorFont,
            background_color: form.backgroundColor,
          },
        ]);
      if (error) throw error;
      await getCategories(); // Refresh categories
    } catch (err) {
      error.value = err;
    }
  };

  // key (id) - value (name) of category into an computed
  const categoryLookupTable = computed(() => {
    return categories.value?.reduce((acc, category) => {
      acc[category.id] = {
        name: category.name,
        primaryColor: category.background_color,
      };
      return acc;
    }, {} as Record<number, {name: string, primaryColor: string}>);
  });

  return {
    categories,
    error,
    getCategories,
    insertCategory,
    categoryLookupTable
  };
}
