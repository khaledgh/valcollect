export interface Course {
  ID: number;
  CreatedAt: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  syllabus: string;
  benefits: string;
  price: number;
  currency: string;
  image: string;
  duration: string;
  session_duration: string;
  course_code: string;
  category: string;
}

export interface Instructor {
  ID: number;
  name: string;
  speciality: string;
  bio: string;
  image: string;
}

export interface LandingPage {
  ID: number;
  CreatedAt: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: 'active' | 'draft';
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  image?: string;
  mobile_image?: string;
  image_alt?: string;
  og_image?: string;
  views: number;
}

export interface Statistics {
  awards: number;
  centers: number;
  experience: number;
  students_count: number;
  courses_count: number;
  instructors_count: number;
}
