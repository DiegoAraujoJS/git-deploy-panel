import { useEffect, useState } from "react"
import { useStore } from "../Context/store"
import { toHexString } from "../utils/conversions"
import { getDayOfWeek } from "../utils/time"

export const CommitSelectModal = () => {
    const [repo, setCommitSelectModal] = useStore(state => [state.repo, state.setCommitSelectModal])
    const [branch, setBranch] = useState<string | undefined>(undefined)
    const [branches, setBranches] = useState([] as string[])
    const commits = (branch ? repo.commits.filter(c => c.branches.includes(branch)) : repo.commits).map((c, i) => <div key={i} className="event" onClick={(e) => e.detail === 2 ? setCommitSelectModal(c.commit) : null}>
                            <p>{c.commit.Committer.Name}</p>
                            <p>{getDayOfWeek(c.commit.Committer?.When.match(/\d\d\d\d-\d\d-\d\d|\d\d:\d\d:\d\d/g)?.join(' '))}</p>
                            <p>{toHexString(c.commit.Hash).slice(0, 7)}</p>
                            <p>{c.commit.Message}</p>
                        </div>)
    useEffect(() => {
        const set_branches = new Set<string>()
        for (const c of repo.commits) {
            for (const b of c.branches) {
                set_branches.add(b)
            }
        }
        setBranches([...set_branches])
    }, [])
    return (
        <div className="select_container">
            <div className="options">
                <div>
                    <span>Todos los commits</span>
                    <input type="checkbox" checked={!branch} onChange={() => {
                        return branch ? setBranch(undefined) : setBranch(branches[0])
                    }}/>
                </div>
                {branch ? <div>
                    <span>Branch</span>
                    <select name="branch" value={branch} onChange={e => setBranch(e.target.value)}>
                        {branches.map((b, i) => <option key={i}>{b}</option>)}
                    </select>
                </div> : null}
                <div className="close" onClick={() => setCommitSelectModal("close")}>X</div>
            </div>
            <div className="select" onClick={(e) => e.stopPropagation()}>
                <div className="events modal columns_four">
                    <p>Dev</p>
                    <p>Fecha</p>
                    <p>Hash</p>
                    <p>Mensaje</p>
                    {commits}
                </div>
            </div>
        </div>
    )
}
