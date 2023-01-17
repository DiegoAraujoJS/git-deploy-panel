import { mdiHammer } from "@mdi/js";
import Icon from "@mdi/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { AppContext, Tags } from "../Context/UpdateVersionContext"
import { url } from "../utils/constants";

type ItemType<T> = T extends Array<infer U> ? U : T;

export default () => {
    const { repo: { current_version, tags }, app }: {
        repo: Tags
        app: "test"
    } = useContext(AppContext)
    const [selectedBranch, setSelectedBranch] = useState<ItemType<Tags['tags']> | undefined>()
    const checkout = () => axios.get(`${url[app]}/checkout?commit=${selectedBranch?.commit.Hash}`)
        .then(console.log)
        .then(() => location.reload())
    useEffect(() => {
        const target_tag = tags.find(v => v.new_reference === current_version)
        setSelectedBranch(target_tag)
    }, [current_version])
    return (
        <div className="grid grid-cols-2 divide-x-4 float-left bg-cyan-50 p-5">
            <div>
                <h6>{current_version}</h6>
            </div>
            <div>
                <select value={selectedBranch?.new_reference} onChange={(e) => { setSelectedBranch(tags.find(v => v.new_reference === e.target.value)) }}>
                    {tags.map((v, i) => <option key={i} >{v.new_reference}</option>)}
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
    )
}
