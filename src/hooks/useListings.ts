import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ListingWithSeller, NewListing } from '../types/database';

const LISTINGS_KEY = ['listings'] as const;

export function useListings() {
  return useQuery({
    queryKey: LISTINGS_KEY,
    queryFn: async (): Promise<ListingWithSeller[]> => {
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as ListingWithSeller[];
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [{ count: listings }, { count: users }] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      return { listings: listings ?? 0, users: users ?? 0 };
    },
  });
}

interface CreateListingInput {
  listing: Omit<NewListing, 'image_url'>;
  photo?: File | null;
  userId: string;
}

async function uploadPhoto(userId: string, photo: File): Promise<string> {
  const ext = photo.name.split('.').pop();
  const filename = `${userId}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('vinyl_images')
    .upload(filename, photo);
  if (error) throw new Error('Ошибка загрузки фото: ' + error.message);
  const { data } = supabase.storage.from('vinyl_images').getPublicUrl(filename);
  return data.publicUrl;
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listing, photo, userId }: CreateListingInput) => {
      const image_url = photo ? await uploadPhoto(userId, photo) : null;
      const { error } = await supabase
        .from('listings')
        .insert({ ...listing, image_url });
      if (error) throw new Error('Ошибка: ' + error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
      void queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
