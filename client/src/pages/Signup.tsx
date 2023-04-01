import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import { useApi } from '../hooks/useApi';

export const SignUp = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({ firstName: "", lastName: "", email: "", password: "" })
    const [errorMsg, setErrorMsg] = useState("");

    const api = useApi();
    const setToken = useContext(AuthContext);

    const signUp = async () => {
        if (user.firstName && user.lastName && user.email && user.password) {
            const result = await api.post(`${import.meta.env.VITE_SERVER_URL}/users/`, user)

            if (result.token) {
                setToken(result.token);
            }

            setUser({ firstName: "", lastName: "", email: "", password: "" });
            setErrorMsg("")
            nav("/dashboard", {
                replace: true
            })
        } else {
            setErrorMsg("Missing user information. Please try again.");
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <form className="signup-form">
                <div>
                    <label>
                        First Name <br />
                        <input value={user.firstName} onChange={e => setUser({ ...user, firstName: e.target.value })} type="text" />
                    </label>
                </div>
                <div>
                    <label>
                        Last Name <br />
                        <input value={user.lastName} onChange={e => setUser({ ...user, lastName: e.target.value })} type="text" />
                    </label>
                </div>
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
                <button type="button" onClick={signUp}>Sign up</button>
            </form>
            <p>Already Have an Account? <Link to="/signin">Sign In Here</Link></p>
        </div>
    )
}