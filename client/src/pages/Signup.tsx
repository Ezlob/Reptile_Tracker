import React, { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const SignUp = () => {
    const nav = useNavigate();
    const [user, setUser] = useState({ firstName: "", lastName: "", email: "", password: "" })
    const [errorMsg, setErrorMsg] = useState("");

    const signUp = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (user.firstName && user.lastName && user.email && user.password) {
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/`, {
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