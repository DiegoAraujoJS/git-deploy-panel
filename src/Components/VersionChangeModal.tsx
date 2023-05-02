import {useCallback, useState} from 'react'
import { useStore } from '../Context/store'
import axiosInstance from '../utils/client'
import { url } from '../utils/constants'
import { checkout } from '../utils/git_actions'

interface Status {
    Errors: object[]
    Finished: boolean
    Moment: string
    Stdout: string
    Stderr: string
}


export const VersionChangeModal = () => {
    const [loading, setLoading] = useState(false)
    const [modal, setModal, repo, setReload, setApp] = useStore(state => [state.modal, state.setModal, state.repo, state.setReload, state.setApp])

    const [status, setStatus] = useState<Status | null>(null)
    const getStatus = useCallback((res: {data: number}) => axiosInstance.get<Status>(`${url}/getStatus?ID=${res.data}`).then(response => {
        console.log(response.data)
        setStatus(response.data)
        if (response.data.Stderr) return "error"
        if (!response.data.Finished) return new Promise ((resolve, _) => {
            setTimeout(() => resolve(getStatus(res)), 500)
        })
        return Promise.resolve()
    }), [])
    return <div className="confirm" onClick={(e) => e.stopPropagation()}>
        <p>Estás seguro que querés cambiar la versión de {repo.name} a {modal?.Hash.slice(0, 7)}?</p>
        <div className='choice'>
            <button className='confirm_button' onClick={() => {
                setModal(null)
            }}>Cancelar</button>
            <button className='confirm_button' onClick={() => {
                setLoading(true)
                checkout(repo.name, modal!.Hash)
                    .then(getStatus)
                    .then((result) => {
                        if (result === "error") return
                        setApp(repo.name)
                        setReload()
                        setLoading(false)
                        setModal(null)
                    })
                    .catch(err => {
                        console.log(err)
                        alert("Ha ocurrido un error en el servidor: " + err.response.data)
                        setLoading(false)
                        setModal(null)
                    })
            }}>Confirmar</button>
        </div>
        {status ? 
            <div className='log'>
                <p>Status: {status.Moment}</p>
                <p className='stdout'>{status.Stdout}</p>
                <p className='stderr'>{status.Stderr}</p>
            </div> : null}
    </div>
}
