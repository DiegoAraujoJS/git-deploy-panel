import { useState } from "react"

export const useForm = <T>(initial: T) => {
    const [form, setForm] = useState(initial) 

    const handleChange = (e: any) => setForm({...form, [e.target.name]: e.target.value})

    return {
        form,
        handleChange
    }
}
