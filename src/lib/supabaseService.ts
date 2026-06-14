import { supabase } from './supabase';

const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
};

const mapUserFromDB = (data: any) => {
  if (!data) return null;
  return {
    ...data,
    groupId: data.group_id,
    isHidden: data.is_hidden,
    notificationsEnabled: data.notifications_enabled,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

const mapAvailabilityFromDB = (data: any) => {
  if (!data) return null;
  return {
    ...data,
    userId: data.user_id,
    groupId: data.group_id,
    startTime: data.start_time,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const syncUserData = (userId: string, callback: (data: any) => void) => {
  supabase.from('users').select('*').eq('uid', userId).single().then(({ data }) => callback(mapUserFromDB(data)));
  
  const channel = supabase.channel(`public:users:uid=eq.${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `uid=eq.${userId}` }, payload => {
      if (payload.eventType === 'DELETE') callback(null);
      else callback(mapUserFromDB(payload.new));
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const syncGroupAvailability = (groupId: string, callback: (data: any[]) => void) => {
  supabase.from('availability').select('*').eq('group_id', groupId).then(({ data }) => callback((data || []).map(mapAvailabilityFromDB)));
  
  const channel = supabase.channel(`public:availability:group_id=eq.${groupId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'availability', filter: `group_id=eq.${groupId}` }, () => {
      supabase.from('availability').select('*').eq('group_id', groupId).then(({ data }) => callback((data || []).map(mapAvailabilityFromDB)));
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const createProfile = async (uid: string, data: any) => {
  await supabase.from('users').upsert({
    id: uid,
    uid,
    group_id: data.groupId,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    role: data.role,
    is_hidden: data.isHidden || false,
    notifications_enabled: data.notificationsEnabled ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
};

export const addAvailability = async (data: any) => {
  const userId = await getCurrentUserId();
  await supabase.from('availability').insert({
    user_id: userId,
    group_id: data.groupId,
    date: data.date,
    start_time: data.startTime,
    duration: data.duration,
    type: data.type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
};

export const updateAvailability = async (id: string, data: any) => {
  await supabase.from('availability').update({
    ...data,
    start_time: data.startTime,
    group_id: data.groupId,
    user_id: data.userId,
    updated_at: new Date().toISOString()
  }).eq('id', id);
};

export const deleteAvailability = async (id: string) => {
  await supabase.from('availability').delete().eq('id', id);
};

export const duplicateAvailabilityToWeeks = async (sourceDate: string, sourceAvailability: any[], numWeeks: number = 1) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const userSlots = sourceAvailability.filter(a => a.userId === userId && a.date === sourceDate);
  const newSlots = [];
  
  for (let i = 1; i <= numWeeks * 7; i++) {
    const nextDate = new Date(sourceDate);
    nextDate.setDate(nextDate.getDate() + i);
    const dateStr = nextDate.toISOString().split('T')[0];
    
    userSlots.forEach(slot => {
      newSlots.push({
        user_id: userId,
        group_id: slot.groupId,
        date: dateStr,
        start_time: slot.startTime,
        duration: slot.duration,
        type: slot.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
  }

  if (newSlots.length > 0) {
    await supabase.from('availability').insert(newSlots);
  }
};

export const adminToggleUserVisibility = async (userId: string, isHidden: boolean) => {
  await supabase.from('users').update({
    is_hidden: isHidden,
    updated_at: new Date().toISOString()
  }).eq('uid', userId);
};

export const updateProfile = async (userId: string, data: any) => {
  await supabase.from('users').update({
    name: data.name,
    role: data.role,
    avatar: data.avatar,
    group_id: data.groupId,
    notifications_enabled: data.notificationsEnabled,
    updated_at: new Date().toISOString()
  }).eq('uid', userId);
};

export const adminDeleteUser = async (userId: string) => {
  if (!userId) throw new Error("Invalid User ID provided for deletion");
  await supabase.from('availability').delete().eq('user_id', userId);
  await supabase.from('users').delete().eq('uid', userId);
};

export const purgeAllGroupData = async (groupId: string) => {
  if (!groupId) throw new Error("Group ID required for master purge");
  
  const { data: users } = await supabase.from('users').select('uid').eq('group_id', groupId);
  const { data: records } = await supabase.from('availability').select('id').eq('group_id', groupId);
  
  await supabase.from('availability').delete().eq('group_id', groupId);
  await supabase.from('users').delete().eq('group_id', groupId);
  
  return { usersRemoved: users?.length || 0, recordsRemoved: records?.length || 0 };
};

export const requestAdminPrivileges = async (code: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Authentication required");
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase.from('users').select('id').eq('id', userId).single();
  if (!profile) {
    await createProfile(userId, {
      name: user?.email?.split('@')[0] || 'Admin',
      email: user?.email,
      role: 'Admin'
    });
  }
  
  const { error } = await supabase.from('admins').upsert({
    id: userId,
    code,
    email: user?.email,
    promoted_at: new Date().toISOString()
  });
  
  if (error) throw error;
};

export const checkAdminStatus = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase.from('admins').select('id').eq('id', userId).maybeSingle();
    if (error) return false;
    return !!data;
  } catch (e) {
    return false;
  }
};

export const syncAllUsersInGroup = (groupId: string, callback: (data: any[]) => void) => {
  supabase.from('users').select('*').eq('group_id', groupId).then(({ data }) => callback((data || []).map(mapUserFromDB)));
  
  const channel = supabase.channel(`public:users:group_id=eq.${groupId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `group_id=eq.${groupId}` }, () => {
      supabase.from('users').select('*').eq('group_id', groupId).then(({ data }) => callback((data || []).map(mapUserFromDB)));
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const syncAllUsers = (callback: (data: any[]) => void) => {
  supabase.from('users').select('*').then(({ data }) => callback((data || []).map(mapUserFromDB)));
  
  const channel = supabase.channel('public:users:all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
      supabase.from('users').select('*').then(({ data }) => callback((data || []).map(mapUserFromDB)));
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const createTeamCode = async (code: string, description: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Authentication required");

  const { error } = await supabase.from('team_codes').upsert({
    id: code, 
    code,
    description,
    created_at: new Date().toISOString(),
    created_by: userId
  });
  
  if (error) {
    console.error("Error creating team code:", error);
    throw error;
  }
};

export const deleteTeamCode = async (code: string) => {
  await supabase.from('team_codes').delete().eq('id', code);
};

export const syncTeamCodes = (callback: (codes: any[]) => void) => {
  supabase.from('team_codes').select('*').then(({ data }) => callback(data || []));
  
  const channel = supabase.channel('public:team_codes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'team_codes' }, () => {
      supabase.from('team_codes').select('*').then(({ data }) => callback(data || []));
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const addRecurringAvailability = async (data: any, hours: number[], weeks: number = 4) => {
  const userId = await getCurrentUserId();
  const slots = [];
  
  for (let i = 0; i < weeks; i++) {
    const nextDate = new Date(data.date);
    nextDate.setDate(nextDate.getDate() + (i * 7));
    const dateStr = nextDate.toISOString().split('T')[0];
    
    hours.forEach(h => {
      slots.push({
        user_id: userId,
        group_id: data.groupId,
        date: dateStr,
        start_time: h * 60,
        duration: 60,
        type: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
  }

  await supabase.from('availability').upsert(slots, { onConflict: 'user_id,group_id,date,start_time' });
};

export const removeRecurringAvailability = async (hours: number[], date: string, weeks: number = 4) => {
  const userId = await getCurrentUserId();
  const datesToRemove = [];
  
  for (let i = 0; i < weeks; i++) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + (i * 7));
    datesToRemove.push(nextDate.toISOString().split('T')[0]);
  }

  const timesToRemove = hours.map(h => h * 60);

  await supabase.from('availability')
    .delete()
    .eq('user_id', userId)
    .in('start_time', timesToRemove)
    .in('date', datesToRemove);
};

export const validateTeamCode = async (code: string) => {
  if (!code) return false;
  const { data } = await supabase.from('team_codes').select('code').eq('code', code).single();
  return !!data;
};
