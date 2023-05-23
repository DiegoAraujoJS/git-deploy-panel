// Create a History Component. This component will display the history of version changes in time. The component consumes an api endpoint (/repoHistory?repo=${repo.name}) that returns a list of objects of the form {Hash string, CreatedAt string}. The component shows those results.

import axios from "../utils/client"
import { useEffect, useState } from "react"
import { useStore } from "../Context/store"
import { VersionChangeEvent } from "../Context/store"
import { url } from "../utils/constants"
import { getDayOfWeek } from "../utils/time"
import "./History.css"

const History = () => {
    const [repo, reload, setModal] = useStore(state => [state.repo, state.reload, state.setModal])
    const { name } = repo
    const [history, setHistory] = useState<VersionChangeEvent[]>([])
    useEffect(() => {
        if (name.length) axios.get(`${url}/repoHistory?repo=${name}`)
            .then(res => {
                if (res && res.data && Array.isArray(res.data)) setHistory(res.data)
                else setHistory([])
            })
    }, [name, reload])
    // Create a function that will allow you to go back to a previous version of the code.
    return (
        <div className="history">
            <h3>Historial de deploys -- {repo.name}</h3>
            <div className="events">
                    <p>Fecha del Deploy</p>
                    <p>Dev del Commit</p>
                    <p>Hash</p>
                    <p>Mensaje del Commit</p>
                    <p id="action_column_name">Acción</p>
                {history.map(({Hash, CreatedAt, Commit}, i) => {
                    return <div key={i} className="event">
                        <p>{getDayOfWeek(CreatedAt.split('.')[0])}</p>
                        <p>{Commit.Committer.Name}</p>
                        <p className="hash">{Hash.slice(0, 7)}</p>
                        <p>{Commit.Message}</p>
                        <button onClick={() => {
                            setModal({Hash, CreatedAt, Commit})
                        }}> Rollback </button>
                    </div>
                }
)}
            </div>
        </div>
    )
}

export default History
