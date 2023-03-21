import './App.css'
import { useEffect, useState } from 'react'
import VersionPane from './Components/VersionPane'
import AppRow from './Components/AppRow'
import { AppContext, Commit, Repo } from './Context/UpdateVersionContext'
import { url } from './utils/constants'
import History from './Components/History'

function App() {
    const [{ repos, repo }, setApp] = useState({repos: [] as string[], repo: {name: "", current_version: "", commits: [], head: {} as Commit} as Repo})
    const fetchRepos = () => {
        fetch(`${url}/getRepos`)
            .then(res => res.json())
            .then(({Repos}) => {
                if (Repos.length) return fetch(`${url}/getTags?repo=${Repos[0]}`)
                        .then(res => res.json())
                        .then(tags => {
                            console.log(tags)
                            setApp({ repos: Repos, repo: { ...tags, name: Repos[0] } })
                        })
                return setApp({ repos: Repos, repo })
            })
    }
    useEffect(() => {
        fetchRepos()
    }, [])
    return (
        <AppContext.Provider value={{ repos, repo, setApp }}>
            <div className='h-screen'>
                <VersionPane />
                {repos.map((repo, i) => <AppRow app={repo} key={i}/>)}
                <History/>
            </div>
        </AppContext.Provider>
    )
}

export default App
