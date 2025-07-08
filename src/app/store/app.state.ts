import { AuthState } from './auth/auth.state';
import { UserState } from './users/users.state';

export interface AppState {
  auth: AuthState;
  users: UserState;
}
