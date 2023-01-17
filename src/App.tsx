import './App.css'
import { useState } from 'react'
import VersionPane from './Components/VersionPane'
import AppRow from './Components/AppRow'
import { AppContext, initUpdateVersionState, Tags } from './Context/UpdateVersionContext'

function App() {
    const [{ repo, app }, setApp] = useState<Omit<typeof initUpdateVersionState, "setApp">>({ repo: { tags: [], current_version: "" }, app: "test" })
    return (
        <AppContext.Provider value={{ repo, app, setApp }}>
            <div className='h-screen'>
                <VersionPane />
                <AppRow app='test' />
            </div>
        </AppContext.Provider>
    )
}

export default App
