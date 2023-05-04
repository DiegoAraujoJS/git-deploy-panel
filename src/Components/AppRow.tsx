import roundUpdate from "@iconify/icons-ic/round-update"
import gitBranch from "@iconify/icons-tabler/git-branch"
import {Icon} from "@iconify/react"
import { useStore } from "../Context/store"

 const AppRow = ({ app }: { app: string }) => {
    const [setApp, setAutoUpdateModal, setCommitSelectModal, autoUpdateModal] = useStore(state => [state.setApp, state.setAutoUpdateModal, state.setCommitSelectModal, state.autoUpdateModal])
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
                <Icon icon={gitBranch} height="25" width="25"/>
                Update
            </div>
            <div className="action" onClick={() => setAutoUpdateModal(app)}>
                <Icon icon={roundUpdate} height="25" width="25"/>
                <span>Auto-Update</span>
                {autoUpdateModal.data[app] ? 
                <div className={autoUpdateModal.data[app].Status === 2 ? "status_error" : "status"}>
                    <span><span className="monospace">{autoUpdateModal.data[app]?.Branch}</span> cada </span>
                    <span><span className="monospace">{autoUpdateModal.data[app]?.Seconds}</span> segundos</span>
                </div> : null}
            </div>
        </div>
    </div>
} 

export default AppRow
