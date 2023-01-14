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
}

export type Apps = 'test'

export const initUpdateVersionState = {
    repo: <Tags> {},
    app: <Apps> "test",
    setApp: <React.Dispatch<React.SetStateAction<Omit<{
        repo: Tags;
        app: "test";
        setApp: any;
    }, "setApp">>>>(() => {})
}

export const AppContext = createContext(initUpdateVersionState)
