import './App.css'
import { mdiHammer, mdiSourceBranch, mdiSourceBranchSync } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import VersionPane from './Components/VersionPane'

function App() {
    const [changeVersion, toggleChangeVersion] = useState(false)

    const Info = (props: {
        app: string
        version: string
        lastBuild: string
        status: "actualizada" | "desactualizada"
    }) =>
        <div className="grid grid-cols-4 gap-3 bg-gray-100 h-10 content-center">
            <p className="text-gray-700 font-bold">
                App: {props.app}
            </p>
            <p className="text-gray-700 font-bold">
                Versión: {props.version}
            </p>
            <p className="text-gray-700 font-bold">
                Último build: {props.lastBuild}
            </p>
            <p className="text-gray-700 font-bold">
                Estado: {props.status}
            </p>
        </div>

    const Actions = () =>
        <div className='grid grid-cols-4'>
            <div className='flex'>
                <Icon path={mdiHammer} size={1} />
                Build y deploy
            </div>
            <div className='flex' onClick={() => toggleChangeVersion(!changeVersion)}>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
        </div>

    return (
        <div>
            {changeVersion ? <VersionPane/> : null}
            <div className='grid grid-rows-2 gap-5'>
                <div>
                    <Info app="test" version='3.6' lastBuild='14/12' status='desactualizada' />
                    <Actions />
                </div>
                <div>
                    <Info app="cloud" version='2.0' lastBuild='23/11' status='actualizada' />
                    <Actions />
                </div>
            </div>
        </div>
    )
}

export default App
