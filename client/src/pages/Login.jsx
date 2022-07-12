import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { username, password } = values;
            try {
                const response = await axios
                    .post(
                        loginRoute,
                        {
                            username,
                            password,
                        },
                        {
                            withCredentials: true,
                        }
                    )
                    .catch(function (err) {
                        toast.error(err.response.data.msg, toastOptions);
                    });
                if (response.data.status === true) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                    navigate("/");
                }
            } catch (err) {
                toast.error(err, toastOptions);
            }
        }
    };
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const handleValidation = () => {
        const { username, password } = values;
        if (username === "") {
            toast.error("Username required", toastOptions);
            return false;
        } else if (password === "") {
            toast.error("Password required", toastOptions);
            return false;
        }
        return true;
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        className=""
                        min="3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Login</button>
                    <span>
                        Don't have an account?
                        <Link to="/register">Register</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
        }
        h1 {
            color: white;
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
    }
    input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
        }
    }
    button {
        background-color: #4e0eff;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        &:hover {
            background-color: #4e0eff;
        }
    }
    span {
        color: white;
        text-transform: uppercase;
        a {
            color: #4e0eff;
            text-decoration: none;
            font-weight: bold;
        }
    }
`;
export default Login;
