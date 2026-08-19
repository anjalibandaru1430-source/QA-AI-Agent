import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl?: string;
}

interface UserStoreState {
  currentUser: UserProfile;
  login: (email: string, customName?: string) => void;
  logout: () => void;
}

const formatNameFromEmail = (email: string): { name: string; initials: string } => {
  const localPart = email.split('@')[0] || 'User';
  // Replace dots, underscores, numbers with spaces and capitalize
  const cleaned = localPart.replace(/[._\d-]+/g, ' ').trim();
  const words = cleaned.split(' ').filter(Boolean);
  
  if (words.length >= 2) {
    const first = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    const last = words[1].charAt(0).toUpperCase() + words[1].slice(1);
    return {
      name: `${first} ${last}`,
      initials: `${first.charAt(0)}${last.charAt(0)}`.toUpperCase(),
    };
  } else if (words.length === 1 && words[0].length > 0) {
    const name = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return {
      name,
      initials: name.slice(0, 2).toUpperCase(),
    };
  }
  
  return { name: 'QA Engineer', initials: 'QA' };
};

const getStoredUser = (): UserProfile => {
  try {
    const stored = localStorage.getItem('qagent_user');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  
  return {
    id: 'usr_001',
    name: 'Anjali Bandaru',
    email: 'anjalibandaru1430@gmail.com',
    role: 'QA Lead',
    initials: 'AB',
  };
};

export const useUserStore = create<UserStoreState>((set) => ({
  currentUser: getStoredUser(),
  login: (email: string, customName?: string) => {
    const { name, initials } = customName 
      ? { name: customName, initials: customName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() }
      : formatNameFromEmail(email);

    const user: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'QA Lead',
      initials,
    };

    try {
      localStorage.setItem('qagent_user', JSON.stringify(user));
    } catch (e) {}

    set({ currentUser: user });
  },
  logout: () => {
    try {
      localStorage.removeItem('qagent_user');
    } catch (e) {}
    set({
      currentUser: {
        id: 'usr_guest',
        name: 'Guest User',
        email: 'guest@qagent.io',
        role: 'Viewer',
        initials: 'GU',
      },
    });
  },
}));
