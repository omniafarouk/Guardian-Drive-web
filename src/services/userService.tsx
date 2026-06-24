import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
 if (!response.ok) {
        const errorText = await response.text();
        console.error("Error :", errorText);
        throw new Error(errorText);
    }

    return response.json();
};


export const getUserList = async (filters?: {
  role?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.role) {
    params.append("role", filters.role);
  }

  const response = await fetch(`${BASE_URL}/api/users?${params.toString()}`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);
};
export const getUserById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  return handleResponse(response);

};
export const createUser = async(FormData:any)=>{
  const response = await fetch (`${BASE_URL}/api/users`,
  {
    method:"POST",
    headers:getHeaders(),
            body: JSON.stringify(FormData),


  }
  );
  return handleResponse(response)
};