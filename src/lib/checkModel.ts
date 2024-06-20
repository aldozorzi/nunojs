import { getModelsList } from '../listmodels.js';

export async function checkModel(model:string){
    const modelsList = await getModelsList();
    return modelsList.includes(model);
}