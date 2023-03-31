import axios from "axios";
import { url } from "./constants";

export const checkout = (repo_name: string, hash: string) => axios.get(`${url}/checkout?repo=${repo_name}&commit=${hash}`)
    .then(() => location.reload())
