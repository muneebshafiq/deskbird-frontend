import { User } from '../../core/models/user.model';

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}
