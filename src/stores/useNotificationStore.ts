import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  toasts: NotificationItem[];
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: 'notif_1',
      type: 'success',
      title: 'Execution #1042 Completed',
      message: '29 passed, 2 failed in 38.4s. 90.6% pass rate.',
      timestamp: '10 minutes ago',
      isRead: false,
    },
    {
      id: 'notif_2',
      type: 'error',
      title: 'Jira Bug Created',
      message: 'Issue QA-1042 filed for TC-AUTH-004 lockout error mismatch.',
      timestamp: '12 minutes ago',
      isRead: false,
    },
    {
      id: 'notif_3',
      type: 'info',
      title: 'Self-Healing Ready',
      message: 'AI proposed resilient selector for LoginPage.ts errorMessage.',
      timestamp: '15 minutes ago',
      isRead: true,
    },
  ],
  toasts: [],

  addNotification: (item) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      toasts: [...state.toasts, newNotif],
    }));

    // Auto dismiss toast after 4s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== newNotif.id),
      }));
    }, 4000);
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
