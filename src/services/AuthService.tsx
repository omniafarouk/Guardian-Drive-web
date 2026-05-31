import axios from "axios";
import { useNavigate } from "react-router-dom";


export const login = async (email: string, password: string) => {
    const response = await axios.post("https://localhost:3000/auth/api/login",
        { email, password }
    );

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("id", response.data.id);
    localStorage.setItem("name", response.data.fName + response.data.lName);
    localStorage.setItem("role", response.data.role);
}

export const logout = (): void => {
    const navigate = useNavigate();
    localStorage.clear();
    navigate("/");
}