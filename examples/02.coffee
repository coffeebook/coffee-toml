#!/usr/bin/env coffee

# Demonstrate how easy compilation/translation is:

{TOML} = require "../coffeescript/toml.coffee"
CSON = require "../node_modules/cson/out/lib/cson.js"

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

json = TOML.parse toml

cson = CSON.stringifySync json

console.log """
----
TOML
----
#{toml}

----
JSON
----
#{JSON.stringify(json, undefined, 2)}

----
CSON
----
#{cson}


"""

