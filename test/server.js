(function() {
  var AwsS3Form, CONFIG, FormGen, _config, _defaults, _pick, app, express, path, redirectUrlTemplate, server, utils;

  path = require("path");

  _config = require("../config_test.json");

  _defaults = require("lodash/defaults");

  _pick = require("lodash/pick");

  CONFIG = _defaults(_config.example || {}, {
    port: 3010
  });

  express = require('express');

  app = express();

  app.set('view engine', 'jade');

  app.set('views', path.resolve(__dirname + '/../_testviews'));

  AwsS3Form = require("../.");

  utils = require("../lib/utils");

  _config.s3.keyPrefix = "test_browser_";

  redirectUrlTemplate = function(data) {
    var _str;
    _str = "http://" + (server.address().host || "localhost") + ":" + (server.address().port || 80) + "/redir/";
    if (data.filename === "${filename}") {
      _str += "*";
    } else {
      _str += _config.s3.keyPrefix + data.filename;
    }
    return _str;
  };

  FormGen = new AwsS3Form(_config.s3);

  app.get('/', function(req, res) {
    var _contenttype, _key, _opts, _statuscode;
    _key = req.query.key;
    _statuscode = req.query.statuscode;
    _contenttype = req.query.contenttype;
    console.log(_config.s3.keyPrefix, _key);
    if (_key == null) {
      _key = utils.randomString(10);
    }
    _opts = _pick(req.query, ["acl"]);
    if (_statuscode) {
      _opts.successActionStatus = _statuscode;
    } else {
      _opts.redirectUrlTemplate = redirectUrlTemplate;
    }
    if (_contenttype != null ? _contenttype.length : void 0) {
      _opts.contentType = _contenttype;
    }
    res.render("index", {
      q: req.query,
      example: FormGen.create(_key, _opts)
    });
  });

  app.get('/redir/:key', function(req, res) {
    var _data, _url;
    _url = "https://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + req.query.key;
    _data = {
      q: req.query,
      src: _url
    };
    res.render("img", _data);
  });

  server = app.listen(process.env.PORT || CONFIG.port, function() {
    console.log('Now call http://%s:%s/ in your browser', this.address().host || "localhost", this.address().port);
  });

}).call(this);
