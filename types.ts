export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  posterImage: string;
  githubUrl: string;
  websiteUrl: string;
  category: string;
  authorId: string;
  likes: number;
  likedBy: string[];
}

export interface ProjectWithAuthor extends ProjectDetails {
  author: User;
}
