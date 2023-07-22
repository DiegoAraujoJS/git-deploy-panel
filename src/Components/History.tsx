import axiosInstance from "../utils/client"
import { useCallback, useEffect, useMemo, useReducer } from "react"
import { useStore } from "../Context/store"
import { VersionChangeEvent } from "../Context/store"
import { url } from "../utils/constants"
import { getDayOfWeek } from "../utils/time"
import "./History.css"

type CommitList = VersionChangeEvent[]

type ActionAdd = {
    type: "add"
    payload: CommitList
}

type ActionAll = {
    type: "all"
    payload: CommitList
}

const reducer = (state: CommitList, action: ActionAdd | ActionAll) => {
    switch (action.type) {
    case "add":
        return [...state, ...action.payload]
    case "all":
        return action.payload
    }
}

const History = () => {
    const [repo, reload, setModal] = useStore(state => [state.repo, state.reload, state.handleModal])
    const [history, dispatch] = useReducer(reducer, [])
    const page_jump = useMemo(() => 20, [])

    const initial = useCallback(() => axiosInstance<CommitList>(`${url}/repoHistory?repo=${repo.name}&j=${page_jump}`).then(res => {
        dispatch({type: "all", payload: res.data})
    }), [repo])

    const nextJump = useCallback(() => axiosInstance<CommitList>(`${url}/repoHistory?repo=${repo.name}&i=${history.length}&j=${history.length + page_jump}`).then(res => {
        dispatch({type: "add", payload: res.data})
    }), [repo, history])

    const getAll = useCallback(() => axiosInstance<CommitList>(`${url}/repoHistory?repo=${repo.name}`).then(res => {
        dispatch({type: "all", payload: res.data})
    }), [repo])

    useEffect(() => {
        initial()
    }, [repo, reload])
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
                            setModal("versionChangeModal", {Hash, CreatedAt, Commit})
                        }}> Rollback </button>
                    </div>
                }
)}
                {history.length ? <div>
                    <button onClick={nextJump}>Más</button>
                    <button onClick={getAll}>Todos</button>
                </div> : null}
            </div>
        </div>
    )
}

export default History
