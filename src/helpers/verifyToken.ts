import jwt_decode from 'jwt-decode';

export const verifyToken = async (accessToken: any) => {
  try {
    const decoded = jwt_decode(accessToken);
    return decoded;
  } catch (error) {
    
    console.error("Request failed:", error);
    throw error; 
  }
};
