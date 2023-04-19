import { mdiHammer } from "@mdi/js";
import {Icon} from "@mdi/react";
import { useContext, useEffect, useState } from "react"
import { AppContext, Commit } from "../Context/UpdateVersionContext"
import { toHexString } from "../utils/conversions";
import "./VersionPane.css"

const VersionPane = () => {
    const { repo, setModal } = useContext(AppContext)
    const { commits } = repo
    const [selectedBranch, setSelectedBranch] = useState<Commit | undefined>()
    useEffect(() => {
        setSelectedBranch({...repo.head, Hash: toHexString(repo.head.Hash as unknown as number[])})
    }, [commits, repo.head])
    const select_value = selectedBranch?.Hash.slice(0,7)
    return (
        <div className="version_pane">
            <div>
                <p>Repo: {repo.name}</p>
                <h6>Versión actual: {toHexString(repo?.head?.Hash as unknown as number[]).slice(0, 7)}</h6>
            </div>
            <div className="version_pane__select">
                <select value={select_value} onChange={(e) => { setSelectedBranch(commits.find(v => e.target.value.includes(v.commit.Hash.slice(0,7)))?.commit) }}>
                    {commits?.map((v, i) => <option key={i} >{v.commit.Hash.slice(0,7)}</option>)}
                </select>
                {selectedBranch ? <div>
                    <p>{selectedBranch.Committer?.Name + ", " + selectedBranch.Committer?.When.match(/.*(?=T)/)![0]}</p>
                    <p>{selectedBranch.Message}</p>
                    <div className="action" onClick={() => setModal({Hash: selectedBranch.Hash, CreatedAt: selectedBranch.Committer.When})}>
                        <Icon path={mdiHammer} size={1} />
                        Build y deploy
                    </div>
                </div> : null}
            </div>

        </div>
    )
}

export default VersionPane
