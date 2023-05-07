import { useStore } from '../Context/store'
import { checkout } from '../utils/git_actions'
import "./modal.css"

interface Status {
    Errors: object[]
    Finished: boolean
    Moment: string
    Stdout: string
    Stderr: string
}


export const VersionChangeModal = () => {
    const [modal, setModal, repo, setLogModal] = useStore(state => [state.modal, state.setModal, state.repo, state.setLogModal])

    return <div className="confirm" onClick={(e) => e.stopPropagation()}>
        <p>Estás seguro que querés cambiar la versión de {repo.name} a {modal?.Hash.slice(0, 7)}?</p>
        <div className='choice'>
            <button className='confirm_button' onClick={() => {
                setModal(null)
            }}>Cancelar</button>
            <button className='confirm_button' onClick={() => {
                setModal(null)
                return checkout(repo.name, modal!.Hash)
                .then(res => setLogModal(res.data))
            }}>Confirmar</button>
        </div>
    </div>
}
