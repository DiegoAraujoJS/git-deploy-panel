import { useCallback, useEffect, useRef, useState } from "react"
import { Status, useStore } from "../Context/store"
import axiosInstance from "../utils/client"
import { url } from "../utils/constants"

export const LogModal = () => {
    const [status, setStatus] = useState<Status | null>(null)
    const [logModal, handleModal, setApp, setReload] = useStore(state => [state.logModal, state.handleModal, state.setApp, state.setReload])
    const active = useRef(false)
    const getStatus = useCallback(() => axiosInstance.get<Status>(`${url}/getStatus?ID=${logModal}`).then(response => {
        if (!active.current) return
        setStatus(response.data)
        if (!response.data.Finished) return new Promise ((resolve, _) => {
            setTimeout(() => resolve(getStatus()), 1000)
        })
        return Promise.resolve()
    }), [logModal])
    useEffect(() => {
        active.current = true
        getStatus()
            .then(() => {
                setApp("reload")
                setReload()
            })
            .catch(err => {
                console.log(err)
                alert("Ha ocurrido un error en el servidor: " + err.response.data)
            })
    }, [])
    return (
        <div className="log">
            <div className="close" onClick={() => {
                active.current = false
                handleModal("logModal", "close")
            }}>X</div>
            <div>
                <p>Status: {status?.Moment}</p>
                {status?.Stdout.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                <p className='stderr'>{status?.Stderr}</p>
            </div>
        </div>
    )
}
