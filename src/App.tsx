import './App.css'
import { useEffect, useRef, useState } from 'react'
import VersionPane from './Components/VersionPane'
import AppRow from './Components/AppRow'
import { url } from './utils/constants'
import { Tags } from './Context/UpdateVersionContext'

function App() {
    const [app, setApp] = useState("cloud")
    const [loading, setLoading] = useState(true)
    const appsData = useRef<{
        [k: string]: {
            name: string
            currentVersion: string
            targetVersions: Tags
        }
    }>({})
    useEffect(() => {

        if (!appsData.current[app]) {
            setLoading(true)
            fetch(url + `/getTags`)
                .then(res => res.json())
                .then(tags => {
                    appsData.current[app] = {
                        name: app,
                        currentVersion: "2.3",
                        targetVersions: tags
                    }
                })
                .then(() => setLoading(false))
        }
    }, [app])

    return (
        <div className='h-screen'>
            {!loading ? <VersionPane currentVersion={appsData.current[app].currentVersion} versions={appsData.current[app].targetVersions} /> : null}
            <div className='grid grid-rows-2 gap-5'>
                <AppRow app="test" version='3.6' lastBuild='14/12' status='desactualizada' />
                <AppRow app="cloud" version="2.3" lastBuild='23/11' status='actualizada' />
            </div>
        </div>
    )
}

export default App
