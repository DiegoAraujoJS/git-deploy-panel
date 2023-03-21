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
    current_version: string
    name: string
    head: Commit
}

export type Apps = 'test'

export const initUpdateVersionState = {
    repos: <string[]> {},
    repo: <Repo> {},
    setApp: <React.Dispatch<React.SetStateAction<{
        repos: string[];
        repo: Repo;
    }>>>(() => {})
}

export const AppContext = createContext(initUpdateVersionState)
