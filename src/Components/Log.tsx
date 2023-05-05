import { useCallback, useEffect, useRef, useState } from "react"
import { Status, useStore } from "../Context/store"
import axiosInstance from "../utils/client"
import { url } from "../utils/constants"

export const LogModal = () => {
    const [status, setStatus] = useState<Status | null>(null)
    const [logModal, setLogModal, setApp] = useStore(state => [state.logModal, state.setLogModal, state.setApp])
    const active = useRef(false)
    const getStatus = useCallback(() => axiosInstance.get<Status>(`${url}/getStatus?ID=${logModal}`).then(response => {
        if (!active.current) return
        setStatus(response.data)
        if (response.data.Stderr && response.data.Stderr.match(/<nil>/) === null) return "error"
        if (!response.data.Finished) return new Promise ((resolve, _) => {
            setTimeout(() => resolve(getStatus()), 1000)
        })
        return Promise.resolve()
    }), [logModal])
    useEffect(() => {
        active.current = true
        getStatus()
            .then((result) => {
                if (result === "error") return
                setLogModal(null)
                setApp("reload")
            })
            .catch(err => {
                console.log(err)
                alert("Ha ocurrido un error en el servidor: " + err.response.data)
            })
    }, [])
    return (
        <div className="confirm">
            <div className="close" onClick={() => {
                active.current = false
                setLogModal(null)
            }}>X</div>
            <div className='log'>
                <p>Status: {status?.Moment}</p>
                <p className='stdout'>{status?.Stdout}</p>
                <p className='stderr'>{status?.Stderr}</p>
            </div>
        </div>
    )
}