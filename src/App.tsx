import './App.css'
import { useEffect, useState } from 'react'
import VersionPane from './Components/VersionPane'
import AppRow from './Components/AppRow'
import { AppContext, Commit, Repo } from './Context/UpdateVersionContext'
import { url } from './utils/constants'
import History from './Components/History'
import axios from 'axios'

function App() {
    const [{ repos, repo }, setApp] = useState({repos: [] as string[], repo: {name: "", current_version: "", commits: [], head: {Hash:""} as Commit} as Repo})
    const [updatingRemote, setUpdatingRemote] = useState(false)
    const fetchRepos = () => 
        axios.get<{Repos: string[]}>(`${url}/getRepos`)
        .then(({data: {Repos}}) => {
            if (!Repos.length) return null
            axios.get<Repo>(`${url}/getTags?repo=${Repos[0]}`)
            .then(({data}) => setApp({ repos: Repos, repo: {...data, name: Repos[0]} }))
        })

    useEffect(() => {
        console.log("App.tsx useEffect")
        fetchRepos()
    }, [])
    return (
        <AppContext.Provider value={{ repos, repo, setApp }}>
            <div >
                <button onClick={() => {
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
                <VersionPane />
                {repos.map((repo, i) => <AppRow app={repo} key={i}/>)}
                <History/>
            </div>
        </AppContext.Provider>
    )
}

export default App
