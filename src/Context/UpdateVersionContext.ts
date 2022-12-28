import { createContext } from "react"

export const initUpdateVersionState = {
    currentVersion: "",
    targetVersion: "",
    app: ""
}

export type UpdateVersionAction = {
    valueToUpdate: keyof typeof initUpdateVersionState
    payload: {
        value: string
        app: string
    }
}

export type UpdateVersionContext = typeof initUpdateVersionState & {
    dispatch: (value: UpdateVersionAction) => void
}

export const UpdateVersionContext = createContext<UpdateVersionContext>({
    ...initUpdateVersionState,
    dispatch: () => { }
})

export const reducer = (state: typeof initUpdateVersionState, action: UpdateVersionAction): typeof initUpdateVersionState => {
    if (state.app === action.payload.app) return initUpdateVersionState
    return {
        ...state,
        app: action.payload.app,
        [action.valueToUpdate]: action.payload.value
    }
}
