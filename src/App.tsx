import './App.css'
import { mdiHammer, mdiSourceBranch } from '@mdi/js'
import Icon from '@mdi/react'
import { useReducer } from 'react'
import VersionPane from './Components/VersionPane'
import { initUpdateVersionState, UpdateVersionAction, UpdateVersionContext } from './Context/UpdateVersionContext'

const reducer = <T extends keyof typeof initUpdateVersionState | "set">(state: typeof initUpdateVersionState, action: UpdateVersionAction<T>) => {
    return {
        ...state,
        [action.valueToUpdate]: action.payload
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initUpdateVersionState)

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

    const Actions = (props: {
        app: string
        version: string
    }) =>
        <div className='grid grid-cols-4'>
            <div className='flex hover:bg-blue-50 cursor-pointer'>
                <Icon path={mdiHammer} size={1} />
                Build y deploy
            </div>
            <div className='flex hover:bg-blue-50 cursor-pointer' onClick={() => dispatch({valueToUpdate: "currentVersion", payload: "2.3"})}>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
        </div>

     const AppRow = (props: {
        app: string
        version: string
        lastBuild: string
        status: "actualizada" | "desactualizada"
    }) =>   <div>
                <Info app={props.app} version={props.version} lastBuild={props.lastBuild} status='desactualizada' />
                <Actions app={props.app} version={props.version} />
            </div>

    const versions = ['2.3', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '2.4']

    return (
        <UpdateVersionContext.Provider value={{
                ...state,
                dispatch
            }}>
            <div className='h-screen'>
                {state.currentVersion ? <VersionPane currentVersion={state.currentVersion} versions={versions} /> : null}
                <div className='grid grid-rows-2 gap-5'>
                    <AppRow app="test" version='3.6' lastBuild='14/12' status='desactualizada'/>
                    <AppRow app="cloud" version="2.3" lastBuild='23/11' status='actualizada' />
                </div>
            </div>
        </UpdateVersionContext.Provider>
    )
}

export default App
