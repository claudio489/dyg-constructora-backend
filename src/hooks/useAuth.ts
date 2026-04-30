// No-auth hook — el sistema de licitaciones es publico
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    logout: () => {},
    refresh: () => {},
  };
}
