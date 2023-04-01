import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}

type Schedule = {
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
}

type HusbandryRecord = {
    id: number;
    length: string;
    weight: string;
    temperature: string;
    humidity: string;
}

type Feeding = {
    id: number;
    foodItem: string;
    createdAt: Date;
}

export const Reptile = () => {
    const nav = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const [reptile, setReptile] = useState({ name: "", species: "", sex: "" });
    const [update, setUpdate] = useState({ name: "", species: "", sex: "" });

    const [feedings, setFeedings] = useState<Feeding[]>([]);
    const [food, setFood] = useState("");

    const [husbandryRecords, setHusbandryRecords] = useState<HusbandryRecord[]>([]);
    const [husbandry, setHusbandry] = useState({ length: "", weight: "", temperature: "", humidity: "" });

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [schedule, setSchedule] = useState({ type: "", description: "", monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false });

    const reptileId = useParams().id;


    const getReptile = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles/${reptileId}`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const body = await result.json();
        if (body.reptile[0]) {
            setReptile(body.reptile[0]);
        }
    }

    const getFeedings = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/feedings/${reptileId}`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const body = await result.json();
        if (body.feedings) {
            setFeedings(body.feedings);
        }
    }

    const getSchedules = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/schedules/${reptileId}`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const body = await result.json();
        if (body.schedules) {
            setSchedules(body.schedules);
        }
    }

    const getHusbandryRecords = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/husbandryRecords/${reptileId}`, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const body = await result.json();
        if (body.husbandries) {
            setHusbandryRecords(body.husbandries);
        }
    }

    const updateReptile = async () => {
        if (update.name && update.species && update.sex) {
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles/${reptileId}`, {
                method: 'put',
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(update)
            });

            const body = await result.json();
            if (body.reptile) {
                setReptile(body.reptile);
            }

            getReptile();
            setUpdate({ name: "", species: "", sex: "" });
            setErrorMsg("");
        } else {
            setErrorMsg("No empty fields allowed when updating reptiles. Please try again.")
        }
    }

    const createFeeding = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (food) {
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/feedings/${reptileId}`, {
                method: 'post',
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(food)
            });
            const body = await result.json();
            if (body.feeding) {
                body.feeding['createdAt'] = new Date(body.feeding['createdAt']);
                setFeedings([...feedings, body.feeding]);
            }

            setFood("");
            setErrorMsg("");
        } else {
            setErrorMsg("Missing feeding information. Please try again.")
        }
    }

    const createHusbandryRecord = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (husbandry.length, husbandry.weight, husbandry.temperature, husbandry.humidity) {
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/husbandryRecords/${reptileId}`, {
                method: 'post',
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(husbandry)
            });
            const body = await result.json();
            if (body.husbandry) {
                setHusbandryRecords([...husbandryRecords, body.husbandry])
            }

            setHusbandry({ length: "", weight: "", temperature: "", humidity: "" });
            setErrorMsg("");
        } else {
            setErrorMsg("Missing husbandry field. Please try again.")
        }
    }

    const createSchedule = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (schedule.type && schedule.description && (schedule.monday || schedule.tuesday || schedule.wednesday || schedule.thursday || schedule.friday || schedule.saturday || schedule.sunday)) {
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/schedules/${reptileId}`, {
                method: 'post',
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(schedule)
            });
            const body = await result.json();
            if (body.schedule) {
                setSchedules([...schedules, body.schedule]);
            }

            setSchedule({ type: "", description: "", monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false });
            setErrorMsg("");
        } else {
            setErrorMsg("Missing schedule field. Please try again.")
        }
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
        } else {
            nav("/", {
                replace: true
            })
        }

        getReptile();
        getFeedings();
        getHusbandryRecords();
        getSchedules();
    }, []);

    return (
        <div>
            <div className='display-reptile'>
                <div>
                    <form>
                        <input type="text" value={reptile.name} onChange={(e) => { setReptile({...reptile, name: e.target.value})}} /><br />
                        <input type="text" value={reptile.species} onChange={(e) => { setReptile({...reptile, species: e.target.value})}} /><br />
                        <input type="text" value={reptile.sex} onChange={(e) => { setReptile({...reptile, sex: e.target.value})}} /><br />
                        <button type="button" onClick={updateReptile}>Update Reptile</button>
                    </form>
                </div>

                <div>
                    <h2>Feedings</h2>
                    <div className='feedings'>
                        {feedings.map((feeding: Feeding) => (
                            <div key={feeding.id} className="feeding-item">
                                <p>{feeding.createdAt.toLocaleString().split(',')[0]}: {feeding.foodItem}</p>
                            </div>
                        ))}
                        <div>
                            <h3>Add Feeding</h3>
                            <form>
                                <input type="text" value={food} onChange={(e) => { setFood(e.target.value) }} placeholder="New Feeding Information" /><br />
                                <button type="button" onClick={createFeeding}>Add Food</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div>
                    <h2>Schedules</h2>
                    <div className='schedules'>
                        {schedules.map((schedule: Schedule) => (
                            <div key={schedule.id} className="schedule-item">
                                <p>{schedule.type}: {schedule.description}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3>Add Schedule</h3>
                        <form>
                            <input type="text" value={schedule.type} onChange={(e) => { setSchedule({ ...schedule, type: e.target.value }) }} placeholder="Schedule type" /><br />
                            <input type="text" value={schedule.description} onChange={(e) => { setSchedule({ ...schedule, description: e.target.value }) }} placeholder="Description" /><br />
                            <label>
                                Monday
                                <input checked={schedule.monday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, monday: e.target.checked }) }} />
                            </label>
                            <br />
                            <label>
                                Tuesday
                                <input checked={schedule.tuesday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, tuesday: e.target.checked }) }} />
                            </label>
                            <br />
                            <label>
                                Wednesday
                                <input checked={schedule.wednesday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, wednesday: e.target.checked }) }} />
                            </label>
                            <br />
                            <label>
                                Thursday
                                <input checked={schedule.thursday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, thursday: e.target.checked }) }} />
                            </label>
                            <br />
                            <label>
                                Friday
                                <input checked={schedule.friday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, friday: e.target.checked }) }} />
                            </label>
                            <br />
                            <label>
                                Saturday
                                <input checked={schedule.saturday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, saturday: e.target.checked }) }} />
                            </label>
                            <br />
                            <label>
                                Sunday
                                <input checked={schedule.sunday} type="checkbox" onChange={(e) => { setSchedule({ ...schedule, sunday: e.target.checked }) }} />
                            </label>
                            <br />
                            <button type="button" onClick={createSchedule}>Add Schedule</button>
                        </form>
                    </div>
                </div>

                <div>
                    <h2>Husbandry</h2>
                    <div className='husbandries'>
                        {husbandryRecords.map((husbandry: HusbandryRecord) => (
                            <div key={husbandry.id} className="husbandry-item">

                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>Add Husbandry Record</h3>
                        <form>
                            <input type="text" value={husbandry.length} onChange={(e) => { setHusbandry({ ...husbandry, length: e.target.value }) }} placeholder="Length" /> <br />
                            <input type="text" value={husbandry.weight} onChange={(e) => { setHusbandry({ ...husbandry, weight: e.target.value }) }} placeholder="Weight" /> <br />
                            <input type="text" value={husbandry.temperature} onChange={(e) => { setHusbandry({ ...husbandry, temperature: e.target.value }) }} placeholder="Temperature" /> <br />
                            <input type="text" value={husbandry.humidity} onChange={(e) => { setHusbandry({ ...husbandry, humidity: e.target.value }) }} placeholder="Humidity" /> <br />
                            <button type="button" onClick={createHusbandryRecord}>Add Record</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}