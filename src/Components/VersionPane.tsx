import { mdiHammer } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react"
import { Tags} from "../Context/UpdateVersionContext"
import { url } from "../utils/constants";

type ItemType<T> = T extends Array<infer U> ? U : T;

export default ({currentVersion, versions}: {
        currentVersion: string
        versions: Tags
    }) => {
        console.log(versions)
    const [selectedBranch, setSelectedBranch] = useState<ItemType<Tags> | undefined>(undefined)
    return (
        <div className="grid grid-cols-2 divide-x-4 float-left max-w-sm">
            <div>
                <h6>{currentVersion}</h6>
            </div>
            <div>
                <select onChange={(e) => {console.log(e.target.value);setSelectedBranch(versions.find(v => v.Name === e.target.value))}}>
                    {versions.map((v, i) => <option key={i} >{v.Name}</option>)}
                </select>
                {selectedBranch ? <div>
                <p>{selectedBranch.Tagger.Name + ", " + selectedBranch.Tagger.When.match(/.*(?=T)/)![0]}</p>
                <br/>
                <p>{selectedBranch.Message}</p>

                <br/>
            <div className='flex hover:bg-blue-50 cursor-pointer' onClick={() => {
                    fetch(`${url}/checkout?tag=${selectedBranch.Name}`)
                    .then(res => res.json())
                    .then(res => alert(res))
                }}>
                <Icon path={mdiHammer} size={1} />
                Build y deploy
            </div>
                </div> : null}
            </div>
        </div>
    )
}
