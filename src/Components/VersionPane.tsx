import { mdiHammer } from "@mdi/js";
import Icon from "@mdi/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { AppContext, Repo } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants";

type ItemType<T> = T extends Array<infer U> ? U : T;

export default () => {
    const { repo } = useContext(AppContext)
    const { commits, current_version, name } = repo
    const [selectedBranch, setSelectedBranch] = useState<ItemType<Repo['commits']> | undefined>()
    const checkout = () => axios.get(`${url}/checkout?repo=${name}&commit=${selectedBranch?.commit.Hash}`)
        .then(() => location.reload())
    useEffect(() => {
        const target_tag = commits.find(v => v.new_reference === current_version)
        setSelectedBranch(target_tag)
    }, [current_version])
    return (
        <div>
            <div className="grid grid-cols-2 divide-x-4 float-left bg-cyan-50 p-5">
                <div>
                    <p>Repo: {repo.name}</p>
                    <h6 className="font-bold">{current_version} --- {repo.head?.Hash.slice(0, 7)}</h6>
                </div>
                <div>
                    <select value={selectedBranch?.new_reference} onChange={(e) => { setSelectedBranch(commits.find(v => v.new_reference === e.target.value)) }}>
                        {commits.map((v, i) => <option key={i} >{v.new_reference}</option>)}
                    </select>
                    {selectedBranch ? <div>
                        <p>{selectedBranch.commit.Committer.Name + ", " + selectedBranch.commit.Committer.When.match(/.*(?=T)/)![0]}</p>
                        <br />
                        <p>{selectedBranch.commit.Message}</p>
                        <br />
                        <div className='flex hover:bg-blue-50 cursor-pointer' onClick={checkout}>
                            <Icon path={mdiHammer} size={1} />
                            Build y deploy
                        </div>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}
