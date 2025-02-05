/*
  # Form Builder Schema

  1. New Tables
    - `forms`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `fields` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key)
      - `is_published` (boolean)
      - `theme` (jsonb)
    
    - `form_responses`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key)
      - `response_data` (jsonb)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on both tables
    - Add policies for form creation and management
    - Add policies for form responses
*/

-- Create forms table
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    theme JSONB DEFAULT '{
        "primaryColor": "#4F46E5",
        "backgroundColor": "#F9FAFB",
        "textColor": "#111827",
        "fontFamily": "Inter"
    }'::jsonb
);

-- Create form responses table
CREATE TABLE form_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
    response_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Policies for forms
CREATE POLICY "Users can create forms"
    ON forms FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own forms"
    ON forms FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR is_published = true);

CREATE POLICY "Users can update their own forms"
    ON forms FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms"
    ON forms FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for form responses
CREATE POLICY "Anyone can submit form responses"
    ON form_responses FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Form owners can view responses"
    ON form_responses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM forms
            WHERE forms.id = form_responses.form_id
            AND forms.user_id = auth.uid()
        )
    );