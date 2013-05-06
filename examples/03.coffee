#!/usr/bin/env coffee

# Demonstrate how easy compilation/translation is:

{TOML} = require "../coffeescript/toml.coffee"
CSON = require "../node_modules/cson/out/lib/cson.js"
YAML = require "../node_modules/js-yaml"
CSV = require '../node_modules/json2csv'
# Take some TOML as input
toml = """
[program]
name = "Awesomo!"
bite = 1

[workflow.stack]
machine = "nehalem"
    architecture = "x86_64"
brand = "Acer"
    model = "M7811"


[stack.selected]
language = "coffeescript"
extensions = [ "litcoffee",
               "coffee",
               "coffee.md"

[stack.super]
languages = ["visualbasic",
             "csharp",
             "ruby",
             "coffeescript",
             "javascript",
             "bash",
             "zsh",
             "stylus",
             "jade/html/haml",
             "markup,down,left,right",
             "python",
             "clojure"]

"""

# Get JSON object from TOML parser
json = TOML.parse toml

# Create CSON string from JSON object
cson = CSON.stringifySync json

# Create YAML from JSON object
yaml = YAML.load JSON.stringify(json)

# Output the whole lot
console.log """
--------------------------
TOML (custom JS/CS parser)
<https://github.com/biilmann/coffee-toml>
--------------------------

#{toml}

-----------------------
JSON (native JS parser)
<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify>
-----------------------
#{JSON.stringify(json, undefined, 2)}

--------------------
CSON (bervy package)
<https://github.com/bevry/cson>
--------------------
#{cson}


--------------------
YAML (npm package)
<https://github.com/nodeca/js-yaml/blob/master/README.md>
--------------------
#{YAML.dump yaml, 2}

"""

