import axios from "./client";
import { url } from "./constants";

export const checkout = (repo_name: string, hash: string) => axios.get<string>(`${url}/checkout?repo=${repo_name}&commit=${hash}`)
