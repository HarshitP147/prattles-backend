import { v4 } from "uuid";

export default function generateId(idType) {
    let id = v4()
    id = id.split('-').join('');

    return `${idType}-${id}`
}