// Create a History Component. This component will display the history of version changes in time. The component consumes an api endpoint (/repoHistory?repo=${repo.name}) that returns a list of objects of the form {Hash string, CreatedAt string}. The component shows those results.

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AppContext, Commit } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"
import { checkout } from "../utils/git_actions"
import { getDayOfWeek } from "../utils/time"

type VersionChangeEvent = {
    Hash: string
    CreatedAt: string
}

const History = () => {
    const { repo } = useContext(AppContext)
    const { name } = repo
    const [history, setHistory] = useState<VersionChangeEvent[]>([])
    const [isConfirming, setIsConfirming] = useState<null | VersionChangeEvent>(null)
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
        <div>
            <div>
                <p>{repo.name}</p>
                {history.map((v, i) => <div key={i}>
                        <p>{getDayOfWeek(v.CreatedAt.split('.')[0])}</p> <p>{v.Hash.slice(0, 7)}</p>
                        <button  onClick={() => {
                        setIsConfirming(v)
                    }}> Rollback </button>
                    </div>
)}
            </div>
                {isConfirming && <div>
                    Estás seguro que querés cambiar la versión a {isConfirming.Hash.slice(0, 7)}?
                    <div>
                        <button  onClick={() => {
                            setIsConfirming(null)
                        }}>Cancelar</button>
                        <button  onClick={() => {
                            setLoading(true)
                            checkout(repo.name, isConfirming.Hash)
                            .catch(err => {
                                alert("Ha ocurrido un error: " + err.message)
                                setLoading(false)
                                setIsConfirming(null)
                            })
                        }}>{loading ? "Rollbackeando a " + isConfirming.Hash : "Confirmar"}</button>
                    </div>
            </div>}
        </div>
    )
}

export default History
