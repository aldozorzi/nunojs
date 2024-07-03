import OpenAI from "openai";
import Configstore from 'configstore';
import fs from 'fs';
import fetch from 'node-fetch';
import { Format } from "./lib/format.js";
import { Cache } from 'file-system-cache';




const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const config = new Configstore(packageJson.name);
let showWarning = true;
const cache = new Cache({
  ttl: 3600
});

function writeWarning(text:string){
  if(!showWarning) return;
  Format.warning('Retrieving models from OpenAI failed');
}

async function getOpenAIModelsData(): Promise<string[]> {
  if (!config.has('openAiKey') || config.get('openAiKey') == '') {
    return [];
  }
  if (!await cache.get('openAIModels')) {
    try {
      const openai = new OpenAI({
        apiKey: config.get('openAiKey'),
      });
      const list = await openai.models.list();
      let result = [];
      for await (const model of list) {
        if (model.id.indexOf('gpt') > -1)
          result.push(model.id);
      }
      await cache.set('openAIModels',result);
    } catch (e: any) {
      writeWarning('Retrieving models from OpenAI failed');
      return [];
    }
  }
  return await cache.get('openAIModels');
}

async function getGoogleModelsData(): Promise<string[]> {
  if (!config.has('googleKey') || config.get('googleKey') == '') {
    return [];
  }
  if (!await cache.get('googleModels')) {
    try {
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
      await cache.set('googleModels',result);
    } catch (e: any) {
      writeWarning('Retrieving models from Google failed');
      return [];
    }
  }
  return await cache.get('googleModels');
}

async function getOllamaModelsData(): Promise<string[]> {
  if (!config.has('ollamaServer') || config.get('ollamaServer') == '') {
    return [];
  }

  if (! await cache.get('ollamaModels')) {
    try {
      const response = await fetch(`${config.get('ollamaServer')}/api/tags`);
      if (!response.ok) {
        const data = await response.json();
        const message = `Error ${response.status} - ${data.error.message}`;
        throw new Error(message);
      }

      const data = await response.json();

      let result = [];
      for (let key in data.models) {
        const model = data.models[key];
        result.push(model.name);
      }
      await cache.set('ollamaModels',result);
    } catch (e: any) {
      writeWarning('Retrieving models from Ollama failed');
      return [];
    }
  }
  return await cache.get('ollamaModels');
}

async function getModelsData(): Promise<string[]> {
  const openAIdata = await getOpenAIModelsData();
  const googleData = await getGoogleModelsData();
  const ollamaData = await getOllamaModelsData();
  return [...openAIdata, ...googleData, ...ollamaData];

}

export async function getModelsList() {
  try {
    showWarning = false;
    const list = await getModelsData();
    return list;
  }
  catch (e: any) {
    Format.error(e.toString());
  }
}

export async function getModels() {
  try {
    showWarning = true;
    const list = await getModelsData();
    if (list.length == 0) {
      Format.warning('No models found, please set at least an API key using nunojs --setup');
    }
    else {
      process.stdout.write(list.join('\r\n'));
    }

  }
  catch (e: any) {
    Format.error(e.toString());
  }
}