import { mdiHammer } from "@mdi/js";
import {Icon} from "@mdi/react";
import { useStore } from "../Context/store";
import { toHexString } from "../utils/conversions";
import { getDayOfWeek } from "../utils/time";
import "./VersionPane.css"
import "./modal.css"
import { shallow } from 'zustand/shallow'

const VersionPane = () => {
    const [repo, handleModal, commitSelectModal] = useStore(state => [state.repo, state.handleModal, state.commitSelectModal], shallow)
    return (
        <div className="version_pane">
            <div>
                <p>Repo: {repo.name} </p>
                <h6>Versión actual: {toHexString(repo?.head?.Hash as unknown as number[]).slice(0, 7)}</h6>
            </div>
            <div className="commit_select">
                {toHexString(commitSelectModal?.Hash).slice(0, 7)}
            </div>
            <div className="version_pane__select">
                {commitSelectModal ? <div>
                    <p>{commitSelectModal.Committer?.Name + ", " + getDayOfWeek(commitSelectModal.Committer?.When.match(/\d\d\d\d-\d\d-\d\d|\d\d:\d\d:\d\d/g)?.join(' '))}</p>
                    <p>{commitSelectModal.Message}</p>
                    <div className="action" onClick={() => handleModal("versionChangeModal", {Hash: toHexString(commitSelectModal.Hash), CreatedAt: commitSelectModal.Committer.When, Commit: commitSelectModal}, repo.name)}>
                        <Icon path={mdiHammer} size={1} />
                        Build y deploy
                    </div>
                </div> : null}
            </div>
        </div>
    )
}

export default VersionPane
