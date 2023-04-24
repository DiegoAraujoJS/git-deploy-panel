import axios from '../utils/client';
import {create} from 'zustand';
import { url } from '../utils/constants';

type Commit = {
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

type Repo = {
    commits: {
        commit: Commit
        new_reference: string
        branches: string[]
    }[]
    name: string
    head: Commit
}

export type VersionChangeEvent = {
    Hash: string
    CreatedAt: string
}

type AutoUpdateStatus = {
    seconds: number
    branch: string
}

type HandleModal<T> = (app: string | T) => void

interface IStore {
    repos: string[];
    repo: Repo;
    setApp: (app: string, init?: boolean) => void;
    modal: VersionChangeEvent | null;
    setModal: (modal: VersionChangeEvent | null) => void;
    reload: number;
    setReload: () => void;
    commitSelectModal: {active: boolean, data: Commit} | null;
    setCommitSelectModal: HandleModal<Commit>
    autoUpdateModal: {active: boolean, data: {[k: string]: AutoUpdateStatus}};
    setAutoUpdateModal: HandleModal<AutoUpdateStatus>
}

const getApp = async (get: () => IStore, app: string, init?: boolean) => {
    let repos: string[] = get().repos
    if (init) {
        repos = await axios.get(`${url}/getRepos`).then(res => res.data.Repos)
    }
    const {data} = await axios.get<Repo>(`${url}/getTags?repo=${init ? repos[0] : app}`)
    return {
        repo: data,
        repos
    }
}

export const useStore = create<IStore>((set, get) => ({
    repos: [],
    repo: {name: "", commits: [], head: {Hash:[] as number[]} as Commit} as Repo,
    setApp: async (app, init) => {
        const {repos, repo} = await getApp(get, app, init)
        set(state => ({...state, repos, repo: {...repo, name: init ? repos[0] : app}, commitSelectModal: {active: !!get().commitSelectModal?.active, data: repo.head}}))
    },
    modal: null,
    setModal: (modal) => set(state => ({...state, modal})),
    reload: 0,
    setReload: () => set(state => ({...state, reload: state.reload + 1})),
    commitSelectModal: null,
    setCommitSelectModal: (app) => {
        console.log(app)
        if (app === "close") return set(state => ({...state, commitSelectModal: {...get().commitSelectModal!, active: false}}))
        if (typeof app == "string") {
            return getApp (get, app).then(
                ({repo, repos}) => set(state => ({...state, repo: {...repo, name: app}, repos, commitSelectModal: {active: true, data: repo.head}}))
            )
        }
        return set(state => ({...state, commitSelectModal: {active: false, data: app}}))
    },
    autoUpdateModal: {active: false, data: {}},
    setAutoUpdateModal: (app) => {
        if (app === "close") return set(state => ({...state, autoUpdateModal: {...get().autoUpdateModal, active: false}}))
        if (typeof app === "string") {
            return getApp(get, app).then(
                ({repo, repos}) => set(state => ({...state, repo: {...repo, name: app}, repos, autoUpdateModal: {active: true, data: {...get().autoUpdateModal.data}}}))
            )
        }
        return set(state => ({...state, autoUpdateModal: {active: false, data: {...get().autoUpdateModal.data, [get().repo.name]: app}}}))
    }
}));
