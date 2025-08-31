  //This is a logoutfunction
  export const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Clear projectId from local storage 
    localStorage.removeItem('selectedProjectId');

    // Redirect to login page
    window.location.href = '/';
  };