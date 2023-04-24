import {  mdiAlarm, mdiSourceBranch } from "@mdi/js"
import {Icon} from "@mdi/react"
import { useStore } from "../Context/store"

 const AppRow = ({ app }: { app: string }) => {
    const [setApp, setAutoUpdateModal, setCommitSelectModal] = useStore(state => [state.setApp, state.setAutoUpdateModal, state.setCommitSelectModal])
    const fetchTags = (e: any) => {
        console.log(e.target)
        e.target.classList.add('loading')
        setApp(app)
        e.target.classList.remove('loading')
    }
    return <div className="app_row">
        <div className="title" onClick={fetchTags}>
            <p>
                App: {app}
            </p>
        </div>
        <div>
            <div className="action" onClick={() => setCommitSelectModal(app)}>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
            <div className="action" onClick={() => setAutoUpdateModal(app)}>
                <Icon path={mdiAlarm} size={1} />
                Auto-Update
            </div>
        </div>
    </div>
} 

export default AppRow
