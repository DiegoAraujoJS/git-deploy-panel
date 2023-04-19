import { createContext } from "react"

export type Commit = {
    Name: string
    Message: string
    Target: string
    Committer: {
        Name: string
        Email: string
        When: string
    }
    Hash: string
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

export const initUpdateVersionState = {
    repos: <string[]> {},
    repo: <Repo> {},
    setApp: <React.Dispatch<React.SetStateAction<{
        repos: string[];
        repo: Repo;
    }>>>(() => {}),
    modal: <VersionChangeEvent | null> null,
    setModal: <React.Dispatch<React.SetStateAction<VersionChangeEvent | null>>>(() => {}),
    reload: <number> 0,
    setReload: <React.Dispatch<React.SetStateAction<number>>>(() => {}),
}

export const AppContext = createContext(initUpdateVersionState)
