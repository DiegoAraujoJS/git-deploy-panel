import { useEffect, useState } from "react"
import { useStore } from "../Context/store"

export const AutoUpdateModal = () => {
    const [repo, autoUpdateModal, setAutoUpdateModal] = useStore(state => [state.repo, state.autoUpdateModal, state.setAutoUpdateModal])
    const [branch, setBranch] = useState<string | undefined>(undefined)
    const [branches, setBranches] = useState([] as string[])
    useEffect(() => {
        const set_branches = new Set<string>()
        for (const c of repo.commits) {
            for (const b of c.branches) {
                set_branches.add(b)
            }
        }
        setBranches([...set_branches])
        setBranch([...set_branches][0])
    }, [repo, autoUpdateModal])
    return (
        <div className="select_container">
                <div>
                    <span>Auto-Build de {repo.name}</span>
                </div>
            <div className="options">
                <div>
                    <span>Segundos</span>
                    <input type="number"/>
                </div>
                {branch ? <div>
                    <span>Branch</span>
                    <select name="branch" value={branch} onChange={e => setBranch(e.target.value)}>
                        {branches.map((b, i) => <option key={i}>{b}</option>)}
                    </select>
                </div> : null}
            </div>
            <button>Aceptar</button>
            <button onClick={() => setAutoUpdateModal("close")}>Cancelar</button>
        </div>
    )
}
