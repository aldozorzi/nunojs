
# NunoJS

NunoJS was born from an idea by [Daniel Miessler](https://danielmiessler.com), who developed [Fabric](https://github.com/danielmiessler/fabric). I desperately wanted to use it, but it didn't work on my Linux Alpine OS. Furthermore, my projects are primarily written in Javascript/TypeScript, not Python, making a JS version more convenient for me.  Therefore, I decided to recreate the most important features (important to me, of course!) in Node.js so I could use it on my laptop and in my projects.

## Installation

```bash
git  clone  https://github.com/aldozorzi/nunojs
cd nunojs
npm  install
npm link
```

## Usage

To start using NunoJS, simply launch

` nunojs --setup `

and complete api key setup.

Then, you may want to launch:

` nunojs --list_models `

to get a list of all available models, based on the API keys you set during --setup.

Then you can set a default model for your calls, using:

` nunojs --default_model gpt-3.5-turbo `

You can then launch commands like:

` nunojs --pattern 'pattern_name' --text 'Science is going to be revolutionized by AI assistants.'`

or

` nunojs -p 'pattern_name' -t 'Science is going to be revolutionized by AI assistants.'`

All patterns are available as sub-commands too, so

` nunojs pattern_name 'Science is going to be revolutionized by AI assistants.' `

is equivalent to:

` nunojs --pattern 'pattern_name' --text 'Science is going to be revolutionized by AI assistants.' `

Available patterns are listed with

` nunojs --list `

You can add your own patterns to the `custom_patterns` folder. Refer to the README file in the folder for guidance, or read the next chapter.

NunoJS accepts piped text as input (and returns "pipable" text as output), so you can use something like:

` 'Science is going to be revolutionized by AI assistants.' | nunojs pattern_name `

or, more likely, to process something in the clipboard:

```bash
pbpaste | nunojs pattern_name # MacOS
xsel --output --clipboard | nunojs pattern_name #Linux
get-clipboard | nunojs pattern_name #Powershell on Windows

```

To print help:

` nunojs --help`

or

` nunojs `

## Custom Patterns

Place your custom patterns in the "custom_patterns" folder. Create a subfolder named after your pattern and put a file named "system.md" inside it. See the "official_pattern_template" pattern in the "pattern" folder as a reference.

- custom_patterns
	- pattern_1
		- system.md
		- user.md (optional, if you don't want to use --text param)
	- pattern_2
		- system.md
		- user.md (optional, if you don't want to use --text param)

## All params:
| Option                                           | Description                                                                                                                            |
|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| -V, --version                                     | output the version number                                                                                                              |
| -p, --pattern <pattern-name>                      | Set the pattern (prompt) to use                                                                                                        |
| -t, --text <text>                                 | Text to analyze                                                                                                                        |
| -o, --output <filepath/to/filename.md>            | Save the result to a file                                                                                                              |
| -s, --stream                                      | Use this option if you want to see the results in realtime. NOTE: you can't pipe the output into another command, or use with --output |
| -l, --list                                        | List available patterns                                                                                                                |
| --temp <temperature>                              | Set the temperature for the model. Default is 0                                                                                        |
| --top_p <top_p>                                   | Set the top_p for the model. Default is 1                                                                                              |
| --frequency_penalty <frequency_penalty >          | sets the presence penalty for the model. Default is 0.1                                                                                |
| -u, --update                                      | Update patterns (git > 2.24 required)                                                                                                  |
| --setup                                           | Set up your NunoJS instance                                                                                                            |
| --view_config                                     | View your instance config                                                                                                              |
| --reset                                           | Delete your instance config                                                                                                            |
| --list_models                                     | List all available models                                                                                                              |
| -m, --model <model>                               | Set the model to use                                                                                                                   |
| --default_model <model>                           | Set the default model to use                                                                                                           |
| --ollama_server [server]                          | Set The URL of the remote ollamaserver to use.                                                                                         |
| --debug                                           | Set debug mode                                                                                                                         |
| -h, --help                                        | display help for command                                                                                                               |


## YouTube utility:
There is a YouTube utility which grabs videos transcript and use it as content to pipe into nunojs. It uses a non official API, so results are not guaranteed.
Usage:

`yt https://www.youtube.com/watch?v=wPEyyigh10g | nunojs extract_wisdom --output ./outputs/video_transcript.md` #or any pattern you want