import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Please fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export const STORAGE_BUCKET = 'person-docs';

// ---- Types ----

export interface PersonRecord {
  id: string;
  mrz_text: string | null;
  full_name: string;
  name_en: string | null;
  document_no: string;
  date_of_birth: string;
  sex: string;
  country: string;
  issue_org: string;
  issue_date: string;
  document_face_img_url: string;
  created_at?: string;
}

export interface VerifyTask {
  id: string;
  person_id: string;
  session_id: string;
  session_kycid: string;
  session_url: string;
  status: '待核验' | '通过' | '未通过';
  image_url: string | null;
  created_at?: string;
  finished_at: string | null;
}

export interface VerifyTaskWithPerson extends VerifyTask {
  person_records?: Pick<PersonRecord, 'id' | 'full_name' | 'document_no'>;
}
