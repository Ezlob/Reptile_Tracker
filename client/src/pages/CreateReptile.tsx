import { ChangeEvent, SyntheticEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export const CreateReptile = () => {
    const nav = useNavigate();
    const [reptile, setReptile] = useState({ name: "", species: "", sex: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const api = useApi();

    const createReptile = async () => {
        if (reptile.name && reptile.species && reptile.sex) {
            const result = await api.post(`${import.meta.env.VITE_SERVER_URL}/reptiles`, reptile);

            if(result.reptile) {
                setReptile({ name: "", species: "", sex: "" });
                setErrorMsg("");
                nav("/dashboard", {
                    replace: true
                })
            }  

        } else {
            setErrorMsg("Please fill out all fields.");
        }
    }

    const chooseSex = (e: ChangeEvent<HTMLInputElement>) => {
        setReptile({...reptile, sex: e.target.value});
    }

    return (
        <div>
            <form>
                <h2>New Reptile</h2>
                <div className="create-reptile">
                    <input key="name" onChange={(e) => setReptile({ ...reptile, name: e.target.value })} placeholder="Name" value={reptile.name}></input>
                    <input onChange={(e) => setReptile({ ...reptile, species: e.target.value })} placeholder="Species" value={reptile.species}></input>
                    <div>
                            <input type="radio" value="Male" name="gender" checked={reptile.sex === 'Male'}  onChange={(e) => chooseSex(e)}/> Male
                            <input type="radio" value="Female" name="gender" checked={reptile.sex === 'Female'}  onChange={(e) => chooseSex(e)}/> Female
                        </div>
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