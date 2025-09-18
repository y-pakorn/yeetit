export interface User {
  displayName: string;
  id: string;
}

export interface Comment {
  id: string;
  user_id: string;
  reverse_domain: string;
  clean_path: string;
  comment: string;
  vote: boolean;
  user_name: string;
  love: number;
  created_at: string;
}
