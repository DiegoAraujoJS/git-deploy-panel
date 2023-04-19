import {useContext, useState} from 'react'
import {AppContext} from '../Context/UpdateVersionContext'
import { checkout } from '../utils/git_actions'

export const VersionChangeModal = () => {
    const [loading, setLoading] = useState(false)
    const {repo, modal, setModal, reload, setReload} = useContext(AppContext)
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
                        setReload(reload + 1)
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
