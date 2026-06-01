import axios from "axios";
import { Role } from "../types/enums";
import { BASE_URL } from "./apiService";
import { getId, getName, getRole, getToken, setId, setName, setRole, setToken } from "../utils/storage";


export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`,
            { email, password }
        );

        console.log(response)

        const user = response.data.data.user;
        const token = response.data.data.accessToken;


        if (user.role !== Role.FLEET_MANAGER && user.role !== Role.ADMIN) {
            throw new Error("Unauthorized User")
        }

        // in storage.tsx
        setToken(token);
        setId(user.id);
        setName(user.fName + user.lName);
        setRole(user.role);

        /*
        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        localStorage.setItem("name", user.fName + user.lName);
        localStorage.setItem("role", user.role);
        */

        console.log(getToken())
        console.log(getId())
        console.log(getName())
        console.log(getRole())


    } catch (error: any) {
        throw Error(error);
    }

}

export const logout = (): void => {
    localStorage.clear();
}