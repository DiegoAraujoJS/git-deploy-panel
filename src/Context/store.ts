import axios from '../utils/client';
import {create} from 'zustand';
import { url } from '../utils/constants';

interface Commit {
    Hash: number[]
    Message: string
    Committer: {
        Name: string
        Email: string
        When: string
    }
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

interface Store {
    autoUpdateModal: string | null
    commitSelectModal: Commit | null
    logModal: string | null
    versionChangeModal: VersionChangeEvent | null;
    handleModal: typeof handleModal
    reload: number;
    repo: Repo;
    repos: string[];
    setApp: (app?: string, defaultCommit?: boolean) => Promise<void>;
    setReload: () => void;
    refetch: () => void;
    autoUpdateStatus: {[k: string]: AutoUpdateStatus};
}

declare function handleModal (modal: 'autoUpdateModal', payload: Store['autoUpdateModal'], app: string): void
declare function handleModal (modal: 'commitSelectModal', payload: Store['commitSelectModal'], app: string | undefined): void
declare function handleModal (modal: 'versionChangeModal', payload: Store['versionChangeModal'], app: string): void
declare function handleModal (modal: 'logModal', payload: Store['logModal']): void
declare function handleModal (modal: 'autoUpdateModal' | 'commitSelectModal' | 'logModal' | 'versionChangeModal', payload: 'close'): void

const reduceTimers = (acc: {[k: string]: AutoUpdateStatus}, curr: AutoUpdateStatus) => ({...acc, [curr.Repo]: curr})

async function getApp (app?: string, repos?: string[]) {
    let reps: string[] = repos ?? await axios.get<string[]>(`${url}/getRepos`).then(res => res.data)
    const {data} = await axios.get<{head: Commit, branches: string[]}>(`${url}/getTags?repo=${!repos ? reps[0] : app}`)
    return {
        repo: data,
        repos: !repos ? reps : repos,
    }
}

export const useStore = create<Store>((set, get) => ({
    repos: [],
    repo: {name: "",branches: [], commits: [], head: {Hash:[] as number[]} as Commit} as Repo,
    setApp: async (app, defaultCommit) => {
        // In the first "if" branch, we handle app initialization.
        if (!app) {
            // We fetch all repos and set the first one as the default.
            const {repos, repo} = await getApp()
            // We fetch all timers.
            const timers = ((await axios.get<AutoUpdateStatus[]>(`${url}/getTimers`)).data || []).reduce(reduceTimers, {})
            // We set the state and default the target commit to the last commit of the default repo.
            set(state => ({...state, repos, repo: {...repo, name: repos[0]}, autoUpdateStatus: timers, commitSelectModal: repo.head}))
            return
        }
        const {repo} = await getApp(app, get().repos)
        set(state => ({...state, repo: {...repo, name: app}, ...(!defaultCommit ? {commitSelectModal: repo.head} : {})}))
    },
    modal: null,
    reload: 0,
    setReload: () => set(state => ({...state, reload: state.reload + 1})),
    commitSelectModal: null,
    autoUpdateModal: null,
    versionChangeModal: null,
    logModal: null,
    handleModal: (modal, payload, app?: string) => {
        if (payload === "close") return set(state => ({...state, [modal]: null}))
        if (app) get().setApp(app, modal === "commitSelectModal") // app parameter is required for autoUpdateModal and commitSelectModal. The point is to bring the data of the selected app to the modal.
        set(state => ({...state, [modal]: payload}))
    },
    refetch: () => getApp(get().repo.name, get().repos).then(({repo}) => set(state => ({...state, repo: {...repo, name: get().repo.name}}))),
    autoUpdateStatus: {},
}));
