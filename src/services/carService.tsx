import { BASE_URL, getHeaders } from "./apiService";

export const getCars = async (filters?:{
  status?:string;
  color?:string;
  //plateNo?:string;
}) => {
  const params = new URLSearchParams();
  if (filters?.status) {
    params.append("status", filters.status);
  }
  if (filters?.color) {
    params.append("color", filters.color);
  }

 
  

  const response = await fetch(`${BASE_URL}/api/cars?${params.toString()}`, {
    method: "GET",
    headers: getHeaders(),
  });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching cars:", errorText);
        throw new Error(errorText);
    }

    return response.json();
};
export const getCarByEngineId = async (engineId: string) => {
  const response = await fetch(`${BASE_URL}/api/cars/${engineId}`, {
    method: "GET",
    headers: getHeaders(),
  });
console.log(response);
  if (!response.ok) {
    console.error("Error fetching car by engineId:", await response.text());

    throw new Error(await response.text());
  }

  return response.json();
};
export const updateCar = async (engineId: string, data: any) => {
  const response = await fetch(`${BASE_URL}/api/cars/${engineId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });


    if (!response.ok) {
    const errorText = await response.text();
        console.error("Error creating car:", errorText);
        throw new Error(errorText); throw new Error(await response.text());}

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const deleteCar = async (engineId: string) => {
  const response = await fetch(`${BASE_URL}/api/cars/${engineId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok){
    const errorText = await response.text();
        console.error("Error deleting car:", errorText);
        throw new Error(errorText); throw new Error(await response.text());}

  return ;
};
export const createCar = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/cars`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  console.log(getHeaders());

  if (!response.ok) {
    const errorText = await response.text();
        console.error("Error creating car:", errorText);
        throw new Error(errorText); throw new Error(await response.text());}

  return response.json();
};