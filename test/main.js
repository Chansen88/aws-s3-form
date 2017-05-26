(function() {
  var Module, _config, _moduleInst, crypto, fs, initFileStreams, mime, mimes, path, redirPre, request, should, testfileMime, testfileName, testfileStreamA, testfileStreamB, testfileStreamC, testfileStreamD, testfileStreamE, testfileStreamF, url, utils, xmlParse;

  path = require("path");

  fs = require("fs");

  crypto = require("crypto");

  url = require("url");

  should = require('should');

  request = require("request");

  mime = require('mime-nofs');

  xmlParse = require('xml2js').parseString;

  Module = require("../.");

  utils = require("../lib/utils");

  _moduleInst = null;

  _config = null;

  redirPre = "://localhost:3010/redir/";

  testfileStreamA = null;

  testfileStreamB = null;

  testfileStreamC = null;

  testfileStreamD = null;

  testfileStreamE = null;

  testfileStreamF = null;

  testfileName = null;

  testfileMime = null;

  initFileStreams = function() {
    var testfileStreamG;
    testfileStreamA = fs.createReadStream(_config.mocha.file);
    testfileStreamB = fs.createReadStream(_config.mocha.file);
    testfileStreamC = fs.createReadStream(_config.mocha.file);
    testfileStreamD = fs.createReadStream(_config.mocha.file);
    testfileStreamE = fs.createReadStream(_config.mocha.file);
    testfileStreamF = fs.createReadStream(_config.mocha.file);
    testfileStreamG = fs.createReadStream(_config.mocha.file);
  };

  mimes = ["application/pdf", "image/jpeg", "text/plain"];

  describe("----- aws-s3-form TESTS -----", function() {
    var cryptomod, fn, i, len, ref;
    before(function(done) {
      _config = require("../config_test.json");
      testfileName = path.basename(_config.mocha.file);
      testfileMime = mime.lookup(_config.mocha.file);
      _config.s3.keyPrefix = "test_";
      _moduleInst = new Module(_config.s3);
      done();
    });
    after(function(done) {
      done();
    });
    ref = ["crypto", "crypto-js"];
    fn = function(cryptomod) {
      return describe("Main Tests with \"" + cryptomod + "\"", function() {
        var _dataA, _dataB, _dataC, _dataD, _dataE, _dataF, _dataG, _filenameA, _filenameB, _filenameC, _filenameD, _filenameE, _filenameF, _filenameG;
        _dataA = null;
        _filenameA = null;
        _dataB = null;
        _filenameB = null;
        _dataC = null;
        _filenameC = null;
        _dataD = null;
        _filenameD = null;
        _dataE = null;
        _filenameE = null;
        _dataF = null;
        _filenameF = null;
        _dataG = null;
        _filenameG = null;
        describe('Signing', function() {
          it('Set cyrpto module', function() {
            _moduleInst._setCryptoModule(cryptomod);
          });
          it("test signing", function(done) {
            var _policy, _region, _signature, _testsecret;
            _testsecret = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
            _region = "us-east-1";
            _policy = "eyAiZXhwaXJhdGlvbiI6ICIyMDEzLTA4LTA3VDEyOjAwOjAwLjAwMFoiLA0KICAiY29uZGl0aW9ucyI6IFsNCiAgICB7ImJ1Y2tldCI6ICJleGFtcGxlYnVja2V0In0sDQogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgInVzZXIvdXNlcjEvIl0sDQogICAgeyJhY2wiOiAicHVibGljLXJlYWQifSwNCiAgICB7InN1Y2Nlc3NfYWN0aW9uX3JlZGlyZWN0IjogImh0dHA6Ly9leGFtcGxlYnVja2V0LnMzLmFtYXpvbmF3cy5jb20vc3VjY2Vzc2Z1bF91cGxvYWQuaHRtbCJ9LA0KICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICJpbWFnZS8iXSwNCiAgICB7IngtYW16LW1ldGEtdXVpZCI6ICIxNDM2NTEyMzY1MTI3NCJ9LA0KICAgIFsic3RhcnRzLXdpdGgiLCAiJHgtYW16LW1ldGEtdGFnIiwgIiJdLA0KDQogICAgeyJ4LWFtei1jcmVkZW50aWFsIjogIkFLSUFJT1NGT0ROTjdFWEFNUExFLzIwMTMwODA2L3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QifSwNCiAgICB7IngtYW16LWFsZ29yaXRobSI6ICJBV1M0LUhNQUMtU0hBMjU2In0sDQogICAgeyJ4LWFtei1kYXRlIjogIjIwMTMwODA2VDAwMDAwMFoiIH0NCiAgXQ0KfQ==";
            _signature = _moduleInst.sign(_policy, {
              signdate: "20130806",
              secretAccessKey: _testsecret,
              region: _region
            });
            should.equal(_signature, "21496b44de44ccb73d545f1a995c68214c9cb0d41c45a17a5daeec0b1a6db047");
            done();
          });
        });
        describe('SSL', function() {
          it("init filestreams", function() {
            initFileStreams();
          });
          it("create data", function(done) {
            var _opt;
            _filenameA = utils.randomString(10);
            _opt = {
              redirectUrlTemplate: "https" + redirPre + _filenameA,
              secure: true
            };
            _dataA = _moduleInst.create(_filenameA, _opt);
            done();
          });
          it("send file to s3", function(done) {
            var formdata;
            this.timeout(30000);
            formdata = _dataA.fields;
            formdata.file = {
              value: testfileStreamA,
              options: {
                filename: testfileName,
                contentType: testfileMime
              }
            };
            request.post({
              url: _dataA.action,
              formData: formdata
            }, function(err, resp, body) {
              var _pathobj, _redirUrl, _redirobj;
              if (err) {
                console.log(err);
                throw err;
              }
              if (resp.statusCode >= 400 || resp.statusCode < 200) {
                xmlParse(body, function(err, data) {
                  if (err) {
                    console.log(err);
                    throw err;
                  }
                  console.error(data);
                  throw new Error("AWS ERROR");
                });
                return;
              }
              if (resp.statusCode === 303) {
                _redirUrl = resp.headers.location;
                _pathobj = url.parse(_redirUrl, true);
                _redirobj = url.parse(_dataA.fields.success_action_redirect);
                should.equal(_pathobj.pathname, _redirobj.pathname);
                should.equal(_pathobj.query.bucket, _config.s3.bucket);
                should.equal(_pathobj.query.key, _config.s3.keyPrefix + _filenameA);
                done();
              }
            });
          });
          it("check if file exists in s3", function(done) {
            var _url;
            _url = "https://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + (_config.s3.keyPrefix + _filenameA);
            request.head(_url, function(err, resp, body) {
              if (err) {
                throw err;
              }
              should.equal(resp.statusCode, 200);
              done();
            });
          });
        });
        describe('No SSL', function() {
          it("create data", function(done) {
            var _opt;
            _filenameB = utils.randomString(10);
            _opt = {
              redirectUrlTemplate: "http" + redirPre + _filenameB,
              secure: false
            };
            _dataB = _moduleInst.create(_filenameB, _opt);
            done();
          });
          it("send file to s3", function(done) {
            var formdata;
            this.timeout(30000);
            formdata = _dataB.fields;
            formdata.file = {
              value: testfileStreamB,
              options: {
                filename: testfileName,
                contentType: testfileMime
              }
            };
            request.post({
              url: _dataB.action,
              formData: formdata
            }, function(err, resp, body) {
              var _pathobj, _redirUrl, _redirobj;
              if (err) {
                console.log(err);
                throw err;
              }
              if (resp.statusCode >= 400 || resp.statusCode < 200) {
                xmlParse(body, function(err, data) {
                  if (err) {
                    console.log(err);
                    throw err;
                  }
                  console.error(data);
                  throw new Error("AWS ERROR");
                });
                return;
              }
              if (resp.statusCode === 303) {
                _redirUrl = resp.headers.location;
                _pathobj = url.parse(_redirUrl, true);
                _redirobj = url.parse(_dataB.fields.success_action_redirect);
                should.equal(_pathobj.pathname, _redirobj.pathname);
                should.equal(_pathobj.query.bucket, _config.s3.bucket);
                should.equal(_pathobj.query.key, _config.s3.keyPrefix + _filenameB);
                done();
              }
            });
          });
          it("check if file exists in s3 (no ssl)", function(done) {
            var _url;
            _url = "http://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + (_config.s3.keyPrefix + _filenameB);
            request.head(_url, function(err, resp, body) {
              if (err) {
                throw err;
              }
              should.equal(resp.statusCode, 200);
              done();
            });
          });
        });
        describe('With Mime', function() {
          it("create data", function(done) {
            var _opt;
            _filenameC = utils.randomString(10) + "." + mime.extension(testfileMime);
            _opt = {
              redirectUrlTemplate: "http" + redirPre + _filenameC,
              secure: false,
              contentType: testfileMime
            };
            _dataC = _moduleInst.create(_filenameC, _opt);
            done();
          });
          it("send file to s3", function(done) {
            var formdata;
            this.timeout(30000);
            formdata = _dataC.fields;
            formdata.file = {
              value: testfileStreamC,
              options: {
                filename: testfileName,
                contentType: testfileMime
              }
            };
            request.post({
              url: _dataC.action,
              formData: formdata
            }, function(err, resp, body) {
              var _pathobj, _redirUrl, _redirobj;
              if (err) {
                console.log(err);
                throw err;
              }
              if (resp.statusCode >= 400 || resp.statusCode < 200) {
                xmlParse(body, function(err, data) {
                  if (err) {
                    console.log(err);
                    throw err;
                  }
                  console.error(data);
                  throw new Error("AWS ERROR");
                });
                return;
              }
              if (resp.statusCode === 303) {
                _redirUrl = resp.headers.location;
                _pathobj = url.parse(_redirUrl, true);
                _redirobj = url.parse(_dataC.fields.success_action_redirect);
                should.equal(_pathobj.pathname, _redirobj.pathname);
                should.equal(_pathobj.query.bucket, _config.s3.bucket);
                should.equal(_pathobj.query.key, _config.s3.keyPrefix + _filenameC);
                done();
              }
            });
          });
          it("check if file exists in s3", function(done) {
            var _url;
            _url = "http://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + (_config.s3.keyPrefix + _filenameC);
            request.head(_url, function(err, resp, body) {
              if (err) {
                throw err;
              }
              should.equal(resp.statusCode, 200);
              done();
            });
          });
        });
        describe('Auto mime', function() {
          it("create data", function(done) {
            var _opt;
            _filenameD = utils.randomString(10) + "." + mime.extension(testfileMime);
            _opt = {
              redirectUrlTemplate: "http" + redirPre + _filenameD,
              secure: false,
              contentType: true
            };
            _dataD = _moduleInst.create(_filenameD, _opt);
            done();
          });
          it("send file to s3", function(done) {
            var formdata;
            this.timeout(30000);
            formdata = _dataD.fields;
            formdata.file = {
              value: testfileStreamD,
              options: {
                filename: testfileName,
                contentType: testfileMime
              }
            };
            request.post({
              url: _dataD.action,
              formData: formdata
            }, function(err, resp, body) {
              var _pathobj, _redirUrl, _redirobj;
              if (err) {
                console.log(err);
                throw err;
              }
              if (resp.statusCode >= 400 || resp.statusCode < 200) {
                xmlParse(body, function(err, data) {
                  if (err) {
                    console.log(err);
                    throw err;
                  }
                  console.error(data);
                  throw new Error("AWS ERROR");
                });
                return;
              }
              if (resp.statusCode === 303) {
                _redirUrl = resp.headers.location;
                _pathobj = url.parse(_redirUrl, true);
                _redirobj = url.parse(_dataD.fields.success_action_redirect);
                should.equal(_pathobj.pathname, _redirobj.pathname);
                should.equal(_pathobj.query.bucket, _config.s3.bucket);
                should.equal(_pathobj.query.key, _config.s3.keyPrefix + _filenameD);
                done();
              }
            });
          });
          it("check if file exists in s3", function(done) {
            var _url;
            _url = "http://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + (_config.s3.keyPrefix + _filenameD);
            request.head(_url, function(err, resp, body) {
              if (err) {
                throw err;
              }
              should.equal(resp.statusCode, 200);
              done();
            });
          });
        });
        describe('Auto mime and valid condition', function() {
          it("create data", function(done) {
            var _opt;
            _filenameE = utils.randomString(10) + "." + mime.extension(testfileMime);
            _opt = {
              redirectUrlTemplate: "http" + redirPre + _filenameE,
              secure: false,
              contentType: true,
              customConditions: [["starts-with", "$content-type", "image/"]]
            };
            _dataE = _moduleInst.create(_filenameE, _opt);
            done();
          });
          it("send file to s3", function(done) {
            var formdata;
            this.timeout(30000);
            formdata = _dataE.fields;
            formdata.file = {
              value: testfileStreamE,
              options: {
                filename: testfileName,
                contentType: testfileMime
              }
            };
            request.post({
              url: _dataE.action,
              formData: formdata
            }, function(err, resp, body) {
              var _pathobj, _redirUrl, _redirobj;
              if (err) {
                console.log(err);
                throw err;
              }
              if (resp.statusCode >= 400 || resp.statusCode < 200) {
                xmlParse(body, function(err, data) {
                  if (err) {
                    console.log(err);
                    throw err;
                  }
                  console.error(data);
                  throw new Error("AWS ERROR");
                });
                return;
              }
              if (resp.statusCode === 303) {
                _redirUrl = resp.headers.location;
                _pathobj = url.parse(_redirUrl, true);
                _redirobj = url.parse(_dataE.fields.success_action_redirect);
                should.equal(_pathobj.pathname, _redirobj.pathname);
                should.equal(_pathobj.query.bucket, _config.s3.bucket);
                should.equal(_pathobj.query.key, _config.s3.keyPrefix + _filenameE);
                done();
              }
            });
          });
          it("check if file exists in s3", function(done) {
            var _url;
            _url = "http://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + (_config.s3.keyPrefix + _filenameE);
            request.head(_url, function(err, resp, body) {
              if (err) {
                throw err;
              }
              should.equal(resp.statusCode, 200);
              done();
            });
          });
        });
        describe('Auto mime and invalid condition', function() {
          it("create data with mimetype", function(done) {
            var _opt;
            _filenameF = utils.randomString(10) + "." + mime.extension(testfileMime);
            _opt = {
              redirectUrlTemplate: "http" + redirPre + _filenameF,
              secure: false,
              contentType: true,
              customConditions: [["starts-with", "$content-type", "application/"]]
            };
            _dataF = _moduleInst.create(_filenameF, _opt);
            done();
          });
          it("send file to s3 with mimetype", function(done) {
            var formdata;
            this.timeout(30000);
            formdata = _dataF.fields;
            formdata.file = {
              value: testfileStreamF,
              options: {
                filename: testfileName,
                contentType: testfileMime
              }
            };
            request.post({
              url: _dataF.action,
              formData: formdata
            }, function(err, resp, body) {
              if (err) {
                console.log("ERR", err);
                throw err;
              }
              if (resp.statusCode >= 400 || resp.statusCode < 200) {
                xmlParse(body, function(err, data) {
                  var errorCode, errorMsg, ref1, ref2, ref3, ref4;
                  if (err) {
                    console.log(err);
                    throw err;
                  }
                  errorCode = data != null ? (ref1 = data.Error) != null ? (ref2 = ref1.Code) != null ? ref2[0] : void 0 : void 0 : void 0;
                  errorMsg = data != null ? (ref3 = data.Error) != null ? (ref4 = ref3.Message) != null ? ref4[0] : void 0 : void 0 : void 0;
                  errorCode.should.eql("AccessDenied");
                  errorMsg.should.startWith("Invalid according to Policy");
                  errorMsg.should.match(/\$content-type/i);
                  return done();
                });
                return;
              }
              throw new Error("should fail");
            });
          });
          it("check if file not exists in s3", function(done) {
            var _url;
            _url = "http://s3." + _config.s3.region + ".amazonaws.com/" + _config.s3.bucket + "/" + (_config.s3.keyPrefix + _filenameF);
            request.head(_url, function(err, resp, body) {
              if (err) {
                throw err;
              }
              should.equal(resp.statusCode, 403);
              done();
            });
          });
        });
        describe('Custom condition', function() {
          it("create data with numeric custom max length condtion", function(done) {
            var _opt;
            _filenameG = utils.randomString(10) + "." + mime.extension(testfileMime);
            _opt = {
              contentType: 'contentType',
              customConditions: [['content-length-range', 0, 1048576]]
            };
            _dataG = _moduleInst.create(_filenameF, _opt);
            done();
          });
        });
        describe('Reduced call', function() {
          it("create the most basic call", function(done) {
            var _opt;
            _filenameG = utils.randomString(10) + "." + mime.extension(testfileMime);
            _opt = {};
            _dataG = _moduleInst.create(_filenameF, _opt);
            console.log(_dataG);
            done();
          });
        });
      });
    };
    for (i = 0, len = ref.length; i < len; i++) {
      cryptomod = ref[i];
      fn(cryptomod);
    }
  });

}).call(this);
