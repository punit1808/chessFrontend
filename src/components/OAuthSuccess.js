import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function OAuthSuccess() {

    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const fullName = params.get("fullName");

        if (!token) {
            navigate("/");
            return;
        }

        localStorage.setItem("token", token);

        if (fullName) {
            localStorage.setItem("username", fullName);
        }

        navigate("/start");

    }, [navigate]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}
        >
            <h2>Signing you in...</h2>
        </div>
    );
}

export default OAuthSuccess;