import roundUpdate from "@iconify/icons-ic/round-update"
import gitBranch from "@iconify/icons-tabler/git-branch"
import {Icon} from "@iconify/react"
import { useStore } from "../Context/store"
import "./modal.css"

 const AppRow = ({ app }: { app: string }) => {
    const [setApp, handleModal, autoUpdateStatus] = useStore(state => [state.setApp, state.handleModal, state.autoUpdateStatus])
    const fetchTags = (e: any) => {
        e.target.classList.add('loading')
        setApp(app)
        e.target.classList.remove('loading')
    }
    return (
        <div className="app_row">
            <div className="title" onClick={fetchTags}>
                <p>
                    App: {app}
                </p>
            </div>
            <div>
                <div className="action" onClick={() => handleModal("commitSelectModal", null)}>
                    <Icon icon={gitBranch} height="25" width="25"/>
                    Update
                </div>
                <div className="action" onClick={() => autoUpdateStatus[app] && handleModal("autoUpdateModal", autoUpdateStatus[app])}>
                    <Icon icon={roundUpdate} height="25" width="25"/>
                    <span>Auto-Update</span>
                    {autoUpdateStatus[app] ? 
                        <div className={autoUpdateStatus[app].Status === 2 ? "status_error" : "status"} >
                            <span><span className="monospace">{autoUpdateStatus[app]?.Branch}</span> cada </span>
                            <span><span className="monospace">{autoUpdateStatus[app]?.Seconds}</span> segundos</span>
                            <div className="log_icon" onClick={(e) => {
                                e.stopPropagation()
                                handleModal("logModal", app)
                            }}><Icon icon="ic:outline-text-snippet" /></div>
                        </div> : null}
                </div>
            </div>
        </div>
    )
} 

export default AppRow
