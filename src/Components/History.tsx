// Create a History Component. This component will display the history of version changes in time. The component consumes an api endpoint (/repoHistory?repo=${repo.name}) that returns a list of objects of the form {Hash string, CreatedAt string}. The component shows those results.

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AppContext, VersionChangeEvent } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"
import { checkout } from "../utils/git_actions"
import { getDayOfWeek } from "../utils/time"
import "./History.css"


const History = () => {
    const { repo, modal, setModal } = useContext(AppContext)
    const { name } = repo
    const [history, setHistory] = useState<VersionChangeEvent[]>([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (name.length) axios.get(`${url}/repoHistory?repo=${name}`)
            .then(res => {
                if (res && res.data && Array.isArray(res.data)) setHistory(res.data)
                else setHistory([])
            })
    }, [name])
    // Create a function that will allow you to go back to a previous version of the code.
    return (
        <div className="history">
            <h3>{repo.name}</h3>
            <div className="events">
                <div className="event">
                    <p>Hash</p>
                    <p>Fecha</p>
                    <p>Mensaje</p>
                    <p>Acción</p>
                </div>
                {history.map((v, i) => <div key={i} className="event">
                        <p>{v.Hash.slice(0, 7)}</p>
                        <p>{getDayOfWeek(v.CreatedAt.split('.')[0])}</p>
                        <p>{repo.commits?.find(c => c.commit.Hash === v.Hash)?.commit.Message}</p>
                        <button onClick={() => {
                        setModal(v)
                    }}> Rollback </button>
                    </div>
)}
                {modal && <div className="confirm">
                    <p>Estás seguro que querés cambiar la versión a {modal.Hash.slice(0, 7)}?</p>
                    <div>
                        <button onClick={() => {
                            setModal(null)
                        }}>Cancelar</button>
                        <button onClick={() => {
                            setLoading(true)
                            checkout(repo.name, modal.Hash)
                                .catch(err => {
                                    alert("Ha ocurrido un error: " + err.message)
                                    setLoading(false)
                                    setModal(null)
                                })
                        }}>{loading ? "Rollbackeando a " + modal.Hash : "Confirmar"}</button>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default History
