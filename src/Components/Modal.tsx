import {useContext, useState} from 'react'
import {AppContext} from '../Context/UpdateVersionContext'
import { checkout } from '../utils/git_actions'

export const VersionChangeModal = () => {
    const [loading, setLoading] = useState(false)
    const {repo, modal, setModal} = useContext(AppContext)
    return <div className="confirm">
        <p>Estás seguro que querés cambiar la versión a {modal?.Hash.slice(0, 7)}?</p>
        <div>
            <button onClick={() => {
                setModal(null)
            }}>Cancelar</button>
            <button onClick={() => {
                setLoading(true)
                checkout(repo.name, modal!.Hash)
                    .catch(err => {
                        alert("Ha ocurrido un error: " + err.message)
                        setLoading(false)
                        setModal(null)
                    })
            }}>{loading ? "Rollbackeando a " + modal!.Hash : "Confirmar"}</button>
        </div>
    </div>
}
