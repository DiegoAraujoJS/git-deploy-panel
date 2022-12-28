import './App.css'
import { mdiHammer, mdiSourceBranch } from '@mdi/js'
import Icon from '@mdi/react'
import { useRef, useState } from 'react'
import VersionPane from './Components/VersionPane'

function App() {
    const [changeVersion, toggleChangeVersion] = useState(false)
    const currentVersion = useRef("2.3")

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
            <div className='flex hover:bg-blue-50 cursor-pointer'>
                <Icon path={mdiHammer} size={1} />
                Build y deploy
            </div>
            <div className='flex hover:bg-blue-50 cursor-pointer' onClick={() => toggleChangeVersion(!changeVersion)}>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
        </div>

    const versions = ['2.3', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '2.4']

    return (
        <div className='h-screen'>
            {changeVersion ? <VersionPane currentVersion={currentVersion.current} versions={versions} /> : null}
            <div className='grid grid-rows-2 gap-5'>
                <div>
                    <Info app="test" version='3.6' lastBuild='14/12' status='desactualizada' />
                    <Actions />
                </div>
                <div>
                    <Info app="cloud" version={currentVersion.current} lastBuild='23/11' status='actualizada' />
                    <Actions />
                </div>
            </div>
        </div>
    )
}

export default App
