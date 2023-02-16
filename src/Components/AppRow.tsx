import { mdiHammer, mdiSourceBranch } from "@mdi/js"
import Icon from "@mdi/react"
import { useContext, useEffect, useState } from "react"
import { AppContext, Apps, Tags } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"

export default ({ app }: { app: string }) => {
    const { setApp, repos } = useContext(AppContext)
    const [_, setStatus] = useState<{ version: string, last_build: string }[]>([])
    const fetchTags = () => {
        fetch(`${url}/getTags?repo=${app}`)
            .then(res => res.json())
            .then(tags => {
                console.log(tags)
                setApp({ repos, repo: { ...tags, name: app } })
            })
    }
    return <div className="grid grid-rows-2 gap-5 p-5 bg-blue-50">
        <div className="grid grid-cols-4 gap-3 bg-gray-100 h-10 content-center">
            <p className="text-gray-700 font-bold">
                App: {app}
            </p>
        </div>
        <div className='grid grid-cols-3' onClick={fetchTags}>
            <div className='flex hover:bg-blue-50 cursor-pointer'>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
        </div>
    </div>
} 
