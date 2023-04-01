import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}

interface Schedule {
    [index: string | number]: string | number | boolean;
    id: number;
    type: string;
    description: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    reptileId: number;
}

export const Dashboard = () => {
    const nav = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [reptiles, setReptiles] = useState([]);

    const getReptiles = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const body = await result.json();

        if (body.reptiles) {
            setReptiles(body.reptiles);
        }
    }

    const getSchedules = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/schedules`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const body = await result.json();

        if (body.schedules) {
            const dayOfWeek = new Date().toLocaleString('en-us', { weekday: 'long' });
            setSchedules(body.schedules.filter((schedule: Schedule) => { return true == schedule[dayOfWeek]; }));
        }
    }

    const deleteReptile = async (reptileId: number) => {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles/${reptileId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            }
        });

        getReptiles();
        getSchedules();
    }

    useEffect(() => {
        if (window.localStorage.getItem("token")) {
            fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
                method: "get",
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                    "Content-Type": "application/json",
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        nav("/", {
                            replace: true
                        })
                    }
                })
        }

        getReptiles();
        getSchedules();
    }, []);

    return (
        <div className='dashboard'>
            <h1>Dashboard</h1>
            <div className='schedules'>
                <h2>Todays' Schedule</h2>
                <div className='schedule'>
                    {
                        schedules.map((schedule: Schedule) => (
                            <div key={schedule.id} className='schedule-item'>
                                <h3>Reptile: {reptiles.length > 0 ? (reptiles.filter((reptile: Reptile) => reptile.id == schedule.reptileId)[0] as Reptile).name : ""} | Type: {schedule.type} | Description: {schedule.description}</h3>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='reptiles'>
                <h2>Your Reptiles</h2>
                <div className='reptile'>
                    {
                        reptiles.map((reptile: Reptile) => (
                            <div key={reptile.id} className='reptile-item'>
                                <h3>{reptile.name}</h3>
                                <div>
                                    <Link to={{ pathname: `/reptiles/${reptile.id}` }}>Edit</Link>
                                    <button onClick={() => { deleteReptile(reptile.id) }}>Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <button onClick={() => nav("/createReptile", { replace: true })}>Add Reptile</button>
                </div>
            </div>
        </div>
    );
}