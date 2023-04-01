import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.localStorage.getItem("token")) {
            navigate("/", {
                replace: true
            })
        }
    }, [])
    
    return (
        <div>
            <h1>Reptile Husbandry</h1>
            <p>Busy life getting in the way of managing your snakes? Sick of having 12,000 post-it notes just to manage some feeding schedules?<br/>
            Worry no longer! The Sensible Snake tracker is here to assist in managing your reptiles and all associated feedings, schedules, and husbandries.</p>
            <div>
                <Link to="/signup">Sign Up</Link> &nbsp;
                <Link to="/signin">Sign In</Link>
            </div>
        </div>
    )
}