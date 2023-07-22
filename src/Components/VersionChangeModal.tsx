import { useStore } from '../Context/store'
import { checkout } from '../utils/git_actions'
import "./modal.css"

export const VersionChangeModal = () => {
    const [modal, setModal, repo] = useStore(state => [state.versionChangeModal, state.handleModal, state.repo])

    return <div className="confirm" onClick={(e) => e.stopPropagation()}>
        <p>Estás seguro que querés cambiar la versión de {repo.name} a {modal?.Hash.slice(0, 7)}?</p>
        <div className='choice'>
            <button className='confirm_button' onClick={() => {
                setModal("versionChangeModal", "close")
            }}>Cancelar</button>
            <button className='confirm_button' onClick={() => {
                const hash = modal!.Hash
                setModal("versionChangeModal", "close")
                return checkout(repo.name, hash)
                .then(res => setModal("logModal", res.data))
            }}>Confirmar</button>
        </div>
    </div>
}
