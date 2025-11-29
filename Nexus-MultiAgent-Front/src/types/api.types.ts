export interface UserDTO {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at?: string;
}

export interface CompanyDTO {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  mission?: string;
  vision?: string;
  values?: string[];
  contact_email?: string;
  phone?: string;
  address?: string;
  social_media?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}