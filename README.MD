
# NunoJS

NunoJS was born from an idea by [Daniel Miessler](https://danielmiessler.com), who developed [Fabric](https://github.com/danielmiessler/fabric). I desperately wanted to use it, but it didn't work on my Linux Alpine OS. So i decided to reproduce the most important features (important to me, of course :D) in Nodejs so that I could use on my laptop.

## Installation

```bash

git  clone  https://github.com/aldozorzi/nunojs

npm  install -g nunojs

npm link

```

## Usage

To start using NunoJS, simply launch

` nunojs --setup `

and complete api key setup.

Then you would like to lauch something like 

` nunojs --default_model gpt-3.5-turbo `

to set a default model for your calls. Use 

` nunojs --list_models `

to get a list of all available models.

Then you can launch something like

` nunojs --pattern 'pattern_name' --text 'Science is going to be revolutionized by AI assistants.'`

or

` nunojs -p 'pattern_name' -t 'Science is going to be revolutionized by AI assistants.'`

All patterns are available as sub-command too, so

` nunojs pattern_name 'Science is going to be revolutionized by AI assistants.' `

is equal to

` nunojs --pattern 'pattern_name' --text 'Science is going to be revolutionized by AI assistants.' `

Available patterns are listed with

` nunojs --list `

and you can add your own patterns to the folder `custom_patterns`. Look at read file in the folder to get an idea, or read next chapter.

NunoJS accept piped text as input (and returns "pipable" text as output), so you can use something like

` 'Science is going to be revolutionized by AI assistants.' | nunojs pattern_name `

To print help:

` nunojs --help`

or

` nunojs `

## Custom Patterns

Place your custom patterns in "custom_patterns" folder. Create a subfolder named as your pattern and inside it put a file named "system.md". See pattern "official_pattern_template" in "pattern" folder as a reference.

- custom_patterns
	- pattern_1
		- system.md
	- pattern_2
		- system.md