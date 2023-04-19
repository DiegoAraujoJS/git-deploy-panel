import {  mdiAlarm, mdiSourceBranch } from "@mdi/js"
import {Icon} from "@mdi/react"
import axios from "axios"
import { useContext  } from "react"
import { AppContext } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"
import { toHexString } from "../utils/conversions"

 const AppRow = ({ app }: { app: string }) => {
    const { setApp, repos } = useContext(AppContext)
    const fetchTags = (e: any) => {
        e.target.classList.add('loading')
        axios.get<any>(`${url}/getTags?repo=${app}`)
            .then(tags => {
                e.target.classList.remove('loading')
                setApp({ repos, repo: { ...tags.data, name: app, commits: tags.data.commits.map((commit: any) => ({...commit, commit: {...commit.commit, Hash: toHexString(commit.commit.Hash as unknown as number[])}}))}})})
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
