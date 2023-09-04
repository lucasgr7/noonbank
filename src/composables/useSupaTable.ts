import { supabase } from './supabase';
import { ref } from 'vue';

type TableColumns = {
  [columnName: string]: TableColumn;
};

type TableColumn = {
  type: string;
  nullable?: boolean;
};

export function useSupaTable<T>(tableName: string, columns: TableColumns) {
  const records = ref<T[]>();
  const error = ref();

  async function insertRecord(form: T) {
    const invalidInput = Object.entries(columns).some(
      ([name, { nullable }]) => !form[name] && !nullable
    );

    if (invalidInput) {
      error.value = 'Invalid input';
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([form])
        .select();

      if (insertError) throw insertError;

      await getRecords();
    } catch (err) {
      error.value = err;
    }
  }

  async function updateRecord(id: number, form: Partial<T>) {
    try {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(form)
        .eq('id', id);

      if (updateError) throw updateError;

      await getRecords();
    } catch (err) {
      error.value = err;
    }
  }

  async function getRecordById(id: number) {
    try {
      const { data, error: selectError } = await supabase
        .from(tableName)
        .select()
        .eq('id', id);

      if (selectError) throw selectError;

      return data ? data[0] : null;
    } catch (err) {
      error.value = err;
      return null;
    }
  }

  async function deleteRecord(id: number) {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await getRecords();
    } catch (err) {
      error.value = err;
    }
  }

  async function getRecords() {
    try {
      const { data, error: selectError } = await supabase.from(tableName).select();
      if (selectError) throw selectError;
      records.value = data;
    } catch (err) {
      error.value = err;
    }
  }

  return {
    records,
    error,
    insertRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    getRecordById
  };
}
