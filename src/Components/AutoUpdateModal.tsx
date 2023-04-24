import { useState } from "react"
import { useStore } from "../Context/store"

export const AutoUpdateModal = () => {
    const [repo, setAutoUpdateModal] = useStore(state => [state.repo, state.setAutoUpdateModal])
    const [branch, setBranch] = useState<string | undefined>(undefined)
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
                        {repo.branches.map((b, i) => <option key={i}>{b}</option>)}
                    </select>
                </div> : null}
            </div>
            <button>Aceptar</button>
            <button onClick={() => setAutoUpdateModal("close")}>Cancelar</button>
        </div>
    )
}
