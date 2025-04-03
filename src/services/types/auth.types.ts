
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string; // For backward compatibility
  provider?: string; // Provider field
}

export interface AuthError {
  message: string;
  code?: string;
}
