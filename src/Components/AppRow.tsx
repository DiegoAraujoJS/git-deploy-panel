import { mdiHammer, mdiSourceBranch } from "@mdi/js"
import Icon from "@mdi/react"
import { useContext, useEffect, useState } from "react"
import { AppContext, Apps, Tags } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants"

export default ({ app }: { app: Apps }) => {
    const { setApp } = useContext(AppContext)
    const [{ version, last_build }, setStatus] = useState({ version: "", last_build: "" })
    const fetchTags = () => {
        fetch(`${url[app]}/getTags`)
            .then<Tags & { last_build: { Version: string, Date: string } }>(res => res.json())
            .then(repo => {
                console.log(repo)
                setStatus({ version: repo.tags.find(tag => tag.commit.Hash === repo.last_build.Version)?.new_reference || "", last_build: repo.last_build.Date.split(".")[0] })
                return setApp({ app, repo })
            })
    }
    useEffect(() => {
        fetchTags()
    }, [])
    return <div className="grid grid-rows-2 gap-5 p-5 bg-blue-50">
        <div className="grid grid-cols-4 gap-3 bg-gray-100 h-10 content-center">
            <p className="text-gray-700 font-bold">
                App: {app}
            </p>
            <p className="text-gray-700 font-bold">
                Versión: {version}
            </p>
            <p className="text-gray-700 font-bold">
                Último build: {last_build}
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
