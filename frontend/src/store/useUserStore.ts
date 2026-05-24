import { create } from 'zustand';

type User = {
  name: string;
  email: string;
  photo: string;
};

type UserStore = {
  user: User | null;
  // Google 로그인 성공 후 /auth/me 응답값을 저장
  setUser: (user: User) => void;
  // 로그아웃 시 유저 정보 초기화
  clearUser: () => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
