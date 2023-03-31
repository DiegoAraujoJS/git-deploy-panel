import { mdiHammer } from "@mdi/js";
import {Icon} from "@mdi/react";
import { useContext, useEffect, useState } from "react"
import { AppContext, Repo } from "../Context/UpdateVersionContext"
import { checkout } from "../utils/git_actions";

type ItemType<T> = T extends Array<infer U> ? U : T;

const VersionPane = () => {
    const { repo } = useContext(AppContext)
    const { commits, current_version, name } = repo
    const [selectedBranch, setSelectedBranch] = useState<ItemType<Repo['commits']> | undefined>()
    useEffect(() => {
        console.log("VersionPane.tsx")
        console.log(import.meta.env.MODE)
        setSelectedBranch(commits?.find(v => v.new_reference === current_version))
    }, [commits, current_version])
    const select_value = selectedBranch ? selectedBranch.new_reference + " " + selectedBranch.commit.Hash.slice(0,7) : ""
    return (
        <div>
            <div className="grid grid-cols-2 divide-x-4 float-left bg-cyan-50 p-5">
                <div>
                    <p>Repo: {repo.name}</p>
                    <h6 className="font-bold">{current_version} --- {repo?.head?.Hash.slice(0, 7)}</h6>
                </div>
                <div>
                    <select value={select_value} onChange={(e) => { setSelectedBranch(commits.find(v => e.target.value.includes(v.commit.Hash.slice(0,7)))) }}>
                        {commits?.map((v, i) => <option key={i} >{v.new_reference} {v.commit.Hash.slice(0,7)}</option>)}
                    </select>
                    {selectedBranch ? <div>
                        <p>{selectedBranch.commit.Committer.Name + ", " + selectedBranch.commit.Committer.When.match(/.*(?=T)/)![0]}</p>
                        <br />
                        <p>{selectedBranch.commit.Message}</p>
                        <br />
                        <div className='flex hover:bg-blue-50 cursor-pointer' onClick={() => checkout(name, selectedBranch?.commit.Hash)}>
                            <Icon path={mdiHammer} size={1} />
                            Build y deploy
                        </div>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}

export default VersionPane
