import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateReptile = () => {
    const nav = useNavigate();
    const [reptile, setReptile] = useState({ name: "", species: "", sex: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const createReptile = async () => {
        if (reptile.name && reptile.species && reptile.sex) {
            await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles`, {
                method: "post",
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reptile),
            })
                .then(() => {
                    setReptile({ name: "", species: "", sex: "" });
                    setErrorMsg("");
                    nav("/dashboard", {
                        replace: true
                    })
                });
        } else {
            setErrorMsg("Please fill out all fields.");
        }
    }

    return (
        <div>
            <form>
                <h2>New Reptile</h2>
                <div className="create-reptile">
                    <input key="name" onChange={(e) => setReptile({ ...reptile, name: e.target.value })} placeholder="Name" value={reptile.name}></input>
                    <input onChange={(e) => setReptile({ ...reptile, species: e.target.value })} placeholder="Species" value={reptile.species}></input>
                    <input onChange={(e) => setReptile({ ...reptile, sex: e.target.value })} placeholder="Sex" value={reptile.sex}></input>
                    <div>
                        <button type="button" onClick={createReptile}>Create</button>
                        <button type="button" onClick={() => nav("/dashboard", { replace: true })}>Cancel</button>
                    </div>
                </div>
            </form>
            <p>{errorMsg}</p>
        </div>
    );
}