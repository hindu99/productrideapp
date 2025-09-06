/*This is a helper function which will be used inside the fetch request ,this will add slected project using the entry page into the header 
in the request*/
export const addProject = () => {
  const projectId = localStorage.getItem('selectedProjectId');
  return projectId ? { 'project-id': projectId } : {};
};
