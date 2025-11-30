import { ref, computed } from "vue";
import type { Ref } from "vue";

export function useListManager<T>() {
  const items: Ref<T[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchItems = async (fetchFn: () => Promise<T[]>) => {
    loading.value = true;
    error.value = null;
    try {
      items.value = await fetchFn();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取数据失败";
    } finally {
      loading.value = false;
    }
  };

  const addItem = (item: T) => {
    items.value.push(item);
  };

  const removeItem = (predicate: (item: T) => boolean) => {
    const index = items.value.findIndex(predicate);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const updateItem = (predicate: (item: T) => boolean, updates: Partial<T>) => {
    const item = items.value.find(predicate);
    if (item) {
      Object.assign(item, updates);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    removeItem,
    updateItem
  };
}

export function useFormManager<T extends Record<string, any>>(initialData: T) {
  const formData = ref<T>({ ...initialData });
  const errors = ref<Record<string, string>>({});
  const submitting = ref(false);

  const validateField = (field: keyof T, validator: (value: any) => string | null) => {
    const error = validator(formData.value[field]);
    if (error) {
      errors.value[field as string] = error;
    } else {
      delete errors.value[field as string];
    }
    return !error;
  };

  const validateForm = (validators: Record<keyof T, (value: any) => string | null>): boolean => {
    errors.value = {};
    let isValid = true;

    for (const [field, validator] of Object.entries(validators)) {
      const error = validator(formData.value[field]);
      if (error) {
        errors.value[field] = error;
        isValid = false;
      }
    }
    return isValid;
  };

  const resetForm = () => {
    formData.value = { ...initialData };
    errors.value = {};
  };

  return {
    formData,
    errors,
    submitting,
    validateField,
    validateForm,
    resetForm
  };
}

export function useFilterManager<T>() {
  const filters = ref<Record<string, any>>({});
  const filteredItems = computed(() => {
    // 在实际使用中，这里会根据filters.value来过滤items
    return [] as T[];
  });

  const updateFilter = (key: string, value: any) => {
    filters.value[key] = value;
  };

  const clearFilters = () => {
    filters.value = {};
  };

  return {
    filters,
    filteredItems,
    updateFilter,
    clearFilters
  };
}
