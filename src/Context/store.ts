import axios from '../utils/client';
import {create} from 'zustand';
import { url } from '../utils/constants';

interface Commit {
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

interface Repo {
    name: string
    head: Commit
    branches: string[]
}

export interface VersionChangeEvent {
    Hash: string
    CreatedAt: string
    Commit: Commit
}

interface AutoUpdateStatus {
    Repo: string
    Seconds: number
    Branch: string
    Status: number
}

export interface Status {
    Finished: boolean
    Moment: string
    Stdout: string
    Stderr: string
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
    logModal: string | null
    setLogModal: (log: string | null) => void
}

const getApp = async (get: () => IStore, app: string, init?: boolean) => {
    let repos: string[] = get().repos
    if (init) {
        repos = await axios.get(`${url}/getRepos`).then(res => res.data.Repos)
    }
    const {data} = await axios.get<Repo>(`${url}/getTags?repo=${init ? repos[0] : app}`)
    const timers = ((await axios.get<AutoUpdateStatus[]>(`${url}/getTimers`)).data || []).reduce((acc, curr) => ({...acc, [curr.Repo]: curr}), {})
    return {
        repo: data,
        repos,
        autoUpdateModal: {active: false, data: timers},
    }
}

const handleModal: <T>(set: (partial: IStore | Partial<IStore> | ((state: IStore) => IStore | Partial<IStore>), replace?: boolean | undefined) => void, get: () => IStore, app: T, modal: 'autoUpdateModal' | 'commitSelectModal') => void = (set, get, app, modal) => {
        const modalValue = get()[modal]
        if (app === "reload") return getApp(get, get().repo.name).then(payload => set(state => ({...state, ...payload})))
        if (app === "close") return set(state => ({...state, [modal]: {...modalValue, active: false}}))
        if (typeof app === "string") {
            if (app === get().repo.name) return set(state => modalValue ? ({...state, [modal]: {...modalValue, active: true}}) : state)
            return getApp(get, app).then(
                ({repo, repos}) => set(state => ({...state, repo: {...repo, name: app}, repos, [modal]: {...modalValue, active: true}, commitSelectModal: {active: modal === "commitSelectModal", data: repo.head}}))
            )
        }
        return set(state => ({...state, [modal]: {active: false, data: {...modalValue?.data, ...app,  [get().repo.name]: app}}}))
}

export const useStore = create<IStore>((set, get) => ({
    repos: [],
    repo: {name: "",branches: [], commits: [], head: {Hash:[] as number[]} as Commit} as Repo,
    setApp: async (app, init) => {
        if (app === "reload") app = get().repo.name
        const {repos, repo, autoUpdateModal} = await getApp(get, app, init)
        set(state => ({...state, autoUpdateModal, repos, repo: {...repo, name: init ? repos[0] : app}, commitSelectModal: {active: !!get().commitSelectModal?.active, data: repo.head}}))
    },
    modal: null,
    setModal: (modal) => set(state => ({...state, modal})),
    reload: 0,
    setReload: () => set(state => ({...state, reload: state.reload + 1})),
    commitSelectModal: null,
    setCommitSelectModal: (app) => handleModal(set, get, app, 'commitSelectModal'),
    autoUpdateModal: {active: false, data: {}},
    setAutoUpdateModal: (app) => handleModal(set, get, app, 'autoUpdateModal'),
    setLogModal: (log) => set(state => ({...state, logModal: log})),
    logModal: null,
}));
