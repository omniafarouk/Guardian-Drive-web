import { BASE_URL, getHeaders } from "./apiService";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error :", errorText);
        throw new Error(errorText);
    }

    return response.json();
};
// export const getUserById = async (id: number) => {
//     try {
//         const response = await fetch(
//             `${BASE_URL}/api/users/${id}`,
//             {
//                 method: "GET",
//                 headers: getHeaders(),
//             }
//         );
//         // const data = await response.json();
//         // console.log("DRIVERS RESPONSE:", data);
//         return handleResponse(response)
//     } catch (error) {
//         throw error;
//     }
// };
export const getUsers = async (filters?: { role?: string }) => {
    try {
        let url = `${BASE_URL}/api/users`
        if (filters) {
            const params = new URLSearchParams(filters as any);

            url += `?${params.toString()}`;
        }
        const response = await fetch(`${url}`, {
            method: "GET",
            headers: getHeaders()
        }).then(
            handleResponse
        ).catch((e) => { throw e })

        return response

    } catch (error: any) {
        throw Error(error);
    }

}


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
export const createUser = async (FormData: any) => {
    const response = await fetch(`${BASE_URL}/api/users`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(FormData),


        }

  
  );
  return handleResponse(response)
};
export const updateUser =async(FormData:any,id:string)=>{
  const response = await fetch (`${BASE_URL}/api/users/${id}`,
    {
      method:"PUT",
      headers:getHeaders(),
      body:JSON.stringify(FormData),
    }
  );
  return  handleResponse(response);
};
