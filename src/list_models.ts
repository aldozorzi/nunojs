import OpenAI from "openai";
import Configstore from 'configstore';
import fs from 'fs';
import fetch from 'node-fetch';
import { Format } from "./lib/format.js";



const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);

async function getOpenAIModelsData() :Promise<string[]>{
  if(!config.has('openAiKey') || config.get('openAiKey') == '')
    {
      return [];
    }
  const openai = new OpenAI({
    apiKey: config.get('openAiKey'),
  });
  const list = await openai.models.list();
  let result = [];
  for await (const model of list) {
    if (model.id.indexOf('gpt') > -1)
      result.push(model.id);
  }
  return result;
}

async function getGoogleModelsData() :Promise<string[]>{
  if(!config.has('googleKey') || config.get('googleKey') == '')
    {
      return [];
    }
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models', { headers: { 'x-goog-api-key': config.get('googleKey') } });
  if (!response.ok) {
    const data = await response.json();
    const message = `Error ${response.status} - ${data.error.message}`;
    throw new Error(message);
  }

  const data = await response.json();
  let result = [];
  for (let key in data.models) {
    const model = data.models[key];
    if (model.name.indexOf('gemini') > -1)
      result.push(model.name.replace('models/', ''));
  }
  return result;
}

async function getModelsData() : Promise<string[]>{
  const openAIdata = await getOpenAIModelsData();
  const googleData = await getGoogleModelsData();
  return [...openAIdata,...googleData];

}

export async function getModelsList() {
  try {
    const list = await getModelsData();
    return list;
  }
  catch (e: any) {
    Format.error(e.toString());
  }
}

export async function getModels() {
  try {
    const list = await getModelsData();
    if(list.length == 0)
      {
        Format.warning('No models found, please set at least an API key using nunojs --setup');
      }
      else{
        process.stdout.write(list.join('\r\n'));
      }
    
  }
  catch (e: any) {
    Format.error(e.toString());
  }
}