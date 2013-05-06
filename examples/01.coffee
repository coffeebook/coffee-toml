#!/usr/bin/env coffee

# Why? Because we need a decent human-readable format that maps to a hash and
# the YAML spec is like 80 pages long and gives me rage. No, JSON doesn't
# count. You know why
#
# Imho? software is for humans, not the other way around.

{TOML} = require "../coffeescript/toml.coffee"

console.log TOML.parse """
[workflow.stack]
machine = "nehalem"
architecture = "x86_64"

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

