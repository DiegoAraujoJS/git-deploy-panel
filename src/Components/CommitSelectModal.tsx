import { useStore } from "../Context/store"
import { toHexString } from "../utils/conversions"

export const CommitSelectModal = () => {
    const [repo, setCommitSelectModal] = useStore(state => [state.repo, state.setCommitSelectModal])
    return (
        <div className="select">

            <div className="events modal columns_four">
                    <p>Dev</p>
                    <p>Fecha</p>
                    <p>Hash</p>
                    <p>Mensaje</p>
                {repo.commits.map((c, i) => {
                    return <div key={i} className="event" onClick={() => setCommitSelectModal({active: false, data: c.commit})}>
                        <p>{c.commit.Committer.Name}</p>
                        <p>{c.commit.Committer.When}</p>
                        <p>{toHexString(c.commit.Hash).slice(0, 7)}</p>
                        <p>{c.commit.Message}</p>
                    </div>
                }
)}
            </div>
        </div>
    )
}
