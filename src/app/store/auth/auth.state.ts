import { JwtPayload } from '../../core/models/auth.model';

export interface AuthState {
  user: JwtPayload | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}
