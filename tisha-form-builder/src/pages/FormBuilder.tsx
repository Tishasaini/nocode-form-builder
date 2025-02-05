import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Form, FormField } from '../types/form';

export function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    id: '',
    title: 'Untitled Form',
    description: '',
    fields: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '',
    is_published: false,
    theme: {
      primaryColor: '#4F46E5',
      backgroundColor: '#F9FAFB',
      textColor: '#111827',
      fontFamily: 'Inter'
    }
  });

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

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      required: false,
      ...(type === 'select' || type === 'radio' ? { options: ['Option 1'] } : {})
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (id: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setForm(prev => {
        const oldIndex = prev.fields.findIndex(field => field.id === active.id);
        const newIndex = prev.fields.findIndex(field => field.id === over.id);
        
        return {
          ...prev,
          fields: arrayMove(prev.fields, oldIndex, newIndex)
        };
      });
    }
  };

  const saveForm = async () => {
    if (id) {
      await supabase
        .from('forms')
        .update(form)
        .eq('id', id);
    } else {
      const { data } = await supabase
        .from('forms')
        .insert(form)
        .select()
        .single();
      
      if (data) {
        navigate(`/builder/${data.id}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0"
          placeholder="Form Title"
        />
        <button
          onClick={saveForm}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </button>
      </div>

      <textarea
        value={form.description || ''}
        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-2 border rounded-md"
        placeholder="Form Description (optional)"
      />

      <div className="space-y-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={form.fields} strategy={verticalListSortingStrategy}>
            {/* Field list will go here */}
          </SortableContext>
        </DndContext>

        <div className="flex gap-2">
          <button
            onClick={() => addField('text')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Text Field
          </button>
          <button
            onClick={() => addField('textarea')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Text Area
          </button>
          <button
            onClick={() => addField('select')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dropdown
          </button>
          <button
            onClick={() => addField('radio')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Radio Group
          </button>
          <button
            onClick={() => addField('checkbox')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Checkbox
          </button>
        </div>
      </div>
    </div>
  );
}