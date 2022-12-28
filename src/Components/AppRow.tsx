import { mdiHammer, mdiSourceBranch } from "@mdi/js"
import Icon from "@mdi/react"
import { useContext } from "react"
import { UpdateVersionContext } from "../Context/UpdateVersionContext"

export default (props: {
    app: string
    version: string
    lastBuild: string
    status: "actualizada" | "desactualizada"
}) => {
    const { dispatch } = useContext(UpdateVersionContext)
    return <div>
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
        <div className='grid grid-cols-3'>
            <div className='flex hover:bg-blue-50 cursor-pointer'>
                <Icon path={mdiHammer} size={1} />
                Build y deploy
            </div>
            <div className='flex hover:bg-blue-50 cursor-pointer' onClick={() => dispatch({
                valueToUpdate: "currentVersion", payload: {
                    app: props.app,
                    value: props.version
                }
            })}>
                <Icon path={mdiSourceBranch} size={1} />
                Cambiar de versión
            </div>
        </div>
    </div>
} 
