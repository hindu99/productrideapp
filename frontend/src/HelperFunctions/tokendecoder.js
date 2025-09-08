

// Helper function to decode a JWT token from localStorage 


export function getUserRole() {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Decode the JWT payload (middle part of the token which is payload)
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    //extracting user role
    console.log(payload.role);
    return payload.role || null;
  } catch {
    return null;
  }
}
