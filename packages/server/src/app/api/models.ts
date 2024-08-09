export interface Project {
  id: number;
  name: string;
  files: ProjectFile[];
}

export interface ProjectFile {
  id: number;
  name: string;
  content: string;
}
