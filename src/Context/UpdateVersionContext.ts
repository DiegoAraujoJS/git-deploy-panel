import { createContext } from "react"

export type Tags = {
    tags: {
        commit: {
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
        new_reference: string
    }[]
    current_version: string
    name: string
}

export type Apps = 'test'

export const initUpdateVersionState = {
    repos: <string[]> {},
    repo: <Tags> {},
    setApp: <React.Dispatch<React.SetStateAction<Omit<{
        repos?: string[];
        repo?: Tags;
        app?: string;
        setApp: any;
    }, "setApp">>>>(() => {})
}

export const AppContext = createContext(initUpdateVersionState)
