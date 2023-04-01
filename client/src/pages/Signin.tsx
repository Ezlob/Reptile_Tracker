import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { useApi } from '../hooks/useApi';

export const SignIn = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({ email: "", password: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const api = useApi();
    const setToken = useContext(AuthContext);

    const signIn = async () => {
        if (user.email && user.password) {
            const result = await api.post(`${import.meta.env.VITE_SERVER_URL}/users/signin`, user);

            if (result.token) {
                setToken(result.token);
            }

            setUser({ email: "", password: "" });
            setErrorMsg("")
            nav("/dashboard", {
                replace: true
            })
        } else {
            setErrorMsg("Username or password invalid. Please try again.");
        }
    }

    return (
        <div>
            <h1>Sign In</h1>
            <form className="signin-form">
                <div>
                    <label>
                        Email <br />
                        <input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} type="email" />
                    </label>
                </div>
                <div>
                    <label>
                        Password <br />
                        <input value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} type="password" />
                    </label>
                </div>
                <p>
                    {errorMsg}
                </p>
                <button type="button" onClick={signIn}>Sign in</button>
            </form>
            <p>New? <Link to="/signup">Create an Account</Link></p>
        </div>
    )
}