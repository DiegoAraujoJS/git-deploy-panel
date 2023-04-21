import {  mdiAlarm, mdiSourceBranch } from "@mdi/js"
import {Icon} from "@mdi/react"
import { useStore } from "../Context/store"

 const AppRow = ({ app }: { app: string }) => {
    const [setApp] = useStore(state => [state.setApp, state.repos])
    const fetchTags = (e: any) => {
        e.target.classList.add('loading')
        setApp(app)
        e.target.classList.remove('loading')
    }
    return <div className="app_row">
        <div >
            <p >
                App: {app}
            </p>
        </div>
        <div>
            <div className="action" onClick={fetchTags}>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
            <div className="action" onClick={() => console.log('auto update')}>
                <Icon path={mdiAlarm} size={1} />
                Auto-Update
            </div>
        </div>
    </div>
} 

export default AppRow
