import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Copy, Trash2, FileSpreadsheet } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Form } from '../types/form';

export function Dashboard() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    const { data } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setForms(data as Form[]);
    }
  };

  const duplicateForm = async (form: Form) => {
    const newForm = {
      ...form,
      title: `${form.title} (Copy)`,
      is_published: false,
    };
    delete (newForm as any).id;
    delete (newForm as any).created_at;
    delete (newForm as any).updated_at;

    await supabase.from('forms').insert(newForm);
    loadForms();
  };

  const deleteForm = async (id: string) => {
    await supabase.from('forms').delete().eq('id', id);
    loadForms();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
        <Link
          to="/builder"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
          <div className="mt-6">
            <Link
              to="/builder"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {forms.map((form) => (
              <li key={form.id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {form.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Created on {new Date(form.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/responses/${form.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Responses
                    </Link>
                    <Link
                      to={`/builder/${form.id}`}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => duplicateForm(form)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}