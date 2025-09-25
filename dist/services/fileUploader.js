import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const BUCKET_NAME = 'meublemoderne';
export const uploadFileToSupabase = async file => {
  if (!file) {
    return null;
  }
  try {
    const fileName = `${Date.now()}-${file.originalname}`;
    const {
      error
    } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file.buffer, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) {
      console.error('Erreur lors de l’upload du fichier sur Supabase:', error.message);
      throw new Error('Erreur lors de l’upload de l’image', {
        cause: error
      });
    }
    const {
      publicUrl
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
    return publicUrl;
  } catch (error) {
    throw error;
  }
};