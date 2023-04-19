// Create a History Component. This component will display the history of version changes in time. The component consumes an api endpoint (/repoHistory?repo=${repo.name}) that returns a list of objects of the form {Hash string, CreatedAt string}. The component shows those results.

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AppContext, VersionChangeEvent } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"
import { getDayOfWeek } from "../utils/time"
import "./History.css"

const History = () => {
    const { repo, setModal, reload } = useContext(AppContext)
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
            <h3>Historial de cambio de versiones -- {repo.name}</h3>
            <div className="events">
                    <p>Dev</p>
                    <p>Fecha</p>
                    <p>Hash</p>
                    <p>Mensaje</p>
                    <p id="action_column_name">Acción</p>
                {history.map(({Hash, CreatedAt}, i) => {
                    const v = repo.commits?.find(c =>  c.commit.Hash === Hash)
                    return <div key={i} className="event">
                        <p>{v?.commit.Committer.Name}</p>
                        <p>{getDayOfWeek(CreatedAt.split('.')[0])}</p>
                        <p>{Hash.slice(0, 7)}</p>
                        <p>{v?.commit.Message}</p>
                        <button onClick={() => {
                            setModal({Hash, CreatedAt})
                        }}> Rollback </button>
                    </div>
                }
)}
            </div>
        </div>
    )
}

export default History
