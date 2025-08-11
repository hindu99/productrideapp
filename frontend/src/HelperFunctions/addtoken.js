/*This is a helper function which will be used inside the fetch request ,this will add the token header 
in the request*/
export const addToken = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
