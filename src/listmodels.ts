import OpenAI from "openai";
import Configstore from 'configstore';
import fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const config = new Configstore(packageJson.name);

export async function getModels() {
  
  const openai = new OpenAI({
    apiKey: config.get('openAiKey'),
  });
  const list = await openai.models.list();
  for await (const model of list) {
    if(model.id.indexOf('gpt') > -1)
      console.log(model.id);
  }
}