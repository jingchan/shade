// useProjectApi.js
import { ApiError, Project, ProjectData } from 'shade-common';
import { Ref, ref } from 'vue';

const API_URL = 'http://localhost:3001/api/project';

export function useProjectApi() {
  const projects: Ref<Project[]> = ref([]);
  const project: Ref<Project | null> = ref(null);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<Error | null> = ref(null);

  const fetchProjects = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new ApiError('Failed to fetch data');
      projects.value = await response.json();
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };
  const fetchProject = async (id: number | string): Promise<void> => {
    // check if string
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    if (isNaN(id)) {
      error.value = new ApiError('Invalid project ID');
    }

    isLoading.value = true;
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new ApiError('Failed to fetch project');
      project.value = await response.json();
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const createProject = async (data: ProjectData): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new ApiError('Failed to create project');
      const responseJson = await response.json();
      projects.value.push(responseJson);
      project.value = responseJson;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const updateProject = async (
    id: number,
    data: ProjectData,
  ): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new ApiError('Failed to update project');
      const updatedProject = await response.json();
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const deleteProject = async (id: number): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new ApiError('Failed to delete project');
      projects.value = projects.value.filter((p) => p.id !== id);
    } catch (err) {
      if (err instanceof Error) {
        error.value = err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    projects,
    project,
    isLoading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  };
}
