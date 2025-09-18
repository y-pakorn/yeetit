export interface User {
  displayName: string;
  id: string;
}

export interface Comment {
  user_id: string;
  reverse_domain: string;
  clean_path: string;
  comment: string;
  vote: number;
  user_name: string;
  up: number;
  down: number;
  created_at: string;
  id: string;
}
