import {  mdiAlarm, mdiSourceBranch } from "@mdi/js"
import {Icon} from "@mdi/react"
import { useContext  } from "react"
import { AppContext } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"

 const AppRow = ({ app }: { app: string }) => {
    const { setApp, repos } = useContext(AppContext)
    const fetchTags = () => {
        fetch(`${url}/getTags?repo=${app}`)
            .then(res => res.json())
            .then(tags => {
                console.log(tags)
                setApp({ repos, repo: { ...tags, name: app } })
            })
    }
    return <div className="app_row">
        <div >
            <p >
                App: {app}
            </p>
        </div>
        <div  >
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
