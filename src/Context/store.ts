import axios from 'axios';
import {create} from 'zustand';
import { url } from '../utils/constants';

export type Commit = {
    Name: string
    Message: string
    Target: string
    Committer: {
        Name: string
        Email: string
        When: string
    }
    Hash: number[]
}

export type Repo = {
    commits: {
        commit: Commit
        new_reference: string
    }[]
    name: string
    head: Commit
}

export type Apps = 'test'

export type VersionChangeEvent = {
    Hash: string
    CreatedAt: string
}

interface IStore {
    repos: string[];
    repo: Repo;
    setApp: (app: string, init?: boolean) => void;
    modal: VersionChangeEvent | null;
    setModal: (modal: VersionChangeEvent | null) => void;
    reload: number;
    setReload: () => void;
    commitSelectModal: {active: boolean, data: Commit} | null;
    setCommitSelectModal: (commit: {active: boolean, data: Commit} | null) => void;
}

export const useStore = create<IStore>((set, get) => ({
    repos: [],
    repo: {name: "", commits: [], head: {Hash:[] as number[]} as Commit} as Repo,
    setApp: async (app, init) => {
        let repos: string[] = get().repos
        if (init) {
            repos = await axios.get(`${url}/getRepos`).then(res => res.data.Repos)
        }
        const {data} = await axios.get<Repo>(`${url}/getTags?repo=${init ? repos[0] : app}`)
        set(state => ({...state, repos, repo: {...data, name: init ? repos[0] : app}, commitSelectModal: {active: false, data: data.head}}))
    },
    modal: null,
    setModal: (modal) => set(state => ({...state, modal})),
    reload: 0,
    setReload: () => set(state => ({...state, reload: state.reload + 1})),
    commitSelectModal: null,
    setCommitSelectModal: (commit) => set(state => ({...state, commitSelectModal: commit})),
}));
