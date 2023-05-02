import { useState } from "react"
import { useStore } from "../Context/store"
import { useForm } from "../hooks/useForm"
import axiosInstance from "../utils/client"
import { url } from "../utils/constants"

export const AutoUpdateModal = () => {
    const [repo, setAutoUpdateModal, setApp] = useStore(state => [state.repo, state.setAutoUpdateModal, state.setApp])
    const {form: {branch, seconds}, handleChange} = useForm({branch: repo.branches[0], seconds: "120"})
    const [error, setError] = useState("")
    return (
        <div className="select_container">
                <div>
                    <span>Auto-Build de {repo.name}</span>
                </div>
            <div className="options">
                <div>
                    <span>Segundos</span>
                    <input type="number" value={seconds} name="seconds" min="60" onChange={handleChange}/>
                </div>
                {branch ? <div>
                    <span>Branch</span>
                    <select name="branch" value={branch} onChange={handleChange}>
                        {repo.branches.map((b, i) => <option key={i}>{b}</option>)}
                    </select>
                </div> : null}
            </div>
            <span>La branch <span className="monospace">{branch}</span> se va a re-buildear con el último commit subido cada <span className="monospace">{seconds}</span> segundos</span>
            <div>
                <button className="confirm_button" onClick={() => {
                    return axiosInstance.get(`${url}/addTimer?repo=${repo.name}&branch=${branch}&seconds=${seconds}`)
                    .then(() => setApp(repo.name))
                    .catch((res) => setError(res.response.data))
                }}>Aceptar</button>
                <button className="confirm_button" onClick={() => setAutoUpdateModal("close")}>Cancelar</button>
            </div>
            <div className="error">{error}</div>
        </div>
    )
}
