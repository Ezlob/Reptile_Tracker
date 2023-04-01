import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const SignIn = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({ email: "", password: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const signIn = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (user.email && user.password) {
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/signin`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const body = await result.json()

            if (body.token) {
                window.localStorage.setItem("token", body.token);
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