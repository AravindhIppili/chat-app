import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";

function Register() {
    const socket = useRef();

    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);
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
            const { username, email, password } = values;
            try {
                const response = await axios
                    .post(
                        registerRoute,
                        {
                            username,
                            email,
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
                    socket.current = io(host);
                    socket.current.emit("add-user", response.data._id);
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
        const { username, email, password, confirmPassword } = values;
        if (password !== confirmPassword) {
            toast.error(
                "Password and Confirm Password donot match",
                toastOptions
            );
            return false;
        } else if (username.length < 3) {
            toast.error(
                "Username should be greater than 3 characters",
                toastOptions
            );
            return false;
        } else if (password.length < 6) {
            toast.error(
                "Password should be greater than 6 characters",
                toastOptions
            );
            return false;
        } else if (email === "") {
            toast.error("Email is required", toastOptions);
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
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Sign Up</button>
                    <span>
                        Already have an account? <Link to="/login">Login</Link>
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
export default Register;
