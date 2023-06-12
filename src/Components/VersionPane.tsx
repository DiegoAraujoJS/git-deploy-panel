import { mdiHammer } from "@mdi/js";
import {Icon} from "@mdi/react";
import { useStore } from "../Context/store";
import { toHexString } from "../utils/conversions";
import { getDayOfWeek } from "../utils/time";
import "./VersionPane.css"
import "./modal.css"
import { shallow } from 'zustand/shallow'

const VersionPane = () => {
    const [repo, setModal, commitSelectModal] = useStore(state => [state.repo, state.setModal, state.commitSelectModal, state.setCommitSelectModal], shallow)
    return (
        <div className="version_pane">
            <div>
                <p>Repo: {repo.name} </p>
                <h6>Versión actual: {toHexString(repo?.head?.Hash as unknown as number[]).slice(0, 7)}</h6>
            </div>
            <div className="commit_select">
                {toHexString(commitSelectModal?.data?.Hash).slice(0, 7)}
            </div>
            <div className="version_pane__select">
                {commitSelectModal ? <div>
                    <p>{commitSelectModal.data.Committer?.Name + ", " + getDayOfWeek(commitSelectModal.data.Committer?.When.match(/\d\d\d\d-\d\d-\d\d|\d\d:\d\d:\d\d/g)?.join(' '))}</p>
                    <p>{commitSelectModal.data.Message}</p>
                    <div className="action" onClick={() => setModal({Hash: toHexString(commitSelectModal.data.Hash), CreatedAt: commitSelectModal.data.Committer.When, Commit: commitSelectModal.data})}>
                        <Icon path={mdiHammer} size={1} />
                        Build y deploy
                    </div>
                </div> : null}
            </div>
        </div>
    )
}

export default VersionPane
