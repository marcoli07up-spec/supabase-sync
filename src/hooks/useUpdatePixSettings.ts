export function useUpdatePixSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: PixSettings) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'pix_config')
        .maybeSingle();
      const jsonValue = settings as unknown as Json;
      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: jsonValue })
          .eq('key', 'pix_config');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{ key: 'pix_config', value: jsonValue }]);
        if (error) throw error;
      }
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pix-settings'] });
    },
  });
}