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
    autoUpdateModal: AutoUpdateStatus | null
    commitSelectModal: Commit | null
    logModal: string | null
    versionChangeModal: VersionChangeEvent | null;
    handleModal: typeof handleModal
    reload: number;
    repo: Repo;
    repos: string[];
    setApp: (app?: string) => void;
    setReload: () => void;
    refetch: () => void;
    autoUpdateStatus: {[k: string]: AutoUpdateStatus};
}

declare function handleModal (modal: 'autoUpdateModal', payload: Store['autoUpdateModal']): void
declare function handleModal (modal: 'commitSelectModal', payload: Store['commitSelectModal']): void
declare function handleModal (modal: 'logModal', payload: Store['logModal']): void
declare function handleModal (modal: 'versionChangeModal', payload: Store['versionChangeModal']): void
declare function handleModal (modal: 'autoUpdateModal' | 'commitSelectModal' | 'logModal' | 'versionChangeModal', payload: 'close'): void

const reduceTimers = (acc: {[k: string]: AutoUpdateStatus}, curr: AutoUpdateStatus) => ({...acc, [curr.Repo]: curr})

async function getApp (): Promise<any>
async function getApp (app: string, repos: string[]): Promise<any>
async function getApp (app?: string, repos?: string[]): Promise<any> {
    let reps: string[] = []
    if (!repos) {
        reps = await axios.get<string[]>(`${url}/getRepos`).then(res => res.data)
    }
    const {data} = await axios.get<Repo>(`${url}/getTags?repo=${!repos ? reps[0] : app}`)
    return {
        repo: data,
        repos,
    }
}

export const useStore = create<Store>((set, get) => ({
    repos: [],
    repo: {name: "",branches: [], commits: [], head: {Hash:[] as number[]} as Commit} as Repo,
    setApp: async (app) => {
        // First if branch, we handle app initialization.
        if (!app) {
            const {repos, repo} = await getApp()
            const timers = ((await axios.get<AutoUpdateStatus[]>(`${url}/getTimers`)).data || []).reduce(reduceTimers, {})
            return set(state => ({...state, repos, repo, autoUpdateStatus: timers}))
        }
        const {repos, repo} = await getApp(app, get().repos)
        set(state => ({...state, repos, repo}))
    },
    modal: null,
    reload: 0,
    setReload: () => set(state => ({...state, reload: state.reload + 1})),
    commitSelectModal: null,
    autoUpdateModal: null,
    versionChangeModal: null,
    logModal: null,
    handleModal: (modal, payload) => {
        if (payload === "close") return set(state => ({...state, [modal]: null}))
        set(state => ({...state, [modal]: payload}))
    },
    refetch: () => getApp(get().repo.name, get().repos).then(({repo}) => set(state => ({...state, repo}))),
    autoUpdateStatus: {},
}));
