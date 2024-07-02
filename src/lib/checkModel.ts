import { getModelsList } from '../list_models.js';

export async function checkModel(model:string){
    const modelsList = await getModelsList();
    return modelsList && modelsList.includes(model);
}