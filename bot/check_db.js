import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jgjejcmiwdpkchvhaisa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnamVqY21pd2Rwa2NodmhhaXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3Njc0NiwiZXhwIjoyMDgxMDUyNzQ2fQ.lkMe7MF4zdF2r64wgLlt0MNvF5skUkdyDjdQj3kndOU');

async function test() {
  const { data, error } = await supabase.from('nc_users').select('*').eq('telegram_id', 5343543987);
  console.log("Data:", data, "Error:", error);
}
test();
