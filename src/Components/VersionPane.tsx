import { mdiHammer } from "@mdi/js";
import {Icon} from "@mdi/react";
import { useContext, useEffect, useState } from "react"
import { AppContext, Repo } from "../Context/UpdateVersionContext"
import { checkout } from "../utils/git_actions";
import { VersionChangeModal } from "./Modal";
import "./VersionPane.css"

type ItemType<T> = T extends Array<infer U> ? U : T;

const VersionPane = () => {
    const { repo, modal, setModal } = useContext(AppContext)
    const { commits, current_version, name } = repo
    const [selectedBranch, setSelectedBranch] = useState<ItemType<Repo['commits']> | undefined>()
    useEffect(() => {
        setSelectedBranch(commits?.find(v => v.new_reference === current_version))
    }, [commits, current_version])
    const select_value = selectedBranch ? selectedBranch.new_reference + " " + selectedBranch.commit.Hash.slice(0,7) : ""
    return (
        <div className="version_pane">
            <div>
                <p>Repo: {repo.name}</p>
                <h6>{current_version} --- {repo?.head?.Hash.slice(0, 7)}</h6>
            </div>
            <div className="version_pane__select">
                <select value={select_value} onChange={(e) => { setSelectedBranch(commits.find(v => e.target.value.includes(v.commit.Hash.slice(0,7)))) }}>
                    {commits?.map((v, i) => <option key={i} >{v.new_reference} {v.commit.Hash.slice(0,7)}</option>)}
                </select>
                {selectedBranch ? <div>
                    <p>{selectedBranch.commit.Committer.Name + ", " + selectedBranch.commit.Committer.When.match(/.*(?=T)/)![0]}</p>
                    <p>{selectedBranch.commit.Message}</p>
                    <div className="action" onClick={() => setModal({Hash: selectedBranch.commit.Hash, CreatedAt: selectedBranch.commit.Committer.When})}>
                        <Icon path={mdiHammer} size={1} />
                        Build y deploy
                    </div>
                    {modal && <VersionChangeModal/>}

                </div> : null}
            </div>

        </div>
    )
}

export default VersionPane
