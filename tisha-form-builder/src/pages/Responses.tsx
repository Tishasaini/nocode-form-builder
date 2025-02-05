import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Form, FormResponse } from '../types/form';

export function Responses() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);

  useEffect(() => {
    if (id) {
      loadFormAndResponses();
    }
  }, [id]);

  const loadFormAndResponses = async () => {
    const [formResult, responsesResult] = await Promise.all([
      supabase.from('forms').select('*').eq('id', id).single(),
      supabase.from('form_responses').select('*').eq('form_id', id)
    ]);

    if (formResult.data) {
      setForm(formResult.data as Form);
    }

    if (responsesResult.data) {
      setResponses(responsesResult.data as FormResponse[]);
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Responses for {form.title}
        </h1>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Share your form to start collecting responses.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                {form.fields.map(field => (
                  <th
                    key={field.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responses.map(response => (
                <tr key={response.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(response.created_at).toLocaleDateString()}
                  </td>
                  {form.fields.map(field => (
                    <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {response.response_data[field.id]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}