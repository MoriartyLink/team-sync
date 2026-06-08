-- Create the users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id TEXT,
    name TEXT,
    email TEXT,
    avatar TEXT,
    role TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create the availability table
CREATE TABLE IF NOT EXISTS public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    group_id TEXT,
    date TEXT NOT NULL,
    start_time INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create the team_codes table
CREATE TABLE IF NOT EXISTS public.team_codes (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create the admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    email TEXT,
    promoted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Note: The following are permissive policies for development purposes. 

-- Users policies
CREATE POLICY "Enable read access for all authenticated users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users based on id" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Enable delete for users based on id" ON public.users FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Enable all for admins on users" ON public.users FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- Availability policies
CREATE POLICY "Enable read access for all authenticated users" ON public.availability FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.availability FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users based on user_id" ON public.availability FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users based on user_id" ON public.availability FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable all for admins on availability" ON public.availability FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- team_codes policies
CREATE POLICY "Enable read access for all authenticated users" ON public.team_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable all for admins on team_codes" ON public.team_codes FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));
CREATE POLICY "Enable insert for authenticated users on team_codes" ON public.team_codes FOR INSERT TO authenticated WITH CHECK (true);

-- Admins policies
CREATE POLICY "Enable read access for all authenticated users" ON public.admins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.admins FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Enable Realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_codes;
