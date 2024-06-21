import OpenAI from "openai";
import Configstore from 'configstore';
import fs from 'fs';


const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);

async function getModelsData() {
  const openai = new OpenAI({
    apiKey: config.get('openAiKey'),
  });
  const list = await openai.models.list();
  return list;
}

export async function getModelsList(){
  let result = [];
  const list = await getModelsData();
  for await (const model of list) {
    if (model.id.indexOf('gpt') > -1)
      result.push(model.id);
  }
  return result;
}

export async function getModels() {
  const list = await getModelsData();
  for await (const model of list) {
    if (model.id.indexOf('gpt') > -1)
      process.stdout.write(`${model.id}\n`);
  }
}