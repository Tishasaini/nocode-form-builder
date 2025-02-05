export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'select' | 'radio' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  created_at: string;
  updated_at: string;
  user_id: string;
  is_published: boolean;
  theme: FormTheme;
}

export interface FormResponse {
  id: string;
  form_id: string;
  response_data: Record<string, any>;
  created_at: string;
  user_id?: string;
}