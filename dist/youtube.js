#! /usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { YoutubeTranscript } from 'youtube-transcript';
import { Command } from 'commander';
import { Format } from './lib/format.js';
import { YoutubeTranscriptNotAvailableLanguageError } from 'youtube-transcript';
export function getYTTranscript(video_id_1) {
    return __awaiter(this, arguments, void 0, function* (video_id, lang = 'en') {
        let transcriptsData;
        try {
            transcriptsData = yield YoutubeTranscript.fetchTranscript(video_id, { lang: lang });
        }
        catch (e) {
            if (e instanceof YoutubeTranscriptNotAvailableLanguageError) {
                try {
                    transcriptsData = yield YoutubeTranscript.fetchTranscript(video_id);
                }
                catch (ee) {
                    if (ee instanceof YoutubeTranscriptNotAvailableLanguageError) {
                        return Format.error(`In this video there is no trascripts for language: "${lang}", try to set a different language with -l param`);
                    }
                }
            }
            else {
                return Format.error(e.toString());
            }
        }
        if (transcriptsData) {
            let transcripts;
            transcripts = transcriptsData.map((item) => { return item.text; });
            process.stdout.write(transcripts.join());
        }
    });
}
// getYTTranscript('6ktrqFoy-e4');
const program = new Command();
let video_url;
program
    .version('1.0.0')
    .description('A simple tool to retrieve YOuTube transcriptions.');
program.option('-l, --language <language>', 'Set the desired transcription language. If omitted, script tries "en" and if not found it uses the first available transcript.', 'en');
program.argument('<video_url>', 'video url')
    .action((url) => {
    video_url = url;
});
const parsed = program.parse(process.argv);
const options = program.opts();
getYTTranscript(video_url, options.language);
//# sourceMappingURL=youtube.js.map