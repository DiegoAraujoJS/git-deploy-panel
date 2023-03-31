// Create a History Component. This component will display the history of version changes in time. The component consumes an api endpoint (/repoHistory?repo=${repo.name}) that returns a list of objects of the form {Hash string, CreatedAt string}. The component shows those results.

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"
import { checkout } from "../utils/git_actions"

type VersionChangeEvent = {
    Hash: string
    CreatedAt: string
}

const History = () => {
    const { repo } = useContext(AppContext)
    const { name } = repo
    const [history, setHistory] = useState<VersionChangeEvent[]>([])
    useEffect(() => {
        if (name.length) axios.get(`${url}/repoHistory?repo=${name}`)
            .then(res => {
                if (res && res.data && Array.isArray(res.data)) setHistory(res.data)
                else setHistory([])
            })
    }, [name])
    // Create a function that will allow you to go back to a previous version of the code.
    return (
        <div className="grid grid-cols-2 divide-x-4 float-left bg-cyan-50 p-5">
            <div>
                <p className="font-mono">{repo.name}</p>
                {history.map((v, i) => <div key={i} className="flex space-x-10">
                        <p>{v.CreatedAt.split('.')[0]}</p>
                        <p className="font-bold">{v.Hash.slice(0, 7)}</p>
                        <button className="" onClick={() => checkout(name, v.Hash)}> Volver a esta versión </button>
                    </div>
)}
            </div>
        </div>
    )
}

export default History
