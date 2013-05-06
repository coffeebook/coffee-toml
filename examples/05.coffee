#!/usr/bin/env coffee

# DasFormat

# A overview of human-readable data serialization formats

# Demonstrate how easy compilation/translation is:

{TOML} = require "../coffeescript/toml.coffee"
CSON = require "../node_modules/cson/out/lib/cson.js"
YAML = require "../node_modules/js-yaml"
CSV = require '../node_modules/json2csv/lib/json2csv'
# Take some TOML as input
toml = """
[evironment]
name = "Awesomo!"
bite = 1

[workflow]
machine = "nehalem"
    architecture = "x86_64"
brand = "Acer"
    model = "M7811"


[stack]
language = "coffeescript"
extensions = [ "litcoffee",
               "coffee",
               "coffee.md"

[super]
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

logt = (v) -> console.log "\n**Type of #{v} is #{typeof v} **\n"
logt toml

# Get JSON object from TOML parser
json = TOML.parse toml
logt json

# Some use objects, others take strings
jstr = JSON.stringify json, undefined, 2
logt jstr

# Create CSON string from JSON object
cson = CSON.stringifySync json
logt cson

# Create YAML from JSON object
yaml = YAML.load jstr
logt yaml

# Create CSV from JSON
#csv = CSV json, (err, result) -> result



#csv = CSV data: JSON.parse(json), fields: ['super', 'stack'], (err, tsv) -> tsv


# Output the whole lot
console.log """
--------------------------
TOML (custom JS/CS parser)
<https://github.com/biilmann/coffee-toml>
--------------------------

#{toml}

-----------------------
JSON
<https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify>
-----------------------
#{jstr}

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

