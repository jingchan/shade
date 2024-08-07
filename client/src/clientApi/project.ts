const API_HOST = 'http://localhost:3001/api';

export async function apiGetProject(id: string) {
  const api_url = `${API_HOST}/project/${id}`;
  const response = await fetch(api_url);
  if (response.status !== 200) {
    console.error('Failed to get project');
    return;
  }
  const resJson = await response.json();
  // {
  //   const { id, owner_id, name, description, code, created_at, updated_at } =
  //     resJson;
  //   console.log(id, owner_id, name, description, code, created_at, updated_at);
  // }
  return resJson;
}

export async function apiCreateProject(
  name: string,
  description: string,
  code: string,
) {
  const body = JSON.stringify({
    name,
    description,
    code,
  });
  const api_url = `${API_HOST}/project`;
  const response = await fetch(api_url, {
    method: 'POST',
    body,
  });
  if (response.status !== 200) {
    console.error('Failed to create project');
    return;
  }
  const resJson = await response.json();
  // {
  //   const { id, owner_id, name, description, code, created_at, updated_at } =
  //     resJson;
  //   console.log(id, owner_id, name, description, code, created_at, updated_at);
  // }
  return resJson;
}
