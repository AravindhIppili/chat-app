import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUserRoute, host, hostSocket } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
    const socket = useRef();

    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setcurrentChat] = useState(undefined);

    useEffect(() => {
        if (!localStorage.getItem("user")) navigate("/login");
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(hostSocket);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        async function fun() {
            if (!localStorage.getItem("user")) navigate("/login");
            else {
                setCurrentUser(await JSON.parse(localStorage.getItem("user")));
            }
        }
        fun();
    }, [navigate]);

    useEffect(() => {
        async function fun() {
            if (currentUser) {
                if (currentUser.isAvatarSet) {
                    const resp = await axios.get(
                        `${allUserRoute}/${currentUser._id}`
                    );
                    setContacts(resp.data);
                } else {
                    navigate("/setavatar");
                }
            }
        }
        fun();
    }, [currentUser, navigate]);
    const handleChatChange = (chat) => {
        setcurrentChat(chat);
    };
    return (
        <Container>
            <div className="container">
                <Contacts
                    contacts={contacts}
                    currentUser={currentUser}
                    changeChat={handleChatChange}
                />
                {currentChat === undefined ? (
                    <Welcome currentUser={currentUser} />
                ) : (
                    <ChatContainer
                        currentChat={currentChat}
                        currentUser={currentUser}
                        socket={socket}
                    />
                )}
            </div>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .container {
        height: 85vh;
        width: 85vw;
        background-color: #00000076;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
    }
`;

export default Chat;
