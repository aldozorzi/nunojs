#! /usr/bin/env node

import { YoutubeTranscript } from 'youtube-transcript';
import { Command, OptionValues } from 'commander';
import { Format } from './lib/format.js';
import { YoutubeTranscriptNotAvailableLanguageError } from 'youtube-transcript';


export async function getYTTranscript(video_id: string, lang: string = 'en') {
    let transcriptsData;
    try {
        transcriptsData = await YoutubeTranscript.fetchTranscript(video_id, { lang: lang });
    } catch (e: any) {
        if (e instanceof YoutubeTranscriptNotAvailableLanguageError) {
            try {
                transcriptsData = await YoutubeTranscript.fetchTranscript(video_id);
            } catch (ee: any) {
                if (ee instanceof YoutubeTranscriptNotAvailableLanguageError) {
                    return Format.error(`In this video there is no trascripts for language: "${lang}", try to set a different language with -l param`);
                }
            }
        }
        else {
            return Format.error(e.toString());
        }

    }
    if(transcriptsData){
        let transcripts: string[];
        transcripts = transcriptsData.map((item) => { return item.text });
        process.stdout.write(transcripts.join());
    }
    
}

// getYTTranscript('6ktrqFoy-e4');
const program = new Command('yt');
let video_url: string;

program
    .version('1.0.0')
    .description('A simple tool to retrieve YOuTube transcriptions.');

program.option('-l, --language <language>', 'Set the desired transcription language. If omitted, script tries "en" and if not found it uses the first available transcript.', 'en')
program.argument('<video_url>', 'video url')
    .action((url) => {
        video_url = url
    });

const parsed = program.parse(process.argv);

const options: OptionValues = program.opts();
getYTTranscript(video_url, options.language);
