import { createContext } from "react"

export const initUpdateVersionState = {
    currentVersion: "",
    targetVersion: "",
    app: ""
}

export type UpdateVersionAction = {
    valueToUpdate: keyof typeof initUpdateVersionState
    payload: string
} | {
    valueToUpdate: "set"
    payload: Omit<typeof initUpdateVersionState, "targetVersion">
}

export type UpdateVersionContext = typeof initUpdateVersionState & {
    dispatch: (value: UpdateVersionAction) => void
}

export const UpdateVersionContext = createContext<UpdateVersionContext>({
    ...initUpdateVersionState,
    dispatch: () => { }
})

export const reducer = (state: typeof initUpdateVersionState, action: UpdateVersionAction): typeof initUpdateVersionState => {
    if (action.valueToUpdate === "set") return {
        ...state,
        ...action.payload
    }
    return {
        ...state,
        [action.valueToUpdate]: action.payload
    }
}
