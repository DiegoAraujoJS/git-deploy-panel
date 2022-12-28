import React, { createContext } from "react"

export const initUpdateVersionState = {
    currentVersion: "",
    targetVersion: "",
    app: ""
}

export type UpdateVersionAction<T extends keyof typeof initUpdateVersionState | "set"> = {
    valueToUpdate: T
    payload: T extends "set" ? {
        currentVersion: string
        app: string
    } : string
}

export type UpdateVersionContext = typeof initUpdateVersionState & {
    dispatch: <T extends keyof typeof initUpdateVersionState | "set">(value: UpdateVersionAction<T>) => void
}

export const UpdateVersionContext = createContext<UpdateVersionContext>({
    ...initUpdateVersionState,
    dispatch: () => { }
})
