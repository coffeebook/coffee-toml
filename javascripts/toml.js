// Generated by CoffeeScript 1.3.3
(function() {
  var ArrayParser, BooleanParser, DateParser, ESCAPE_CHARS, KeyGroupParser, KeyParser, NumberParser, Parser, PrimitiveParser, StringParser, TOKENS, TOML, ValueParser,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TOKENS = {
    key: /^([^=]+?)\s*=/,
    keyGroup: /^(\s)*\[([^\]]+)\]/,
    whiteSpace: /^\s+/,
    string: /^([^\"]+)"/,
    number: /^(-?\d+(?:\.\d+)?)/,
    boolean: /^(true|false)/,
    date: /^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ)/,
    arraySeparator: /^[\s\n]*,[\s\n]*/,
    arrayTerminator: /^[\s\n]*\]/,
    comment: /^\s*#[^\n]*/
  };

  ESCAPE_CHARS = {
    "0": "\0",
    "t": "\t",
    "n": "\n",
    "r": "\r",
    "\"": "\"",
    "\\": "\\"
  };

  Parser = (function() {

    function Parser(chunk, result, currentKey) {
      this.chunk = chunk;
      this.result = result != null ? result : {};
      this.currentKey = currentKey != null ? currentKey : null;
    }

    Parser.prototype.parse = function() {
      while (this.chunk) {
        this.skipNonTokens();
        if (TOKENS.keyGroup.test(this.chunk)) {
          return new KeyGroupParser(this.chunk, this.result, null);
        } else if (TOKENS.key.test(this.chunk)) {
          return new KeyParser(this.chunk, this.result, null);
        } else if (this.chunk) {
          throw "Error parsing string: " + this.chunk;
        }
      }
      return this;
    };

    Parser.prototype.skipNonTokens = function() {
      var _results;
      _results = [];
      while (this.chunk && this.chunk.substr(0, 1).match(/(\s|\n|#)/)) {
        _results.push(this.skipWhiteSpace() || this.skipNewline() || this.skipComment());
      }
      return _results;
    };

    Parser.prototype.skipWhiteSpace = function() {
      var match;
      if (match = this.chunk.match(TOKENS.whiteSpace)) {
        return this.discard(match);
      }
    };

    Parser.prototype.skipNewline = function() {
      if (this.chunk.substr(0, 1).match(/\n/)) {
        return this.chunk = this.chunk.substr(1);
      }
    };

    Parser.prototype.skipComment = function() {
      var match;
      if (match = this.chunk.match(TOKENS.comment)) {
        return this.discard(match);
      }
    };

    Parser.prototype.newParser = function() {
      return new Parser(this.chunk, this.result);
    };

    Parser.prototype.discard = function(match) {
      return this.chunk = this.chunk.substr(match[0].length);
    };

    return Parser;

  })();

  KeyGroupParser = (function(_super) {

    __extends(KeyGroupParser, _super);

    function KeyGroupParser() {
      return KeyGroupParser.__super__.constructor.apply(this, arguments);
    }

    KeyGroupParser.prototype.parse = function() {
      var groupChunk, match, nestedParser, nextGroupIndex;
      if (match = this.chunk.match(TOKENS.keyGroup)) {
        this.discard(match);
        this.skipNewline();
        this.result[match[2]] = {};
        nextGroupIndex = this.chunk.indexOf("\n" + (match[1] || '') + "[");
        groupChunk = nextGroupIndex === -1 ? this.chunk : this.chunk.substr(0, nextGroupIndex);
        nestedParser = new Parser(groupChunk, this.result[match[2]]);
        while (nestedParser.chunk) {
          nestedParser = nestedParser.parse();
        }
        this.chunk = this.chunk.substr(groupChunk.length);
        return new Parser(this.chunk, this.result);
      } else {
        throw "Bad keygroup at " + this.chunk;
      }
    };

    return KeyGroupParser;

  })(Parser);

  KeyParser = (function(_super) {

    __extends(KeyParser, _super);

    function KeyParser() {
      return KeyParser.__super__.constructor.apply(this, arguments);
    }

    KeyParser.prototype.parse = function() {
      var match;
      if (this.chunk.substr(0, 1).match(/\S/) && (match = this.chunk.match(TOKENS.key))) {
        this.discard(match);
        return new ValueParser(this.chunk, this.result, match[1]);
      } else {
        this.chunk = "";
      }
      return this;
    };

    return KeyParser;

  })(Parser);

  ValueParser = (function(_super) {

    __extends(ValueParser, _super);

    function ValueParser() {
      return ValueParser.__super__.constructor.apply(this, arguments);
    }

    ValueParser.prototype.parse = function() {
      this.skipWhiteSpace();
      if (this.chunk.substr(0, 1) === '"') {
        return new StringParser(this.chunk.substr(1), this.result, this.currentKey).parse();
      } else if (this.chunk.substr(0, 1) === '[') {
        return new ArrayParser(this.chunk.substr(1), this.result, this.currentKey).parse();
      } else if (TOKENS.date.test(this.chunk)) {
        return new DateParser(this.chunk, this.result, this.currentKey).parse();
      } else if (TOKENS.number.test(this.chunk)) {
        return new NumberParser(this.chunk, this.result, this.currentKey).parse();
      } else if (TOKENS.boolean.test(this.chunk)) {
        return new BooleanParser(this.chunk, this.result, this.currentKey).parse();
      } else {
        throw "Bad value at " + this.chunk;
      }
      return this;
    };

    return ValueParser;

  })(Parser);

  ArrayParser = (function(_super) {

    __extends(ArrayParser, _super);

    function ArrayParser() {
      return ArrayParser.__super__.constructor.apply(this, arguments);
    }

    ArrayParser.prototype.parse = function() {
      var match, parser;
      this.result[this.currentKey] = [];
      this.skipNonTokens();
      while (this.chunk) {
        console.log("Parsing array chunk %s", this.chunk);
        parser = new ValueParser(this.chunk, {}, 'value');
        parser = parser.parse();
        this.result[this.currentKey].push(parser.result.value);
        this.chunk = parser.chunk;
        this.skipNonTokens();
        if (match = this.chunk.match(TOKENS.arraySeparator)) {
          this.discard(match);
          this.skipNonTokens();
        }
        if (match = this.chunk.match(TOKENS.arrayTerminator)) {
          this.discard(match);
          return this.newParser();
        }
      }
      return this;
    };

    return ArrayParser;

  })(Parser);

  PrimitiveParser = (function(_super) {

    __extends(PrimitiveParser, _super);

    function PrimitiveParser() {
      return PrimitiveParser.__super__.constructor.apply(this, arguments);
    }

    PrimitiveParser.prototype.parse = function() {
      var match;
      if (match = this.chunk.match(this.regexp)) {
        this.result[this.currentKey] = this.cast(match[1]);
        this.discard(match);
      } else {
        throw "Bad value " + this.chunk;
      }
      return this.newParser();
    };

    PrimitiveParser.prototype.cast = function(val) {
      return val;
    };

    return PrimitiveParser;

  })(Parser);

  StringParser = (function(_super) {

    __extends(StringParser, _super);

    function StringParser() {
      return StringParser.__super__.constructor.apply(this, arguments);
    }

    StringParser.prototype.parse = function() {
      var char, next, nextQuote, nextSlash, string;
      this.result[this.currentKey] = '';
      string = [];
      while (this.chunk.length) {
        if (this.chunk.substr(0, 1) === '"') {
          this.chunk = this.chunk.substr(1);
          this.result[this.currentKey] = string.join('');
          return this.newParser();
        }
        if (this.chunk.substr(0, 1) === '\\') {
          char = ESCAPE_CHARS[this.chunk.substr(1, 1)];
          string.push(char ? char : "\\" + (this.chunk.substr(1, 1)));
          this.chunk = this.chunk.substr(2);
        }
        nextSlash = this.chunk.indexOf('\\');
        nextQuote = this.chunk.indexOf('"');
        next = nextSlash === -1 ? nextQuote : Math.min(nextSlash, nextQuote);
        if (nextQuote === -1) {
          throw "Unterminated string literal: " + this.chunk;
        }
        string.push(this.chunk.substr(0, next));
        this.chunk = this.chunk.substr(next);
      }
      return this;
    };

    return StringParser;

  })(Parser);

  DateParser = (function(_super) {

    __extends(DateParser, _super);

    function DateParser() {
      return DateParser.__super__.constructor.apply(this, arguments);
    }

    DateParser.prototype.regexp = TOKENS.date;

    DateParser.prototype.cast = function(val) {
      return new Date(Date.parse(val));
    };

    return DateParser;

  })(PrimitiveParser);

  NumberParser = (function(_super) {

    __extends(NumberParser, _super);

    function NumberParser() {
      return NumberParser.__super__.constructor.apply(this, arguments);
    }

    NumberParser.prototype.regexp = TOKENS.number;

    NumberParser.prototype.cast = parseFloat;

    return NumberParser;

  })(PrimitiveParser);

  BooleanParser = (function(_super) {

    __extends(BooleanParser, _super);

    function BooleanParser() {
      return BooleanParser.__super__.constructor.apply(this, arguments);
    }

    BooleanParser.prototype.regexp = TOKENS.boolean;

    BooleanParser.prototype.cast = function(val) {
      return val === "true";
    };

    return BooleanParser;

  })(PrimitiveParser);

  TOML = {
    parse: function(string) {
      var parser;
      parser = new Parser(string);
      while (parser.chunk) {
        parser = parser.parse();
      }
      return parser.result;
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    window.TOML = TOML;
  } else {
    exports.TOML = TOML;
  }

}).call(this);
