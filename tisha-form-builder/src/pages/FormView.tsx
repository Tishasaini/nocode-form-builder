import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Form } from '../types/form';

export function FormView() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    const { data } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      setForm(data as Form);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form) {
      await supabase.from('form_responses').insert({
        form_id: form.id,
        response_data: formData
      });
      
      setSubmitted(true);
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
        <p className="mt-2 text-gray-600">Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{form.title}</h1>
      {form.description && (
        <p className="text-gray-600 mb-8">{form.description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                required={field.required}
                placeholder={field.placeholder}
                onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}

            {/* Add other field types here */}
          </div>
        ))}

        <div className="pt-5">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}