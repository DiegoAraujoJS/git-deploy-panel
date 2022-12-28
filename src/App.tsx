import './App.css'
import { useReducer } from 'react'
import VersionPane from './Components/VersionPane'
import { initUpdateVersionState, reducer, UpdateVersionContext } from './Context/UpdateVersionContext'
import AppRow from './Components/AppRow'


function App() {
    const [state, dispatch] = useReducer(reducer, initUpdateVersionState)

    const versions = ['2.3', '2.4']

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
