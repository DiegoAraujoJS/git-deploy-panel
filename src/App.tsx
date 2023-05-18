import './App.css'
import { useEffect, useState } from 'react'
import VersionPane from './Components/VersionPane'
import AppRow from './Components/AppRow'
import { url } from './utils/constants'
import History from './Components/History'
import axios from './utils/client'
import { VersionChangeModal } from './Components/VersionChangeModal'
import { CommitSelectModal } from './Components/CommitSelectModal'
import { useStore } from './Context/store'
import { AutoUpdateModal } from './Components/AutoUpdateModal'
import { LogModal } from './Components/Log'

type UpdateReposError = {
    Err: string
    Name: string
}

function App() {
    const [setApp, repos, modal, commitSelectModal, repo, autoUpdateModal, logModal] = useStore(state => [state.setApp, state.repos, state.modal, state.commitSelectModal, state.repo, state.autoUpdateModal, state.logModal])
    const [updatingRemote, setUpdatingRemote] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('password') !== null)
        // On the line below we are initializing the app with the first repo in the list
        setApp('', true)
    }, [])
    if (isAuthenticated) return (
        <div className='repos'>
            <button className='update' onClick={() => {
                setUpdatingRemote(true)
                axios.get(`${url}/updateRepos`)
                    .then(() => {
                        setApp(repo.name)
                        setUpdatingRemote(false)
                    })
                    .catch((err) => {
                        let message = ""
                        if (err.response.data) {
                            message = err.response.data.map(({Err}: {Err: UpdateReposError}) => `${Err.Err}\t${Err.Name}`)
                        }
                        alert("Ha ocurrido un error: " + message)
                        setUpdatingRemote(false)
                    })
            }}>
                {updatingRemote ? "Actualizando..." : "Actualizar repositorios"}
            </button>
            <div className="version_table">
                <VersionPane />
                <div className='app_rows'>{repos.map((repo, i) => <AppRow app={repo} key={i}/>)}</div>
            </div>
            <History/>
            {modal && <VersionChangeModal/>}
            {commitSelectModal?.active && <CommitSelectModal/>}
            {autoUpdateModal.active && <AutoUpdateModal/>}
            {logModal && <LogModal/>}
        </div>
    )
    return (
        <div className='login'>
            <h1>Git Deploy</h1>
            <input type='password' placeholder='Contraseña' onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    localStorage.setItem('password', e.currentTarget.value)
                    location.reload()
                }
            }}/>
        </div>
    )
}

export default App
