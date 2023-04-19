import './App.css'
import { useEffect, useState } from 'react'
import VersionPane from './Components/VersionPane'
import AppRow from './Components/AppRow'
import { AppContext, Commit, Repo, VersionChangeEvent } from './Context/UpdateVersionContext'
import { url } from './utils/constants'
import History from './Components/History'
import axios from 'axios'
import { VersionChangeModal } from './Components/Modal'
import { toHexString } from './utils/conversions'

function App() {
    const [{ repos, repo }, setApp] = useState({repos: [] as string[], repo: {name: "", commits: [], head: {Hash:""} as Commit} as Repo})
    const [modal, setModal] = useState<VersionChangeEvent | null>(null)
    const [reload, setReload] = useState(0)
    const [updatingRemote, setUpdatingRemote] = useState(false)
    const fetchRepos = () => 
        axios.get<{Repos: string[]}>(`${url}/getRepos`)
        .then(({data: {Repos}}) => {
            if (!Repos.length) return null
            if (!reload) return axios.get<Repo>(`${url}/getTags?repo=${Repos[0]}`)
            .then(({data}) => setApp({ repos: Repos, repo: {...data, name: Repos[0], commits: data.commits.map(commit => ({...commit, commit: {...commit.commit, Hash: toHexString(commit.commit.Hash as unknown as number[])}}))} }))
            return axios.get<Repo>(`${url}/getTags?repo=${repo.name}`)
            .then(({data}) => setApp({repos: Repos, repo: {...repo, head: data.head}}))
        })

    useEffect(() => {
        console.log("App.tsx useEffect")
        fetchRepos()
    }, [reload])
    return (
        <AppContext.Provider value={{ repos, repo, setApp, modal, setModal, reload, setReload}}>
            <div className='repos'>
                <button className='update' onClick={() => {
                    setUpdatingRemote(true)
                    axios.get(`${url}/updateRepos`)
                    .then(() => {
                        alert("Repositorios actualizados")
                        setUpdatingRemote(false)
                        fetchRepos()
                    })
                    .catch((err) => {
                        alert("Ha ocurrido un error:" + err.message)
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
            </div>
        </AppContext.Provider>
    )
}

export default App
