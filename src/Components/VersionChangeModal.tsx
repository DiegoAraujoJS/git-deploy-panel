import {useState} from 'react'
import { useStore } from '../Context/store'
import { checkout } from '../utils/git_actions'

export const VersionChangeModal = () => {
    const [loading, setLoading] = useState(false)
    const [modal, setModal, repo, setReload, setApp] = useStore(state => [state.modal, state.setModal, state.repo, state.setReload, state.setApp])
    return <div className="confirm">
        <p>Estás seguro que querés cambiar la versión de {repo.name} a {modal?.Hash.slice(0, 7)}?</p>
        <div>
            <button onClick={() => {
                setModal(null)
            }}>Cancelar</button>
            <button onClick={() => {
                setLoading(true)
                checkout(repo.name, modal!.Hash)
                    .then(() => {
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
            }}>{loading ? `Moviendo versión...` : "Confirmar"}</button>
        </div>
    </div>
}
