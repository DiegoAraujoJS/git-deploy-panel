export type Tags = {
        Name: string
        Message: string
        Target: string
        Tagger: {
            Name: string
            Email: string
            When: string
        }
    }[]
export const initUpdateVersionState = {
    currentVersion: "",
    versions: <Tags>[],
    targetVersion: "",
    app: ""
}
