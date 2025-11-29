import { create } from 'zustand';

interface UIState {
  isMenuOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
  toggleMenu: () => void;
  closeMenu: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isModalOpen: false,
  modalContent: null,
  notification: null,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}));