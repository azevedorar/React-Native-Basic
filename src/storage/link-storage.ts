//** chave: valor*/
//** name: "Lucas" */


//**link: [{}, {}, {}] */


//**links: [{name: "Adidas",url: "123"}, {}, {} ] */


import AsyncStorage from "@react-native-async-storage/async-storage"
import { Try } from "expo-router/build/views/Try"

const LINKS_STORAGE_KEY = "links-storage"

type LinkStorage = {
    id: string
    name: string
    url: string
    category: string
}

async function get(): Promise <LinkStorage[]> {
    const storage = await AsyncStorage.getItem (LINKS_STORAGE_KEY)
    const response = storage ? JSON.parse(storage) : []
    return response
}

async function save(newLink: LinkStorage) {
    try {
        const storage = await get(  )
        const updated = JSON.stringify ([...storage, newLink])
        await AsyncStorage.setItem(LINKS_STORAGE_KEY, updated )


    } catch (error) {
        throw error
    }
}

export const linkStorage = {get, save}
