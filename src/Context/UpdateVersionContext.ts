export type Tags = {
    commit: {
        Name: string
        Message: string
        Target: string
        Committer: {
            Name: string
            Email: string
            When: string
        }
    }
    new_reference: string
}[]
export const initUpdateVersionState = {
    currentVersion: "",
    versions: <Tags>[],
    targetVersion: "",
    app: ""
}
