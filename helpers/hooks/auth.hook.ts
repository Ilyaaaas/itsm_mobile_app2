import { useTypedSelector } from './typed-selector.hook';

interface AuthHookReturn {
  isLoggedIn: boolean;
}

export const useAuth = (): AuthHookReturn => {
  const sessionId = useTypedSelector((state) => state.auth.sessionId);

  return { isLoggedIn: !!sessionId };
};
