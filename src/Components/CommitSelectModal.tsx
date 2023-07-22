import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { useStore } from "../Context/store"
import axiosInstance from "../utils/client"
import { url } from "../utils/constants"
import { toHexString } from "../utils/conversions"
import { getDayOfWeek } from "../utils/time"
import "./modal.css"

type CommitList = {
    Hash: number[]
    Message: string
    Committer: {
        Name: string
        Email: string
        When: string
    }
}[]

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

export const CommitSelectModal = () => {
    const [repo, handleModal] = useStore(state => [state.repo, state.handleModal])
    const [branch, setBranch] = useState<string | undefined>(undefined)
    const page_jump = useMemo(() => 20, [])
    const [loading, setLoading] = useState(true)

    const [commits, dispatch] = useReducer(reducer, [])

    const initial = useCallback(() => axiosInstance(`${url}/getCommits?repo=${repo.name}&j=${page_jump}${branch ? "&branch="+branch : ""}`).then(res => {
        dispatch({type: "all", payload: res.data})
    }), [branch, repo])

    const nextJump = useCallback(() => axiosInstance(`${url}/getCommits?repo=${repo.name}&i=${commits.length}&j=${commits.length + page_jump}${branch ? "&branch="+branch : ""}`).then(res => {
        dispatch({type: "add", payload: res.data})
    }), [commits, branch, repo])

    const getAll = useCallback(() => axiosInstance(`${url}/getCommits?repo=${repo.name}${branch ? "&branch="+branch : ""}`).then(res => {
        dispatch({type: "all", payload: res.data})
    }), [branch, repo])

    useEffect(() => {
        if (!repo.name) return
        console.log("commit select modal", repo)
        setLoading(true);
        initial().then(() => setLoading(false))
    }, [repo, branch])

    return (
        <div className="select_container">
            <div className="options">
                <div>
                    <span>Todos los commits</span>
                    <input type="checkbox" checked={!branch} onChange={() => {
                        return branch ? setBranch(undefined) : setBranch(repo.branches[0])
                    }}/>
                </div>
                {branch ? <div>
                    <span>Branch</span>
                    <select name="branch" value={branch} onChange={e => setBranch(e.target.value)}>
                        {repo.branches.map((b, i) => <option key={i}>{b}</option>)}
                    </select>
                </div> : null}
                <div className="close" onClick={() => {
                    // By closing the modal, we leave the repo head as the default selected target commit.
                    handleModal("commitSelectModal", repo.head, undefined)
                }}>X</div>
            </div>
            <div className="select" onClick={(e) => e.stopPropagation()}>
                {loading ? <div className="lds-dual-ring"></div> : 
                    <div className="events modal columns_four">
                        <p>Dev</p>
                        <p>Fecha</p>
                        <p>Hash</p>
                        <p>Mensaje</p>
                    {commits.map((c, i) => <div key={i} className="event" onClick={(e) => e.detail === 2 ? handleModal("commitSelectModal", c, undefined) : null}>
                        <p>{c.Committer.Name}</p>
                        <p>{getDayOfWeek(c.Committer?.When.match(/\d\d\d\d-\d\d-\d\d|\d\d:\d\d:\d\d/g)?.join(' '))}</p>
                        <p className="hash">{toHexString(c.Hash).slice(0, 7)}</p>
                        <p>{c.Message}</p>
                    </div>)}
                        <button onClick={nextJump}>Más</button>
                        <button onClick={getAll}>Todos</button>
                    </div> }
            </div>
        </div>
    )
}
