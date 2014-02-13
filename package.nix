{ self, fetchurl, fetchgit ? null, lib }:

{
  by-spec."StringScanner"."~0.0.3" =
    self.by-version."StringScanner"."0.0.3";
  by-version."StringScanner"."0.0.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-StringScanner-0.0.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/StringScanner/-/StringScanner-0.0.3.tgz";
        name = "StringScanner-0.0.3.tgz";
        sha1 = "bf06ecfdc90046711f4e6175549243b78ceb38aa";
      })
    ];
    buildInputs =
      (self.nativeDeps."StringScanner" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "StringScanner" ];
  };
  by-spec."abbrev"."1" =
    self.by-version."abbrev"."1.0.4";
  by-version."abbrev"."1.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-abbrev-1.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/abbrev/-/abbrev-1.0.4.tgz";
        name = "abbrev-1.0.4.tgz";
        sha1 = "bd55ae5e413ba1722ee4caba1f6ea10414a59ecd";
      })
    ];
    buildInputs =
      (self.nativeDeps."abbrev" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "abbrev" ];
  };
  by-spec."abbrev"."1.0.x" =
    self.by-version."abbrev"."1.0.4";
  by-spec."abbrev"."~1.0.4" =
    self.by-version."abbrev"."1.0.4";
  by-spec."active-x-obfuscator"."0.0.1" =
    self.by-version."active-x-obfuscator"."0.0.1";
  by-version."active-x-obfuscator"."0.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-active-x-obfuscator-0.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/active-x-obfuscator/-/active-x-obfuscator-0.0.1.tgz";
        name = "active-x-obfuscator-0.0.1.tgz";
        sha1 = "089b89b37145ff1d9ec74af6530be5526cae1f1a";
      })
    ];
    buildInputs =
      (self.nativeDeps."active-x-obfuscator" or []);
    deps = [
      self.by-version."zeparser"."0.0.5"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "active-x-obfuscator" ];
  };
  by-spec."adm-zip"."0.2.1" =
    self.by-version."adm-zip"."0.2.1";
  by-version."adm-zip"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-adm-zip-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/adm-zip/-/adm-zip-0.2.1.tgz";
        name = "adm-zip-0.2.1.tgz";
        sha1 = "e801cedeb5bd9a4e98d699c5c0f4239e2731dcbf";
      })
    ];
    buildInputs =
      (self.nativeDeps."adm-zip" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "adm-zip" ];
  };
  by-spec."adm-zip"."~0.4.3" =
    self.by-version."adm-zip"."0.4.4";
  by-version."adm-zip"."0.4.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-adm-zip-0.4.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/adm-zip/-/adm-zip-0.4.4.tgz";
        name = "adm-zip-0.4.4.tgz";
        sha1 = "a61ed5ae6905c3aea58b3a657d25033091052736";
      })
    ];
    buildInputs =
      (self.nativeDeps."adm-zip" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "adm-zip" ];
  };
  by-spec."amdefine".">=0.0.4" =
    self.by-version."amdefine"."0.1.0";
  by-version."amdefine"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-amdefine-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/amdefine/-/amdefine-0.1.0.tgz";
        name = "amdefine-0.1.0.tgz";
        sha1 = "3ca9735cf1dde0edf7a4bf6641709c8024f9b227";
      })
    ];
    buildInputs =
      (self.nativeDeps."amdefine" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "amdefine" ];
  };
  by-spec."ansi-styles"."~0.1.0" =
    self.by-version."ansi-styles"."0.1.2";
  by-version."ansi-styles"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-ansi-styles-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ansi-styles/-/ansi-styles-0.1.2.tgz";
        name = "ansi-styles-0.1.2.tgz";
        sha1 = "5bab27c2e0bbe944ee42057cf23adee970abc7c6";
      })
    ];
    buildInputs =
      (self.nativeDeps."ansi-styles" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ansi-styles" ];
  };
  by-spec."ansi-styles"."~0.2.0" =
    self.by-version."ansi-styles"."0.2.0";
  by-version."ansi-styles"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-ansi-styles-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ansi-styles/-/ansi-styles-0.2.0.tgz";
        name = "ansi-styles-0.2.0.tgz";
        sha1 = "359ab4b15dcd64ba6d74734b72c36360a9af2c19";
      })
    ];
    buildInputs =
      (self.nativeDeps."ansi-styles" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ansi-styles" ];
  };
  by-spec."ansi-styles"."~1.0.0" =
    self.by-version."ansi-styles"."1.0.0";
  by-version."ansi-styles"."1.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-ansi-styles-1.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ansi-styles/-/ansi-styles-1.0.0.tgz";
        name = "ansi-styles-1.0.0.tgz";
        sha1 = "cb102df1c56f5123eab8b67cd7b98027a0279178";
      })
    ];
    buildInputs =
      (self.nativeDeps."ansi-styles" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ansi-styles" ];
  };
  by-spec."ansicolors"."~0.2.1" =
    self.by-version."ansicolors"."0.2.1";
  by-version."ansicolors"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-ansicolors-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ansicolors/-/ansicolors-0.2.1.tgz";
        name = "ansicolors-0.2.1.tgz";
        sha1 = "be089599097b74a5c9c4a84a0cdbcdb62bd87aef";
      })
    ];
    buildInputs =
      (self.nativeDeps."ansicolors" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ansicolors" ];
  };
  by-spec."archiver"."~0.5.2" =
    self.by-version."archiver"."0.5.2";
  by-version."archiver"."0.5.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-archiver-0.5.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/archiver/-/archiver-0.5.2.tgz";
        name = "archiver-0.5.2.tgz";
        sha1 = "4e021b1fea5d902201f4886fca6a19fcc760083b";
      })
    ];
    buildInputs =
      (self.nativeDeps."archiver" or []);
    deps = [
      self.by-version."readable-stream"."1.0.25"
      self.by-version."zip-stream"."0.1.4"
      self.by-version."lazystream"."0.1.0"
      self.by-version."file-utils"."0.1.5"
      self.by-version."lodash"."2.4.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "archiver" ];
  };
  by-spec."archy"."0.0.2" =
    self.by-version."archy"."0.0.2";
  by-version."archy"."0.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-archy-0.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/archy/-/archy-0.0.2.tgz";
        name = "archy-0.0.2.tgz";
        sha1 = "910f43bf66141fc335564597abc189df44b3d35e";
      })
    ];
    buildInputs =
      (self.nativeDeps."archy" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "archy" ];
  };
  by-spec."argparse"."~ 0.1.11" =
    self.by-version."argparse"."0.1.15";
  by-version."argparse"."0.1.15" = lib.makeOverridable self.buildNodePackage {
    name = "node-argparse-0.1.15";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/argparse/-/argparse-0.1.15.tgz";
        name = "argparse-0.1.15.tgz";
        sha1 = "28a1f72c43113e763220e5708414301c8840f0a1";
      })
    ];
    buildInputs =
      (self.nativeDeps."argparse" or []);
    deps = [
      self.by-version."underscore"."1.4.4"
      self.by-version."underscore.string"."2.3.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "argparse" ];
  };
  by-spec."asn1"."0.1.11" =
    self.by-version."asn1"."0.1.11";
  by-version."asn1"."0.1.11" = lib.makeOverridable self.buildNodePackage {
    name = "node-asn1-0.1.11";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/asn1/-/asn1-0.1.11.tgz";
        name = "asn1-0.1.11.tgz";
        sha1 = "559be18376d08a4ec4dbe80877d27818639b2df7";
      })
    ];
    buildInputs =
      (self.nativeDeps."asn1" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "asn1" ];
  };
  by-spec."assert-plus"."0.1.2" =
    self.by-version."assert-plus"."0.1.2";
  by-version."assert-plus"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-assert-plus-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/assert-plus/-/assert-plus-0.1.2.tgz";
        name = "assert-plus-0.1.2.tgz";
        sha1 = "d93ffdbb67ac5507779be316a7d65146417beef8";
      })
    ];
    buildInputs =
      (self.nativeDeps."assert-plus" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "assert-plus" ];
  };
  by-spec."async"."0.1.15" =
    self.by-version."async"."0.1.15";
  by-version."async"."0.1.15" = lib.makeOverridable self.buildNodePackage {
    name = "node-async-0.1.15";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/async/-/async-0.1.15.tgz";
        name = "async-0.1.15.tgz";
        sha1 = "2180eaca2cf2a6ca5280d41c0585bec9b3e49bd3";
      })
    ];
    buildInputs =
      (self.nativeDeps."async" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "async" ];
  };
  by-spec."async"."0.2.x" =
    self.by-version."async"."0.2.10";
  by-version."async"."0.2.10" = lib.makeOverridable self.buildNodePackage {
    name = "node-async-0.2.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/async/-/async-0.2.10.tgz";
        name = "async-0.2.10.tgz";
        sha1 = "b6bbe0b0674b9d719708ca38de8c237cb526c3d1";
      })
    ];
    buildInputs =
      (self.nativeDeps."async" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "async" ];
  };
  by-spec."async"."~0.1.22" =
    self.by-version."async"."0.1.22";
  by-version."async"."0.1.22" = lib.makeOverridable self.buildNodePackage {
    name = "node-async-0.1.22";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/async/-/async-0.1.22.tgz";
        name = "async-0.1.22.tgz";
        sha1 = "0fc1aaa088a0e3ef0ebe2d8831bab0dcf8845061";
      })
    ];
    buildInputs =
      (self.nativeDeps."async" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "async" ];
  };
  by-spec."async"."~0.2.6" =
    self.by-version."async"."0.2.10";
  by-spec."async"."~0.2.7" =
    self.by-version."async"."0.2.10";
  by-spec."async"."~0.2.8" =
    self.by-version."async"."0.2.10";
  by-spec."async"."~0.2.9" =
    self.by-version."async"."0.2.10";
  by-spec."aws-sign"."~0.2.0" =
    self.by-version."aws-sign"."0.2.0";
  by-version."aws-sign"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-aws-sign-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/aws-sign/-/aws-sign-0.2.0.tgz";
        name = "aws-sign-0.2.0.tgz";
        sha1 = "c55013856c8194ec854a0cbec90aab5a04ce3ac5";
      })
    ];
    buildInputs =
      (self.nativeDeps."aws-sign" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "aws-sign" ];
  };
  by-spec."aws-sign"."~0.3.0" =
    self.by-version."aws-sign"."0.3.0";
  by-version."aws-sign"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-aws-sign-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/aws-sign/-/aws-sign-0.3.0.tgz";
        name = "aws-sign-0.3.0.tgz";
        sha1 = "3d81ca69b474b1e16518728b51c24ff0bbedc6e9";
      })
    ];
    buildInputs =
      (self.nativeDeps."aws-sign" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "aws-sign" ];
  };
  by-spec."aws-sign2"."~0.5.0" =
    self.by-version."aws-sign2"."0.5.0";
  by-version."aws-sign2"."0.5.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-aws-sign2-0.5.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/aws-sign2/-/aws-sign2-0.5.0.tgz";
        name = "aws-sign2-0.5.0.tgz";
        sha1 = "c57103f7a17fc037f02d7c2e64b602ea223f7d63";
      })
    ];
    buildInputs =
      (self.nativeDeps."aws-sign2" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "aws-sign2" ];
  };
  by-spec."base64id"."0.1.0" =
    self.by-version."base64id"."0.1.0";
  by-version."base64id"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-base64id-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/base64id/-/base64id-0.1.0.tgz";
        name = "base64id-0.1.0.tgz";
        sha1 = "02ce0fdeee0cef4f40080e1e73e834f0b1bfce3f";
      })
    ];
    buildInputs =
      (self.nativeDeps."base64id" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "base64id" ];
  };
  by-spec."batch"."0.5.0" =
    self.by-version."batch"."0.5.0";
  by-version."batch"."0.5.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-batch-0.5.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/batch/-/batch-0.5.0.tgz";
        name = "batch-0.5.0.tgz";
        sha1 = "fd2e05a7a5d696b4db9314013e285d8ff3557ec3";
      })
    ];
    buildInputs =
      (self.nativeDeps."batch" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "batch" ];
  };
  by-spec."binary"."~0.3.0" =
    self.by-version."binary"."0.3.0";
  by-version."binary"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-binary-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/binary/-/binary-0.3.0.tgz";
        name = "binary-0.3.0.tgz";
        sha1 = "9f60553bc5ce8c3386f3b553cff47462adecaa79";
      })
    ];
    buildInputs =
      (self.nativeDeps."binary" or []);
    deps = [
      self.by-version."chainsaw"."0.1.0"
      self.by-version."buffers"."0.1.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "binary" ];
  };
  by-spec."block-stream"."*" =
    self.by-version."block-stream"."0.0.7";
  by-version."block-stream"."0.0.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-block-stream-0.0.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/block-stream/-/block-stream-0.0.7.tgz";
        name = "block-stream-0.0.7.tgz";
        sha1 = "9088ab5ae1e861f4d81b176b4a8046080703deed";
      })
    ];
    buildInputs =
      (self.nativeDeps."block-stream" or []);
    deps = [
      self.by-version."inherits"."2.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "block-stream" ];
  };
  by-spec."boom"."0.3.x" =
    self.by-version."boom"."0.3.8";
  by-version."boom"."0.3.8" = lib.makeOverridable self.buildNodePackage {
    name = "node-boom-0.3.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/boom/-/boom-0.3.8.tgz";
        name = "boom-0.3.8.tgz";
        sha1 = "c8cdb041435912741628c044ecc732d1d17c09ea";
      })
    ];
    buildInputs =
      (self.nativeDeps."boom" or []);
    deps = [
      self.by-version."hoek"."0.7.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "boom" ];
  };
  by-spec."boom"."0.4.x" =
    self.by-version."boom"."0.4.2";
  by-version."boom"."0.4.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-boom-0.4.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/boom/-/boom-0.4.2.tgz";
        name = "boom-0.4.2.tgz";
        sha1 = "7a636e9ded4efcefb19cef4947a3c67dfaee911b";
      })
    ];
    buildInputs =
      (self.nativeDeps."boom" or []);
    deps = [
      self.by-version."hoek"."0.9.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "boom" ];
  };
  by-spec."bower"."~1.2.8" =
    self.by-version."bower"."1.2.8";
  by-version."bower"."1.2.8" = lib.makeOverridable self.buildNodePackage {
    name = "bower-1.2.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower/-/bower-1.2.8.tgz";
        name = "bower-1.2.8.tgz";
        sha1 = "f63c0804a267d5ffaf2fd3fd488367e73dce202f";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower" or []);
    deps = [
      self.by-version."abbrev"."1.0.4"
      self.by-version."archy"."0.0.2"
      self.by-version."bower-config"."0.5.0"
      self.by-version."bower-endpoint-parser"."0.2.1"
      self.by-version."bower-json"."0.4.0"
      self.by-version."bower-logger"."0.2.2"
      self.by-version."bower-registry-client"."0.1.6"
      self.by-version."cardinal"."0.4.4"
      self.by-version."chalk"."0.2.1"
      self.by-version."chmodr"."0.1.0"
      self.by-version."decompress-zip"."0.0.4"
      self.by-version."fstream"."0.1.25"
      self.by-version."fstream-ignore"."0.0.7"
      self.by-version."glob"."3.2.8"
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."handlebars"."1.0.12"
      self.by-version."inquirer"."0.3.5"
      self.by-version."junk"."0.2.2"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."mout"."0.7.1"
      self.by-version."nopt"."2.1.2"
      self.by-version."lru-cache"."2.3.1"
      self.by-version."open"."0.0.4"
      self.by-version."osenv"."0.0.3"
      self.by-version."promptly"."0.2.0"
      self.by-version."q"."0.9.7"
      self.by-version."request"."2.27.0"
      self.by-version."request-progress"."0.3.1"
      self.by-version."retry"."0.6.0"
      self.by-version."rimraf"."2.2.6"
      self.by-version."semver"."2.1.0"
      self.by-version."stringify-object"."0.1.8"
      self.by-version."sudo-block"."0.2.1"
      self.by-version."tar"."0.1.19"
      self.by-version."tmp"."0.0.23"
      self.by-version."update-notifier"."0.1.7"
      self.by-version."which"."1.0.5"
      self.by-version."p-throttler"."0.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower" ];
  };
  "bower" = self.by-version."bower"."1.2.8";
  by-spec."bower-config"."~0.4.3" =
    self.by-version."bower-config"."0.4.5";
  by-version."bower-config"."0.4.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-bower-config-0.4.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower-config/-/bower-config-0.4.5.tgz";
        name = "bower-config-0.4.5.tgz";
        sha1 = "baa7cee382f53b13bb62a4afaee7c05f20143c13";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower-config" or []);
    deps = [
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."mout"."0.6.0"
      self.by-version."optimist"."0.6.1"
      self.by-version."osenv"."0.0.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower-config" ];
  };
  by-spec."bower-config"."~0.5.0" =
    self.by-version."bower-config"."0.5.0";
  by-version."bower-config"."0.5.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-bower-config-0.5.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower-config/-/bower-config-0.5.0.tgz";
        name = "bower-config-0.5.0.tgz";
        sha1 = "d081d43008816b1beb876dee272219851dd4c89c";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower-config" or []);
    deps = [
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."mout"."0.6.0"
      self.by-version."optimist"."0.6.1"
      self.by-version."osenv"."0.0.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower-config" ];
  };
  by-spec."bower-endpoint-parser"."~0.2.0" =
    self.by-version."bower-endpoint-parser"."0.2.1";
  by-version."bower-endpoint-parser"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-bower-endpoint-parser-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower-endpoint-parser/-/bower-endpoint-parser-0.2.1.tgz";
        name = "bower-endpoint-parser-0.2.1.tgz";
        sha1 = "8c4010a2900cdab07ea5d38f0bd03e9bbccef90f";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower-endpoint-parser" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower-endpoint-parser" ];
  };
  by-spec."bower-json"."~0.4.0" =
    self.by-version."bower-json"."0.4.0";
  by-version."bower-json"."0.4.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-bower-json-0.4.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower-json/-/bower-json-0.4.0.tgz";
        name = "bower-json-0.4.0.tgz";
        sha1 = "a99c3ccf416ef0590ed0ded252c760f1c6d93766";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower-json" or []);
    deps = [
      self.by-version."deep-extend"."0.2.8"
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."intersect"."0.0.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower-json" ];
  };
  by-spec."bower-logger"."~0.2.1" =
    self.by-version."bower-logger"."0.2.2";
  by-version."bower-logger"."0.2.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-bower-logger-0.2.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower-logger/-/bower-logger-0.2.2.tgz";
        name = "bower-logger-0.2.2.tgz";
        sha1 = "39be07e979b2fc8e03a94634205ed9422373d381";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower-logger" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower-logger" ];
  };
  by-spec."bower-registry-client"."~0.1.4" =
    self.by-version."bower-registry-client"."0.1.6";
  by-version."bower-registry-client"."0.1.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-bower-registry-client-0.1.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bower-registry-client/-/bower-registry-client-0.1.6.tgz";
        name = "bower-registry-client-0.1.6.tgz";
        sha1 = "c3ae74a98f24f50a373bbcb0ef443558be01d4b7";
      })
    ];
    buildInputs =
      (self.nativeDeps."bower-registry-client" or []);
    deps = [
      self.by-version."async"."0.2.10"
      self.by-version."bower-config"."0.4.5"
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."lru-cache"."2.3.1"
      self.by-version."request"."2.27.0"
      self.by-version."request-replay"."0.2.0"
      self.by-version."rimraf"."2.2.6"
      self.by-version."mkdirp"."0.3.5"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bower-registry-client" ];
  };
  by-spec."buffer-crc32"."0.2.1" =
    self.by-version."buffer-crc32"."0.2.1";
  by-version."buffer-crc32"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-buffer-crc32-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/buffer-crc32/-/buffer-crc32-0.2.1.tgz";
        name = "buffer-crc32-0.2.1.tgz";
        sha1 = "be3e5382fc02b6d6324956ac1af98aa98b08534c";
      })
    ];
    buildInputs =
      (self.nativeDeps."buffer-crc32" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "buffer-crc32" ];
  };
  by-spec."buffers"."~0.1.1" =
    self.by-version."buffers"."0.1.1";
  by-version."buffers"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-buffers-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/buffers/-/buffers-0.1.1.tgz";
        name = "buffers-0.1.1.tgz";
        sha1 = "b24579c3bed4d6d396aeee6d9a8ae7f5482ab7bb";
      })
    ];
    buildInputs =
      (self.nativeDeps."buffers" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "buffers" ];
  };
  by-spec."bytes"."0.2.1" =
    self.by-version."bytes"."0.2.1";
  by-version."bytes"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-bytes-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/bytes/-/bytes-0.2.1.tgz";
        name = "bytes-0.2.1.tgz";
        sha1 = "555b08abcb063f8975905302523e4cd4ffdfdf31";
      })
    ];
    buildInputs =
      (self.nativeDeps."bytes" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "bytes" ];
  };
  by-spec."bytes"."~0.2.1" =
    self.by-version."bytes"."0.2.1";
  by-spec."cardinal"."~0.4.0" =
    self.by-version."cardinal"."0.4.4";
  by-version."cardinal"."0.4.4" = lib.makeOverridable self.buildNodePackage {
    name = "cardinal-0.4.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cardinal/-/cardinal-0.4.4.tgz";
        name = "cardinal-0.4.4.tgz";
        sha1 = "ca5bb68a5b511b90fe93b9acea49bdee5c32bfe2";
      })
    ];
    buildInputs =
      (self.nativeDeps."cardinal" or []);
    deps = [
      self.by-version."redeyed"."0.4.2"
      self.by-version."ansicolors"."0.2.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cardinal" ];
  };
  by-spec."chainsaw"."~0.1.0" =
    self.by-version."chainsaw"."0.1.0";
  by-version."chainsaw"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-chainsaw-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/chainsaw/-/chainsaw-0.1.0.tgz";
        name = "chainsaw-0.1.0.tgz";
        sha1 = "5eab50b28afe58074d0d58291388828b5e5fbc98";
      })
    ];
    buildInputs =
      (self.nativeDeps."chainsaw" or []);
    deps = [
      self.by-version."traverse"."0.3.9"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "chainsaw" ];
  };
  by-spec."chalk"."~0.1.1" =
    self.by-version."chalk"."0.1.1";
  by-version."chalk"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-chalk-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/chalk/-/chalk-0.1.1.tgz";
        name = "chalk-0.1.1.tgz";
        sha1 = "fe6d90ae2c270424720c87ed92d36490b7d36ea0";
      })
    ];
    buildInputs =
      (self.nativeDeps."chalk" or []);
    deps = [
      self.by-version."has-color"."0.1.4"
      self.by-version."ansi-styles"."0.1.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "chalk" ];
  };
  by-spec."chalk"."~0.2.0" =
    self.by-version."chalk"."0.2.1";
  by-version."chalk"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-chalk-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/chalk/-/chalk-0.2.1.tgz";
        name = "chalk-0.2.1.tgz";
        sha1 = "7613e1575145b21386483f7f485aa5ffa8cbd10c";
      })
    ];
    buildInputs =
      (self.nativeDeps."chalk" or []);
    deps = [
      self.by-version."has-color"."0.1.4"
      self.by-version."ansi-styles"."0.2.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "chalk" ];
  };
  by-spec."chalk"."~0.2.1" =
    self.by-version."chalk"."0.2.1";
  by-spec."chalk"."~0.4.0" =
    self.by-version."chalk"."0.4.0";
  by-version."chalk"."0.4.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-chalk-0.4.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/chalk/-/chalk-0.4.0.tgz";
        name = "chalk-0.4.0.tgz";
        sha1 = "5199a3ddcd0c1efe23bc08c1b027b06176e0c64f";
      })
    ];
    buildInputs =
      (self.nativeDeps."chalk" or []);
    deps = [
      self.by-version."has-color"."0.1.4"
      self.by-version."ansi-styles"."1.0.0"
      self.by-version."strip-ansi"."0.1.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "chalk" ];
  };
  by-spec."chmodr"."~0.1.0" =
    self.by-version."chmodr"."0.1.0";
  by-version."chmodr"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-chmodr-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/chmodr/-/chmodr-0.1.0.tgz";
        name = "chmodr-0.1.0.tgz";
        sha1 = "e09215a1d51542db2a2576969765bcf6125583eb";
      })
    ];
    buildInputs =
      (self.nativeDeps."chmodr" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "chmodr" ];
  };
  by-spec."chokidar"."~0.8.0" =
    self.by-version."chokidar"."0.8.1";
  by-version."chokidar"."0.8.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-chokidar-0.8.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/chokidar/-/chokidar-0.8.1.tgz";
        name = "chokidar-0.8.1.tgz";
        sha1 = "8ee0c99ef48420902fded73b862eac2dd75da4a6";
      })
    ];
    buildInputs =
      (self.nativeDeps."chokidar" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "chokidar" ];
  };
  by-spec."clean-css"."2.0.x" =
    self.by-version."clean-css"."2.0.8";
  by-version."clean-css"."2.0.8" = lib.makeOverridable self.buildNodePackage {
    name = "clean-css-2.0.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/clean-css/-/clean-css-2.0.8.tgz";
        name = "clean-css-2.0.8.tgz";
        sha1 = "e937cdfdcc5781a00817aec4079e85b3ec157a20";
      })
    ];
    buildInputs =
      (self.nativeDeps."clean-css" or []);
    deps = [
      self.by-version."commander"."2.0.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "clean-css" ];
  };
  by-spec."cli"."0.4.x" =
    self.by-version."cli"."0.4.5";
  by-version."cli"."0.4.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-cli-0.4.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cli/-/cli-0.4.5.tgz";
        name = "cli-0.4.5.tgz";
        sha1 = "78f9485cd161b566e9a6c72d7170c4270e81db61";
      })
    ];
    buildInputs =
      (self.nativeDeps."cli" or []);
    deps = [
      self.by-version."glob"."3.2.8"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cli" ];
  };
  by-spec."cli-color"."~0.2.2" =
    self.by-version."cli-color"."0.2.3";
  by-version."cli-color"."0.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-cli-color-0.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cli-color/-/cli-color-0.2.3.tgz";
        name = "cli-color-0.2.3.tgz";
        sha1 = "0a25ceae5a6a1602be7f77d28563c36700274e88";
      })
    ];
    buildInputs =
      (self.nativeDeps."cli-color" or []);
    deps = [
      self.by-version."es5-ext"."0.9.2"
      self.by-version."memoizee"."0.2.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cli-color" ];
  };
  by-spec."coffee-script"."~1.3.3" =
    self.by-version."coffee-script"."1.3.3";
  by-version."coffee-script"."1.3.3" = lib.makeOverridable self.buildNodePackage {
    name = "coffee-script-1.3.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/coffee-script/-/coffee-script-1.3.3.tgz";
        name = "coffee-script-1.3.3.tgz";
        sha1 = "150d6b4cb522894369efed6a2101c20bc7f4a4f4";
      })
    ];
    buildInputs =
      (self.nativeDeps."coffee-script" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "coffee-script" ];
  };
  by-spec."coffee-script"."~1.6" =
    self.by-version."coffee-script"."1.6.3";
  by-version."coffee-script"."1.6.3" = lib.makeOverridable self.buildNodePackage {
    name = "coffee-script-1.6.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/coffee-script/-/coffee-script-1.6.3.tgz";
        name = "coffee-script-1.6.3.tgz";
        sha1 = "6355d32cf1b04cdff6b484e5e711782b2f0c39be";
      })
    ];
    buildInputs =
      (self.nativeDeps."coffee-script" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "coffee-script" ];
  };
  by-spec."coffee-script-redux"."git+https://github.com/michaelficarra/CoffeeScriptRedux.git#9895cd1641fdf3a2424e662ab7583726bb0e35b3" =
    self.by-version."coffee-script-redux"."2.0.0-beta4";
  by-version."coffee-script-redux"."2.0.0-beta4" = lib.makeOverridable self.buildNodePackage {
    name = "coffee-script-redux-2.0.0-beta4";
    src = [
      (fetchgit {
        url = "https://github.com/michaelficarra/CoffeeScriptRedux.git";
        rev = "9895cd1641fdf3a2424e662ab7583726bb0e35b3";
        sha256 = "d70e659aa7cdb50a98959dec0e2a8c916200e31cb770f04faa2ae92a55d1e66d";
      })
    ];
    buildInputs =
      (self.nativeDeps."coffee-script-redux" or []);
    deps = [
      self.by-version."StringScanner"."0.0.3"
      self.by-version."jedediah"."0.1.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "coffee-script-redux" ];
  };
  by-spec."colors"."0.5.x" =
    self.by-version."colors"."0.5.1";
  by-version."colors"."0.5.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-colors-0.5.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/colors/-/colors-0.5.1.tgz";
        name = "colors-0.5.1.tgz";
        sha1 = "7d0023eaeb154e8ee9fce75dcb923d0ed1667774";
      })
    ];
    buildInputs =
      (self.nativeDeps."colors" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "colors" ];
  };
  by-spec."colors"."0.x.x" =
    self.by-version."colors"."0.6.2";
  by-version."colors"."0.6.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-colors-0.6.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/colors/-/colors-0.6.2.tgz";
        name = "colors-0.6.2.tgz";
        sha1 = "2423fe6678ac0c5dae8852e5d0e5be08c997abcc";
      })
    ];
    buildInputs =
      (self.nativeDeps."colors" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "colors" ];
  };
  by-spec."colors"."~0.6.2" =
    self.by-version."colors"."0.6.2";
  by-spec."combined-stream"."~0.0.4" =
    self.by-version."combined-stream"."0.0.4";
  by-version."combined-stream"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-combined-stream-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/combined-stream/-/combined-stream-0.0.4.tgz";
        name = "combined-stream-0.0.4.tgz";
        sha1 = "2d1a43347dbe9515a4a2796732e5b88473840b22";
      })
    ];
    buildInputs =
      (self.nativeDeps."combined-stream" or []);
    deps = [
      self.by-version."delayed-stream"."0.0.5"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "combined-stream" ];
  };
  by-spec."commander"."0.6.1" =
    self.by-version."commander"."0.6.1";
  by-version."commander"."0.6.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-commander-0.6.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/commander/-/commander-0.6.1.tgz";
        name = "commander-0.6.1.tgz";
        sha1 = "fa68a14f6a945d54dbbe50d8cdb3320e9e3b1a06";
      })
    ];
    buildInputs =
      (self.nativeDeps."commander" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "commander" ];
  };
  by-spec."commander"."2.0.0" =
    self.by-version."commander"."2.0.0";
  by-version."commander"."2.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-commander-2.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/commander/-/commander-2.0.0.tgz";
        name = "commander-2.0.0.tgz";
        sha1 = "d1b86f901f8b64bd941bdeadaf924530393be928";
      })
    ];
    buildInputs =
      (self.nativeDeps."commander" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "commander" ];
  };
  by-spec."commander"."2.0.x" =
    self.by-version."commander"."2.0.0";
  by-spec."commander"."~0.6.1" =
    self.by-version."commander"."0.6.1";
  by-spec."config-chain"."~1.1.1" =
    self.by-version."config-chain"."1.1.8";
  by-version."config-chain"."1.1.8" = lib.makeOverridable self.buildNodePackage {
    name = "node-config-chain-1.1.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/config-chain/-/config-chain-1.1.8.tgz";
        name = "config-chain-1.1.8.tgz";
        sha1 = "0943d0b7227213a20d4eaff4434f4a1c0a052cad";
      })
    ];
    buildInputs =
      (self.nativeDeps."config-chain" or []);
    deps = [
      self.by-version."proto-list"."1.2.2"
      self.by-version."ini"."1.1.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "config-chain" ];
  };
  by-spec."configstore"."~0.1.0" =
    self.by-version."configstore"."0.1.7";
  by-version."configstore"."0.1.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-configstore-0.1.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/configstore/-/configstore-0.1.7.tgz";
        name = "configstore-0.1.7.tgz";
        sha1 = "57dc701bc2a51eb804d6e1733c8abb9d82a5cede";
      })
    ];
    buildInputs =
      (self.nativeDeps."configstore" or []);
    deps = [
      self.by-version."lodash"."2.4.1"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."js-yaml"."2.1.3"
      self.by-version."osenv"."0.0.3"
      self.by-version."graceful-fs"."2.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "configstore" ];
  };
  by-spec."connect"."~2.12.0" =
    self.by-version."connect"."2.12.0";
  by-version."connect"."2.12.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-connect-2.12.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/connect/-/connect-2.12.0.tgz";
        name = "connect-2.12.0.tgz";
        sha1 = "31d8fa0dcacdf1908d822bd2923be8a2d2a7ed9a";
      })
    ];
    buildInputs =
      (self.nativeDeps."connect" or []);
    deps = [
      self.by-version."batch"."0.5.0"
      self.by-version."qs"."0.6.6"
      self.by-version."cookie-signature"."1.0.1"
      self.by-version."buffer-crc32"."0.2.1"
      self.by-version."cookie"."0.1.0"
      self.by-version."send"."0.1.4"
      self.by-version."bytes"."0.2.1"
      self.by-version."fresh"."0.2.0"
      self.by-version."pause"."0.0.1"
      self.by-version."uid2"."0.0.3"
      self.by-version."debug"."0.7.4"
      self.by-version."methods"."0.1.0"
      self.by-version."raw-body"."1.1.2"
      self.by-version."negotiator"."0.3.0"
      self.by-version."multiparty"."2.2.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "connect" ];
  };
  by-spec."console-browserify"."0.1.x" =
    self.by-version."console-browserify"."0.1.6";
  by-version."console-browserify"."0.1.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-console-browserify-0.1.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/console-browserify/-/console-browserify-0.1.6.tgz";
        name = "console-browserify-0.1.6.tgz";
        sha1 = "d128a3c0bb88350eb5626c6e7c71a6f0fd48983c";
      })
    ];
    buildInputs =
      (self.nativeDeps."console-browserify" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "console-browserify" ];
  };
  by-spec."cookie"."0.1.0" =
    self.by-version."cookie"."0.1.0";
  by-version."cookie"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-cookie-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cookie/-/cookie-0.1.0.tgz";
        name = "cookie-0.1.0.tgz";
        sha1 = "90eb469ddce905c866de687efc43131d8801f9d0";
      })
    ];
    buildInputs =
      (self.nativeDeps."cookie" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cookie" ];
  };
  by-spec."cookie-jar"."~0.2.0" =
    self.by-version."cookie-jar"."0.2.0";
  by-version."cookie-jar"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-cookie-jar-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cookie-jar/-/cookie-jar-0.2.0.tgz";
        name = "cookie-jar-0.2.0.tgz";
        sha1 = "64ecc06ac978db795e4b5290cbe48ba3781400fa";
      })
    ];
    buildInputs =
      (self.nativeDeps."cookie-jar" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cookie-jar" ];
  };
  by-spec."cookie-jar"."~0.3.0" =
    self.by-version."cookie-jar"."0.3.0";
  by-version."cookie-jar"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-cookie-jar-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cookie-jar/-/cookie-jar-0.3.0.tgz";
        name = "cookie-jar-0.3.0.tgz";
        sha1 = "bc9a27d4e2b97e186cd57c9e2063cb99fa68cccc";
      })
    ];
    buildInputs =
      (self.nativeDeps."cookie-jar" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cookie-jar" ];
  };
  by-spec."cookie-signature"."1.0.1" =
    self.by-version."cookie-signature"."1.0.1";
  by-version."cookie-signature"."1.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-cookie-signature-1.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.1.tgz";
        name = "cookie-signature-1.0.1.tgz";
        sha1 = "44e072148af01e6e8e24afbf12690d68ae698ecb";
      })
    ];
    buildInputs =
      (self.nativeDeps."cookie-signature" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cookie-signature" ];
  };
  by-spec."core-util-is"."~1.0.0" =
    self.by-version."core-util-is"."1.0.1";
  by-version."core-util-is"."1.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-core-util-is-1.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/core-util-is/-/core-util-is-1.0.1.tgz";
        name = "core-util-is-1.0.1.tgz";
        sha1 = "6b07085aef9a3ccac6ee53bf9d3df0c1521a5538";
      })
    ];
    buildInputs =
      (self.nativeDeps."core-util-is" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "core-util-is" ];
  };
  by-spec."coveralls"."~2.7.0" =
    self.by-version."coveralls"."2.7.1";
  by-version."coveralls"."2.7.1" = lib.makeOverridable self.buildNodePackage {
    name = "coveralls-2.7.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/coveralls/-/coveralls-2.7.1.tgz";
        name = "coveralls-2.7.1.tgz";
        sha1 = "86e91436d248ca9c202504e9e022d77946eded41";
      })
    ];
    buildInputs =
      (self.nativeDeps."coveralls" or []);
    deps = [
      self.by-version."yaml"."0.2.3"
      self.by-version."request"."2.16.2"
      self.by-version."lcov-parse"."0.0.4"
      self.by-version."log-driver"."1.2.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "coveralls" ];
  };
  "coveralls" = self.by-version."coveralls"."2.7.1";
  by-spec."cryptiles"."0.1.x" =
    self.by-version."cryptiles"."0.1.3";
  by-version."cryptiles"."0.1.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-cryptiles-0.1.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cryptiles/-/cryptiles-0.1.3.tgz";
        name = "cryptiles-0.1.3.tgz";
        sha1 = "1a556734f06d24ba34862ae9cb9e709a3afbff1c";
      })
    ];
    buildInputs =
      (self.nativeDeps."cryptiles" or []);
    deps = [
      self.by-version."boom"."0.3.8"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cryptiles" ];
  };
  by-spec."cryptiles"."0.2.x" =
    self.by-version."cryptiles"."0.2.2";
  by-version."cryptiles"."0.2.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-cryptiles-0.2.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/cryptiles/-/cryptiles-0.2.2.tgz";
        name = "cryptiles-0.2.2.tgz";
        sha1 = "ed91ff1f17ad13d3748288594f8a48a0d26f325c";
      })
    ];
    buildInputs =
      (self.nativeDeps."cryptiles" or []);
    deps = [
      self.by-version."boom"."0.4.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "cryptiles" ];
  };
  by-spec."ctype"."0.5.2" =
    self.by-version."ctype"."0.5.2";
  by-version."ctype"."0.5.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-ctype-0.5.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ctype/-/ctype-0.5.2.tgz";
        name = "ctype-0.5.2.tgz";
        sha1 = "fe8091d468a373a0b0c9ff8bbfb3425c00973a1d";
      })
    ];
    buildInputs =
      (self.nativeDeps."ctype" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ctype" ];
  };
  by-spec."dateformat"."1.0.2-1.2.3" =
    self.by-version."dateformat"."1.0.2-1.2.3";
  by-version."dateformat"."1.0.2-1.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-dateformat-1.0.2-1.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/dateformat/-/dateformat-1.0.2-1.2.3.tgz";
        name = "dateformat-1.0.2-1.2.3.tgz";
        sha1 = "b0220c02de98617433b72851cf47de3df2cdbee9";
      })
    ];
    buildInputs =
      (self.nativeDeps."dateformat" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "dateformat" ];
  };
  by-spec."dateformat"."~1.0.6" =
    self.by-version."dateformat"."1.0.7-1.2.3";
  by-version."dateformat"."1.0.7-1.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-dateformat-1.0.7-1.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/dateformat/-/dateformat-1.0.7-1.2.3.tgz";
        name = "dateformat-1.0.7-1.2.3.tgz";
        sha1 = "ebb561bb7214ee57a8dc2687adab1d555de9419c";
      })
    ];
    buildInputs =
      (self.nativeDeps."dateformat" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "dateformat" ];
  };
  by-spec."debug"."*" =
    self.by-version."debug"."0.7.4";
  by-version."debug"."0.7.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-debug-0.7.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/debug/-/debug-0.7.4.tgz";
        name = "debug-0.7.4.tgz";
        sha1 = "06e1ea8082c2cb14e39806e22e2f6f757f92af39";
      })
    ];
    buildInputs =
      (self.nativeDeps."debug" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "debug" ];
  };
  by-spec."debug".">= 0.7.3 < 1" =
    self.by-version."debug"."0.7.4";
  by-spec."debuglog"."0.0.2" =
    self.by-version."debuglog"."0.0.2";
  by-version."debuglog"."0.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-debuglog-0.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/debuglog/-/debuglog-0.0.2.tgz";
        name = "debuglog-0.0.2.tgz";
        sha1 = "6c0dcf07e2c3f74524629b741668bd46c7b362eb";
      })
    ];
    buildInputs =
      (self.nativeDeps."debuglog" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "debuglog" ];
  };
  by-spec."decompress-zip"."~0.0.3" =
    self.by-version."decompress-zip"."0.0.4";
  by-version."decompress-zip"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "decompress-zip-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/decompress-zip/-/decompress-zip-0.0.4.tgz";
        name = "decompress-zip-0.0.4.tgz";
        sha1 = "c562431f76af8970afaf50226e42e1c47a57b086";
      })
    ];
    buildInputs =
      (self.nativeDeps."decompress-zip" or []);
    deps = [
      self.by-version."q"."0.9.7"
      self.by-version."mkpath"."0.1.0"
      self.by-version."binary"."0.3.0"
      self.by-version."touch"."0.0.2"
      self.by-version."readable-stream"."1.1.10"
      self.by-version."nopt"."2.1.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "decompress-zip" ];
  };
  by-spec."deep-equal"."*" =
    self.by-version."deep-equal"."0.2.1";
  by-version."deep-equal"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-deep-equal-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/deep-equal/-/deep-equal-0.2.1.tgz";
        name = "deep-equal-0.2.1.tgz";
        sha1 = "fad7a793224cbf0c3c7786f92ef780e4fc8cc878";
      })
    ];
    buildInputs =
      (self.nativeDeps."deep-equal" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "deep-equal" ];
  };
  by-spec."deep-extend"."~0.2.5" =
    self.by-version."deep-extend"."0.2.8";
  by-version."deep-extend"."0.2.8" = lib.makeOverridable self.buildNodePackage {
    name = "node-deep-extend-0.2.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/deep-extend/-/deep-extend-0.2.8.tgz";
        name = "deep-extend-0.2.8.tgz";
        sha1 = "6d2893a805286e46d8243137c32fb991b50f4299";
      })
    ];
    buildInputs =
      (self.nativeDeps."deep-extend" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "deep-extend" ];
  };
  by-spec."delayed-stream"."0.0.5" =
    self.by-version."delayed-stream"."0.0.5";
  by-version."delayed-stream"."0.0.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-delayed-stream-0.0.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/delayed-stream/-/delayed-stream-0.0.5.tgz";
        name = "delayed-stream-0.0.5.tgz";
        sha1 = "d4b1f43a93e8296dfe02694f4680bc37a313c73f";
      })
    ];
    buildInputs =
      (self.nativeDeps."delayed-stream" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "delayed-stream" ];
  };
  by-spec."di"."~0.0.1" =
    self.by-version."di"."0.0.1";
  by-version."di"."0.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-di-0.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/di/-/di-0.0.1.tgz";
        name = "di-0.0.1.tgz";
        sha1 = "806649326ceaa7caa3306d75d985ea2748ba913c";
      })
    ];
    buildInputs =
      (self.nativeDeps."di" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "di" ];
  };
  by-spec."diff"."1.0.7" =
    self.by-version."diff"."1.0.7";
  by-version."diff"."1.0.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-diff-1.0.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/diff/-/diff-1.0.7.tgz";
        name = "diff-1.0.7.tgz";
        sha1 = "24bbb001c4a7d5522169e7cabdb2c2814ed91cf4";
      })
    ];
    buildInputs =
      (self.nativeDeps."diff" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "diff" ];
  };
  by-spec."domelementtype"."1" =
    self.by-version."domelementtype"."1.1.1";
  by-version."domelementtype"."1.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-domelementtype-1.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/domelementtype/-/domelementtype-1.1.1.tgz";
        name = "domelementtype-1.1.1.tgz";
        sha1 = "7887acbda7614bb0a3dbe1b5e394f77a8ed297cf";
      })
    ];
    buildInputs =
      (self.nativeDeps."domelementtype" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "domelementtype" ];
  };
  by-spec."domhandler"."2.1" =
    self.by-version."domhandler"."2.1.0";
  by-version."domhandler"."2.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-domhandler-2.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/domhandler/-/domhandler-2.1.0.tgz";
        name = "domhandler-2.1.0.tgz";
        sha1 = "d2646f5e57f6c3bab11cf6cb05d3c0acf7412594";
      })
    ];
    buildInputs =
      (self.nativeDeps."domhandler" or []);
    deps = [
      self.by-version."domelementtype"."1.1.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "domhandler" ];
  };
  by-spec."domutils"."1.1" =
    self.by-version."domutils"."1.1.6";
  by-version."domutils"."1.1.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-domutils-1.1.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/domutils/-/domutils-1.1.6.tgz";
        name = "domutils-1.1.6.tgz";
        sha1 = "bddc3de099b9a2efacc51c623f28f416ecc57485";
      })
    ];
    buildInputs =
      (self.nativeDeps."domutils" or []);
    deps = [
      self.by-version."domelementtype"."1.1.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "domutils" ];
  };
  by-spec."es5-ext"."~0.9.2" =
    self.by-version."es5-ext"."0.9.2";
  by-version."es5-ext"."0.9.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-es5-ext-0.9.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/es5-ext/-/es5-ext-0.9.2.tgz";
        name = "es5-ext-0.9.2.tgz";
        sha1 = "d2e309d1f223b0718648835acf5b8823a8061f8a";
      })
    ];
    buildInputs =
      (self.nativeDeps."es5-ext" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "es5-ext" ];
  };
  by-spec."escodegen"."*" =
    self.by-version."escodegen"."1.2.0";
  by-version."escodegen"."1.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "escodegen-1.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/escodegen/-/escodegen-1.2.0.tgz";
        name = "escodegen-1.2.0.tgz";
        sha1 = "09de7967791cc958b7f89a2ddb6d23451af327e1";
      })
    ];
    buildInputs =
      (self.nativeDeps."escodegen" or []);
    deps = [
      self.by-version."esprima"."1.0.4"
      self.by-version."estraverse"."1.5.0"
      self.by-version."esutils"."1.0.0"
      self.by-version."source-map"."0.1.31"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "escodegen" ];
  };
  by-spec."escodegen"."0.0.23" =
    self.by-version."escodegen"."0.0.23";
  by-version."escodegen"."0.0.23" = lib.makeOverridable self.buildNodePackage {
    name = "escodegen-0.0.23";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/escodegen/-/escodegen-0.0.23.tgz";
        name = "escodegen-0.0.23.tgz";
        sha1 = "9acf978164368e42276571f18839c823b3a844df";
      })
    ];
    buildInputs =
      (self.nativeDeps."escodegen" or []);
    deps = [
      self.by-version."esprima"."1.0.4"
      self.by-version."estraverse"."0.0.4"
      self.by-version."source-map"."0.1.31"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "escodegen" ];
  };
  by-spec."escodegen"."1.0.x" =
    self.by-version."escodegen"."1.0.1";
  by-version."escodegen"."1.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "escodegen-1.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/escodegen/-/escodegen-1.0.1.tgz";
        name = "escodegen-1.0.1.tgz";
        sha1 = "84c92c4a07440271b90e6b78e620973bf721226e";
      })
    ];
    buildInputs =
      (self.nativeDeps."escodegen" or []);
    deps = [
      self.by-version."esprima"."1.0.4"
      self.by-version."estraverse"."1.5.0"
      self.by-version."esutils"."1.0.0"
      self.by-version."source-map"."0.1.31"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "escodegen" ];
  };
  by-spec."esprima"."1.0.x" =
    self.by-version."esprima"."1.0.4";
  by-version."esprima"."1.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "esprima-1.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/esprima/-/esprima-1.0.4.tgz";
        name = "esprima-1.0.4.tgz";
        sha1 = "9f557e08fc3b4d26ece9dd34f8fbf476b62585ad";
      })
    ];
    buildInputs =
      (self.nativeDeps."esprima" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "esprima" ];
  };
  by-spec."esprima"."~ 1.0.2" =
    self.by-version."esprima"."1.0.4";
  by-spec."esprima"."~1.0.0" =
    self.by-version."esprima"."1.0.4";
  by-spec."esprima"."~1.0.2" =
    self.by-version."esprima"."1.0.4";
  by-spec."esprima"."~1.0.4" =
    self.by-version."esprima"."1.0.4";
  by-spec."estraverse"."*" =
    self.by-version."estraverse"."1.5.0";
  by-version."estraverse"."1.5.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-estraverse-1.5.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/estraverse/-/estraverse-1.5.0.tgz";
        name = "estraverse-1.5.0.tgz";
        sha1 = "248ec3f0d4bf39a940109c92a05ceb56d59e53ee";
      })
    ];
    buildInputs =
      (self.nativeDeps."estraverse" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "estraverse" ];
  };
  by-spec."estraverse"."~0.0.4" =
    self.by-version."estraverse"."0.0.4";
  by-version."estraverse"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-estraverse-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/estraverse/-/estraverse-0.0.4.tgz";
        name = "estraverse-0.0.4.tgz";
        sha1 = "01a0932dfee574684a598af5a67c3bf9b6428db2";
      })
    ];
    buildInputs =
      (self.nativeDeps."estraverse" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "estraverse" ];
  };
  by-spec."estraverse"."~1.5.0" =
    self.by-version."estraverse"."1.5.0";
  by-spec."esutils"."~1.0.0" =
    self.by-version."esutils"."1.0.0";
  by-version."esutils"."1.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-esutils-1.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/esutils/-/esutils-1.0.0.tgz";
        name = "esutils-1.0.0.tgz";
        sha1 = "8151d358e20c8acc7fb745e7472c0025fe496570";
      })
    ];
    buildInputs =
      (self.nativeDeps."esutils" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "esutils" ];
  };
  by-spec."event-emitter"."~0.2.2" =
    self.by-version."event-emitter"."0.2.2";
  by-version."event-emitter"."0.2.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-event-emitter-0.2.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/event-emitter/-/event-emitter-0.2.2.tgz";
        name = "event-emitter-0.2.2.tgz";
        sha1 = "c81e3724eb55407c5a0d5ee3299411f700f54291";
      })
    ];
    buildInputs =
      (self.nativeDeps."event-emitter" or []);
    deps = [
      self.by-version."es5-ext"."0.9.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "event-emitter" ];
  };
  by-spec."eventemitter2"."~0.4.13" =
    self.by-version."eventemitter2"."0.4.13";
  by-version."eventemitter2"."0.4.13" = lib.makeOverridable self.buildNodePackage {
    name = "node-eventemitter2-0.4.13";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/eventemitter2/-/eventemitter2-0.4.13.tgz";
        name = "eventemitter2-0.4.13.tgz";
        sha1 = "0a8ab97f9c1b563361b8927f9e80606277509153";
      })
    ];
    buildInputs =
      (self.nativeDeps."eventemitter2" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "eventemitter2" ];
  };
  by-spec."exit"."~0.1.1" =
    self.by-version."exit"."0.1.2";
  by-version."exit"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-exit-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/exit/-/exit-0.1.2.tgz";
        name = "exit-0.1.2.tgz";
        sha1 = "0632638f8d877cc82107d30a0fff1a17cba1cd0c";
      })
    ];
    buildInputs =
      (self.nativeDeps."exit" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "exit" ];
  };
  by-spec."extend"."~1.2.1" =
    self.by-version."extend"."1.2.1";
  by-version."extend"."1.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-extend-1.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/extend/-/extend-1.2.1.tgz";
        name = "extend-1.2.1.tgz";
        sha1 = "a0f5fd6cfc83a5fe49ef698d60ec8a624dd4576c";
      })
    ];
    buildInputs =
      (self.nativeDeps."extend" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "extend" ];
  };
  "extend" = self.by-version."extend"."1.2.1";
  by-spec."file-utils"."~0.1.5" =
    self.by-version."file-utils"."0.1.5";
  by-version."file-utils"."0.1.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-file-utils-0.1.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/file-utils/-/file-utils-0.1.5.tgz";
        name = "file-utils-0.1.5.tgz";
        sha1 = "dc8153c855387cb4dacb0a1725531fa444a6b48c";
      })
    ];
    buildInputs =
      (self.nativeDeps."file-utils" or []);
    deps = [
      self.by-version."lodash"."2.1.0"
      self.by-version."iconv-lite"."0.2.11"
      self.by-version."rimraf"."2.2.6"
      self.by-version."glob"."3.2.8"
      self.by-version."minimatch"."0.2.14"
      self.by-version."findup-sync"."0.1.2"
      self.by-version."isbinaryfile"."0.1.9"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "file-utils" ];
  };
  by-spec."fileset"."0.1.x" =
    self.by-version."fileset"."0.1.5";
  by-version."fileset"."0.1.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-fileset-0.1.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/fileset/-/fileset-0.1.5.tgz";
        name = "fileset-0.1.5.tgz";
        sha1 = "acc423bfaf92843385c66bf75822264d11b7bd94";
      })
    ];
    buildInputs =
      (self.nativeDeps."fileset" or []);
    deps = [
      self.by-version."minimatch"."0.2.14"
      self.by-version."glob"."3.2.8"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "fileset" ];
  };
  by-spec."findup-sync"."~0.1.0" =
    self.by-version."findup-sync"."0.1.2";
  by-version."findup-sync"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-findup-sync-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/findup-sync/-/findup-sync-0.1.2.tgz";
        name = "findup-sync-0.1.2.tgz";
        sha1 = "da2b96ca9f800e5a13d0a11110f490b65f62e96d";
      })
    ];
    buildInputs =
      (self.nativeDeps."findup-sync" or []);
    deps = [
      self.by-version."glob"."3.1.21"
      self.by-version."lodash"."1.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "findup-sync" ];
  };
  by-spec."findup-sync"."~0.1.2" =
    self.by-version."findup-sync"."0.1.2";
  by-spec."forever-agent"."~0.2.0" =
    self.by-version."forever-agent"."0.2.0";
  by-version."forever-agent"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-forever-agent-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/forever-agent/-/forever-agent-0.2.0.tgz";
        name = "forever-agent-0.2.0.tgz";
        sha1 = "e1c25c7ad44e09c38f233876c76fcc24ff843b1f";
      })
    ];
    buildInputs =
      (self.nativeDeps."forever-agent" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "forever-agent" ];
  };
  by-spec."forever-agent"."~0.5.0" =
    self.by-version."forever-agent"."0.5.2";
  by-version."forever-agent"."0.5.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-forever-agent-0.5.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/forever-agent/-/forever-agent-0.5.2.tgz";
        name = "forever-agent-0.5.2.tgz";
        sha1 = "6d0e09c4921f94a27f63d3b49c5feff1ea4c5130";
      })
    ];
    buildInputs =
      (self.nativeDeps."forever-agent" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "forever-agent" ];
  };
  by-spec."form-data"."~0.0.3" =
    self.by-version."form-data"."0.0.10";
  by-version."form-data"."0.0.10" = lib.makeOverridable self.buildNodePackage {
    name = "node-form-data-0.0.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/form-data/-/form-data-0.0.10.tgz";
        name = "form-data-0.0.10.tgz";
        sha1 = "db345a5378d86aeeb1ed5d553b869ac192d2f5ed";
      })
    ];
    buildInputs =
      (self.nativeDeps."form-data" or []);
    deps = [
      self.by-version."combined-stream"."0.0.4"
      self.by-version."mime"."1.2.11"
      self.by-version."async"."0.2.10"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "form-data" ];
  };
  by-spec."form-data"."~0.1.0" =
    self.by-version."form-data"."0.1.2";
  by-version."form-data"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-form-data-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/form-data/-/form-data-0.1.2.tgz";
        name = "form-data-0.1.2.tgz";
        sha1 = "1143c21357911a78dd7913b189b4bab5d5d57445";
      })
    ];
    buildInputs =
      (self.nativeDeps."form-data" or []);
    deps = [
      self.by-version."combined-stream"."0.0.4"
      self.by-version."mime"."1.2.11"
      self.by-version."async"."0.2.10"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "form-data" ];
  };
  by-spec."fresh"."0.2.0" =
    self.by-version."fresh"."0.2.0";
  by-version."fresh"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-fresh-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/fresh/-/fresh-0.2.0.tgz";
        name = "fresh-0.2.0.tgz";
        sha1 = "bfd9402cf3df12c4a4c310c79f99a3dde13d34a7";
      })
    ];
    buildInputs =
      (self.nativeDeps."fresh" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "fresh" ];
  };
  by-spec."fstream"."~0.1.17" =
    self.by-version."fstream"."0.1.25";
  by-version."fstream"."0.1.25" = lib.makeOverridable self.buildNodePackage {
    name = "node-fstream-0.1.25";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/fstream/-/fstream-0.1.25.tgz";
        name = "fstream-0.1.25.tgz";
        sha1 = "deef2db7c7898357c2b37202212a9e5b36abc732";
      })
    ];
    buildInputs =
      (self.nativeDeps."fstream" or []);
    deps = [
      self.by-version."rimraf"."2.2.6"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."inherits"."2.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "fstream" ];
  };
  by-spec."fstream"."~0.1.22" =
    self.by-version."fstream"."0.1.25";
  by-spec."fstream"."~0.1.8" =
    self.by-version."fstream"."0.1.25";
  by-spec."fstream-ignore"."~0.0.6" =
    self.by-version."fstream-ignore"."0.0.7";
  by-version."fstream-ignore"."0.0.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-fstream-ignore-0.0.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/fstream-ignore/-/fstream-ignore-0.0.7.tgz";
        name = "fstream-ignore-0.0.7.tgz";
        sha1 = "eea3033f0c3728139de7b57ab1b0d6d89c353c63";
      })
    ];
    buildInputs =
      (self.nativeDeps."fstream-ignore" or []);
    deps = [
      self.by-version."minimatch"."0.2.14"
      self.by-version."fstream"."0.1.25"
      self.by-version."inherits"."2.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "fstream-ignore" ];
  };
  by-spec."getobject"."~0.1.0" =
    self.by-version."getobject"."0.1.0";
  by-version."getobject"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-getobject-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/getobject/-/getobject-0.1.0.tgz";
        name = "getobject-0.1.0.tgz";
        sha1 = "047a449789fa160d018f5486ed91320b6ec7885c";
      })
    ];
    buildInputs =
      (self.nativeDeps."getobject" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "getobject" ];
  };
  by-spec."glob"."3.2.3" =
    self.by-version."glob"."3.2.3";
  by-version."glob"."3.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-glob-3.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/glob/-/glob-3.2.3.tgz";
        name = "glob-3.2.3.tgz";
        sha1 = "e313eeb249c7affaa5c475286b0e115b59839467";
      })
    ];
    buildInputs =
      (self.nativeDeps."glob" or []);
    deps = [
      self.by-version."minimatch"."0.2.14"
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."inherits"."2.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "glob" ];
  };
  by-spec."glob"."3.x" =
    self.by-version."glob"."3.2.8";
  by-version."glob"."3.2.8" = lib.makeOverridable self.buildNodePackage {
    name = "node-glob-3.2.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/glob/-/glob-3.2.8.tgz";
        name = "glob-3.2.8.tgz";
        sha1 = "5506f4311721bcc618c7d8dba144188750307073";
      })
    ];
    buildInputs =
      (self.nativeDeps."glob" or []);
    deps = [
      self.by-version."minimatch"."0.2.14"
      self.by-version."inherits"."2.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "glob" ];
  };
  by-spec."glob".">= 3.1.4" =
    self.by-version."glob"."3.2.8";
  by-spec."glob"."~3.1.21" =
    self.by-version."glob"."3.1.21";
  by-version."glob"."3.1.21" = lib.makeOverridable self.buildNodePackage {
    name = "node-glob-3.1.21";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/glob/-/glob-3.1.21.tgz";
        name = "glob-3.1.21.tgz";
        sha1 = "d29e0a055dea5138f4d07ed40e8982e83c2066cd";
      })
    ];
    buildInputs =
      (self.nativeDeps."glob" or []);
    deps = [
      self.by-version."minimatch"."0.2.14"
      self.by-version."graceful-fs"."1.2.3"
      self.by-version."inherits"."1.0.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "glob" ];
  };
  by-spec."glob"."~3.2.1" =
    self.by-version."glob"."3.2.8";
  by-spec."glob"."~3.2.6" =
    self.by-version."glob"."3.2.8";
  by-spec."glob"."~3.2.7" =
    self.by-version."glob"."3.2.8";
  by-spec."graceful-fs"."~1.1" =
    self.by-version."graceful-fs"."1.1.14";
  by-version."graceful-fs"."1.1.14" = lib.makeOverridable self.buildNodePackage {
    name = "node-graceful-fs-1.1.14";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.14.tgz";
        name = "graceful-fs-1.1.14.tgz";
        sha1 = "07078db5f6377f6321fceaaedf497de124dc9465";
      })
    ];
    buildInputs =
      (self.nativeDeps."graceful-fs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "graceful-fs" ];
  };
  by-spec."graceful-fs"."~1.2.0" =
    self.by-version."graceful-fs"."1.2.3";
  by-version."graceful-fs"."1.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-graceful-fs-1.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/graceful-fs/-/graceful-fs-1.2.3.tgz";
        name = "graceful-fs-1.2.3.tgz";
        sha1 = "15a4806a57547cb2d2dbf27f42e89a8c3451b364";
      })
    ];
    buildInputs =
      (self.nativeDeps."graceful-fs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "graceful-fs" ];
  };
  by-spec."graceful-fs"."~2.0.0" =
    self.by-version."graceful-fs"."2.0.1";
  by-version."graceful-fs"."2.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-graceful-fs-2.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/graceful-fs/-/graceful-fs-2.0.1.tgz";
        name = "graceful-fs-2.0.1.tgz";
        sha1 = "7fd6e0a4837c35d0cc15330294d9584a3898cf84";
      })
    ];
    buildInputs =
      (self.nativeDeps."graceful-fs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "graceful-fs" ];
  };
  by-spec."graceful-fs"."~2.0.1" =
    self.by-version."graceful-fs"."2.0.1";
  by-spec."growl"."1.7.x" =
    self.by-version."growl"."1.7.0";
  by-version."growl"."1.7.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-growl-1.7.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/growl/-/growl-1.7.0.tgz";
        name = "growl-1.7.0.tgz";
        sha1 = "de2d66136d002e112ba70f3f10c31cf7c350b2da";
      })
    ];
    buildInputs =
      (self.nativeDeps."growl" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "growl" ];
  };
  by-spec."grunt"."0.4.x" =
    self.by-version."grunt"."0.4.2";
  by-version."grunt"."0.4.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-0.4.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt/-/grunt-0.4.2.tgz";
        name = "grunt-0.4.2.tgz";
        sha1 = "895b4f28a6102bffd41d365a65e8be2d6a293d93";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt" or []);
    deps = [
      self.by-version."async"."0.1.22"
      self.by-version."coffee-script"."1.3.3"
      self.by-version."colors"."0.6.2"
      self.by-version."dateformat"."1.0.2-1.2.3"
      self.by-version."eventemitter2"."0.4.13"
      self.by-version."findup-sync"."0.1.2"
      self.by-version."glob"."3.1.21"
      self.by-version."hooker"."0.2.3"
      self.by-version."iconv-lite"."0.2.11"
      self.by-version."minimatch"."0.2.14"
      self.by-version."nopt"."1.0.10"
      self.by-version."rimraf"."2.0.3"
      self.by-version."lodash"."0.9.2"
      self.by-version."underscore.string"."2.2.1"
      self.by-version."which"."1.0.5"
      self.by-version."js-yaml"."2.0.5"
      self.by-version."exit"."0.1.2"
      self.by-version."getobject"."0.1.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "grunt" ];
  };
  by-spec."grunt"."~0.4" =
    self.by-version."grunt"."0.4.2";
  by-spec."grunt"."~0.4.0" =
    self.by-version."grunt"."0.4.2";
  by-spec."grunt"."~0.4.2" =
    self.by-version."grunt"."0.4.2";
  "grunt" = self.by-version."grunt"."0.4.2";
  by-spec."grunt-cli"."~0.1.11" =
    self.by-version."grunt-cli"."0.1.13";
  by-version."grunt-cli"."0.1.13" = lib.makeOverridable self.buildNodePackage {
    name = "grunt-cli-0.1.13";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-cli/-/grunt-cli-0.1.13.tgz";
        name = "grunt-cli-0.1.13.tgz";
        sha1 = "e9ebc4047631f5012d922770c39378133cad10f4";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-cli" or []);
    deps = [
      self.by-version."nopt"."1.0.10"
      self.by-version."findup-sync"."0.1.2"
      self.by-version."resolve"."0.3.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "grunt-cli" ];
  };
  "grunt-cli" = self.by-version."grunt-cli"."0.1.13";
  by-spec."grunt-contrib-copy"."~0.5.0" =
    self.by-version."grunt-contrib-copy"."0.5.0";
  by-version."grunt-contrib-copy"."0.5.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-contrib-copy-0.5.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-contrib-copy/-/grunt-contrib-copy-0.5.0.tgz";
        name = "grunt-contrib-copy-0.5.0.tgz";
        sha1 = "410075ac45a5856ba191b1cc725725450d4a0215";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-contrib-copy" or []);
    deps = [
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
    ];
    passthru.names = [ "grunt-contrib-copy" ];
  };
  "grunt-contrib-copy" = self.by-version."grunt-contrib-copy"."0.5.0";
  by-spec."grunt-contrib-jshint"."~0.8.0" =
    self.by-version."grunt-contrib-jshint"."0.8.0";
  by-version."grunt-contrib-jshint"."0.8.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-contrib-jshint-0.8.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-contrib-jshint/-/grunt-contrib-jshint-0.8.0.tgz";
        name = "grunt-contrib-jshint-0.8.0.tgz";
        sha1 = "6bd52325dcce1d995dbbf648030c59e1a606acda";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-contrib-jshint" or []);
    deps = [
      self.by-version."jshint"."2.4.3"
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
    ];
    passthru.names = [ "grunt-contrib-jshint" ];
  };
  "grunt-contrib-jshint" = self.by-version."grunt-contrib-jshint"."0.8.0";
  by-spec."grunt-contrib-less"."~0.9.0" =
    self.by-version."grunt-contrib-less"."0.9.0";
  by-version."grunt-contrib-less"."0.9.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-contrib-less-0.9.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-contrib-less/-/grunt-contrib-less-0.9.0.tgz";
        name = "grunt-contrib-less-0.9.0.tgz";
        sha1 = "af1e6e76511c2bc328ef8d284058643ca5887675";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-contrib-less" or []);
    deps = [
      self.by-version."less"."1.6.3"
      self.by-version."grunt-lib-contrib"."0.6.1"
      self.by-version."chalk"."0.4.0"
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
    ];
    passthru.names = [ "grunt-contrib-less" ];
  };
  "grunt-contrib-less" = self.by-version."grunt-contrib-less"."0.9.0";
  by-spec."grunt-contrib-requirejs"."~0.4.1" =
    self.by-version."grunt-contrib-requirejs"."0.4.1";
  by-version."grunt-contrib-requirejs"."0.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-contrib-requirejs-0.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-contrib-requirejs/-/grunt-contrib-requirejs-0.4.1.tgz";
        name = "grunt-contrib-requirejs-0.4.1.tgz";
        sha1 = "862ba167141b8a8f36af5444feab3272bb8cf4bd";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-contrib-requirejs" or []);
    deps = [
      self.by-version."requirejs"."2.1.10"
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
    ];
    passthru.names = [ "grunt-contrib-requirejs" ];
  };
  "grunt-contrib-requirejs" = self.by-version."grunt-contrib-requirejs"."0.4.1";
  by-spec."grunt-contrib-uglify"."~0.3.2" =
    self.by-version."grunt-contrib-uglify"."0.3.2";
  by-version."grunt-contrib-uglify"."0.3.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-contrib-uglify-0.3.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-contrib-uglify/-/grunt-contrib-uglify-0.3.2.tgz";
        name = "grunt-contrib-uglify-0.3.2.tgz";
        sha1 = "865b00ae0d11d1f5fafca3967c9b099f8929684b";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-contrib-uglify" or []);
    deps = [
      self.by-version."uglify-js"."2.4.12"
      self.by-version."grunt-lib-contrib"."0.6.1"
      self.by-version."chalk"."0.4.0"
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
    ];
    passthru.names = [ "grunt-contrib-uglify" ];
  };
  "grunt-contrib-uglify" = self.by-version."grunt-contrib-uglify"."0.3.2";
  by-spec."grunt-karma"."~0.7.2" =
    self.by-version."grunt-karma"."0.7.2";
  by-version."grunt-karma"."0.7.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-karma-0.7.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-karma/-/grunt-karma-0.7.2.tgz";
        name = "grunt-karma-0.7.2.tgz";
        sha1 = "1d041d9833671c2bca671cd66bd874c96b2a631e";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-karma" or []);
    deps = [
      self.by-version."optimist"."0.6.1"
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "grunt-karma" ];
  };
  "grunt-karma" = self.by-version."grunt-karma"."0.7.2";
  by-spec."grunt-lib-contrib"."~0.6.1" =
    self.by-version."grunt-lib-contrib"."0.6.1";
  by-version."grunt-lib-contrib"."0.6.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-lib-contrib-0.6.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-lib-contrib/-/grunt-lib-contrib-0.6.1.tgz";
        name = "grunt-lib-contrib-0.6.1.tgz";
        sha1 = "3f56adb7da06e814795ee2415b0ebe5fb8903ebb";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-lib-contrib" or []);
    deps = [
      self.by-version."zlib-browserify"."0.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "grunt-lib-contrib" ];
  };
  by-spec."grunt-sed"."~0.1.1" =
    self.by-version."grunt-sed"."0.1.1";
  by-version."grunt-sed"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-grunt-sed-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/grunt-sed/-/grunt-sed-0.1.1.tgz";
        name = "grunt-sed-0.1.1.tgz";
        sha1 = "2613d486909319b3f8f4bd75dafb46a642ec3f82";
      })
    ];
    buildInputs =
      (self.nativeDeps."grunt-sed" or []);
    deps = [
      self.by-version."replace"."0.2.9"
    ];
    peerDependencies = [
      self.by-version."grunt"."0.4.2"
    ];
    passthru.names = [ "grunt-sed" ];
  };
  "grunt-sed" = self.by-version."grunt-sed"."0.1.1";
  by-spec."handlebars"."1.0.x" =
    self.by-version."handlebars"."1.0.12";
  by-version."handlebars"."1.0.12" = lib.makeOverridable self.buildNodePackage {
    name = "handlebars-1.0.12";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/handlebars/-/handlebars-1.0.12.tgz";
        name = "handlebars-1.0.12.tgz";
        sha1 = "18c6d3440c35e91b19b3ff582b9151ab4985d4fc";
      })
    ];
    buildInputs =
      (self.nativeDeps."handlebars" or []);
    deps = [
      self.by-version."optimist"."0.3.7"
      self.by-version."uglify-js"."2.3.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "handlebars" ];
  };
  by-spec."handlebars"."1.3.x" =
    self.by-version."handlebars"."1.3.0";
  by-version."handlebars"."1.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "handlebars-1.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/handlebars/-/handlebars-1.3.0.tgz";
        name = "handlebars-1.3.0.tgz";
        sha1 = "9e9b130a93e389491322d975cf3ec1818c37ce34";
      })
    ];
    buildInputs =
      (self.nativeDeps."handlebars" or []);
    deps = [
      self.by-version."optimist"."0.3.7"
      self.by-version."uglify-js"."2.3.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "handlebars" ];
  };
  by-spec."handlebars"."~1.0.11" =
    self.by-version."handlebars"."1.0.12";
  by-spec."has-color"."~0.1.0" =
    self.by-version."has-color"."0.1.4";
  by-version."has-color"."0.1.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-has-color-0.1.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/has-color/-/has-color-0.1.4.tgz";
        name = "has-color-0.1.4.tgz";
        sha1 = "d1dadeea5b9e8b446bf08603532333710c95a290";
      })
    ];
    buildInputs =
      (self.nativeDeps."has-color" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "has-color" ];
  };
  by-spec."hawk"."~0.10.0" =
    self.by-version."hawk"."0.10.2";
  by-version."hawk"."0.10.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-hawk-0.10.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/hawk/-/hawk-0.10.2.tgz";
        name = "hawk-0.10.2.tgz";
        sha1 = "9b361dee95a931640e6d504e05609a8fc3ac45d2";
      })
    ];
    buildInputs =
      (self.nativeDeps."hawk" or []);
    deps = [
      self.by-version."hoek"."0.7.6"
      self.by-version."boom"."0.3.8"
      self.by-version."cryptiles"."0.1.3"
      self.by-version."sntp"."0.1.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "hawk" ];
  };
  by-spec."hawk"."~1.0.0" =
    self.by-version."hawk"."1.0.0";
  by-version."hawk"."1.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-hawk-1.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/hawk/-/hawk-1.0.0.tgz";
        name = "hawk-1.0.0.tgz";
        sha1 = "b90bb169807285411da7ffcb8dd2598502d3b52d";
      })
    ];
    buildInputs =
      (self.nativeDeps."hawk" or []);
    deps = [
      self.by-version."hoek"."0.9.1"
      self.by-version."boom"."0.4.2"
      self.by-version."cryptiles"."0.2.2"
      self.by-version."sntp"."0.2.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "hawk" ];
  };
  by-spec."hoek"."0.7.x" =
    self.by-version."hoek"."0.7.6";
  by-version."hoek"."0.7.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-hoek-0.7.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/hoek/-/hoek-0.7.6.tgz";
        name = "hoek-0.7.6.tgz";
        sha1 = "60fbd904557541cd2b8795abf308a1b3770e155a";
      })
    ];
    buildInputs =
      (self.nativeDeps."hoek" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "hoek" ];
  };
  by-spec."hoek"."0.9.x" =
    self.by-version."hoek"."0.9.1";
  by-version."hoek"."0.9.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-hoek-0.9.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/hoek/-/hoek-0.9.1.tgz";
        name = "hoek-0.9.1.tgz";
        sha1 = "3d322462badf07716ea7eb85baf88079cddce505";
      })
    ];
    buildInputs =
      (self.nativeDeps."hoek" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "hoek" ];
  };
  by-spec."hooker"."~0.2.3" =
    self.by-version."hooker"."0.2.3";
  by-version."hooker"."0.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-hooker-0.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/hooker/-/hooker-0.2.3.tgz";
        name = "hooker-0.2.3.tgz";
        sha1 = "b834f723cc4a242aa65963459df6d984c5d3d959";
      })
    ];
    buildInputs =
      (self.nativeDeps."hooker" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "hooker" ];
  };
  by-spec."htmlparser2"."3.3.x" =
    self.by-version."htmlparser2"."3.3.0";
  by-version."htmlparser2"."3.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-htmlparser2-3.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/htmlparser2/-/htmlparser2-3.3.0.tgz";
        name = "htmlparser2-3.3.0.tgz";
        sha1 = "cc70d05a59f6542e43f0e685c982e14c924a9efe";
      })
    ];
    buildInputs =
      (self.nativeDeps."htmlparser2" or []);
    deps = [
      self.by-version."domhandler"."2.1.0"
      self.by-version."domutils"."1.1.6"
      self.by-version."domelementtype"."1.1.1"
      self.by-version."readable-stream"."1.0.25"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "htmlparser2" ];
  };
  by-spec."http-proxy"."~0.10" =
    self.by-version."http-proxy"."0.10.4";
  by-version."http-proxy"."0.10.4" = lib.makeOverridable self.buildNodePackage {
    name = "http-proxy-0.10.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/http-proxy/-/http-proxy-0.10.4.tgz";
        name = "http-proxy-0.10.4.tgz";
        sha1 = "14ba0ceaa2197f89fa30dea9e7b09e19cd93c22f";
      })
    ];
    buildInputs =
      (self.nativeDeps."http-proxy" or []);
    deps = [
      self.by-version."colors"."0.6.2"
      self.by-version."optimist"."0.6.1"
      self.by-version."pkginfo"."0.3.0"
      self.by-version."utile"."0.2.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "http-proxy" ];
  };
  by-spec."http-signature"."~0.10.0" =
    self.by-version."http-signature"."0.10.0";
  by-version."http-signature"."0.10.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-http-signature-0.10.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/http-signature/-/http-signature-0.10.0.tgz";
        name = "http-signature-0.10.0.tgz";
        sha1 = "1494e4f5000a83c0f11bcc12d6007c530cb99582";
      })
    ];
    buildInputs =
      (self.nativeDeps."http-signature" or []);
    deps = [
      self.by-version."assert-plus"."0.1.2"
      self.by-version."asn1"."0.1.11"
      self.by-version."ctype"."0.5.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "http-signature" ];
  };
  by-spec."i"."0.3.x" =
    self.by-version."i"."0.3.2";
  by-version."i"."0.3.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-i-0.3.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/i/-/i-0.3.2.tgz";
        name = "i-0.3.2.tgz";
        sha1 = "b2e2d6ef47900bd924e281231ff4c5cc798d9ea8";
      })
    ];
    buildInputs =
      (self.nativeDeps."i" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "i" ];
  };
  by-spec."ibrik"."~1.0.1" =
    self.by-version."ibrik"."1.0.1";
  by-version."ibrik"."1.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "ibrik-1.0.1";
    src = [
      (self.patchSource fetchurl {
        url = "http://registry.npmjs.org/ibrik/-/ibrik-1.0.1.tgz";
        name = "ibrik-1.0.1.tgz";
        sha1 = "ba9c0cf9302c51a812dc4a92038b3de579c0aefb";
      })
    ];
    buildInputs =
      (self.nativeDeps."ibrik" or []);
    deps = [
      self.by-version."coffee-script-redux"."2.0.0-beta4"
      self.by-version."istanbul"."0.2.4"
      self.by-version."optimist"."0.6.1"
      self.by-version."escodegen"."1.2.0"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."which"."1.0.5"
      self.by-version."estraverse"."1.5.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ibrik" ];
  };
  by-spec."iconv-lite"."~0.2.11" =
    self.by-version."iconv-lite"."0.2.11";
  by-version."iconv-lite"."0.2.11" = lib.makeOverridable self.buildNodePackage {
    name = "node-iconv-lite-0.2.11";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/iconv-lite/-/iconv-lite-0.2.11.tgz";
        name = "iconv-lite-0.2.11.tgz";
        sha1 = "1ce60a3a57864a292d1321ff4609ca4bb965adc8";
      })
    ];
    buildInputs =
      (self.nativeDeps."iconv-lite" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "iconv-lite" ];
  };
  by-spec."inherits"."1" =
    self.by-version."inherits"."1.0.0";
  by-version."inherits"."1.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-inherits-1.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/inherits/-/inherits-1.0.0.tgz";
        name = "inherits-1.0.0.tgz";
        sha1 = "38e1975285bf1f7ba9c84da102bb12771322ac48";
      })
    ];
    buildInputs =
      (self.nativeDeps."inherits" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "inherits" ];
  };
  by-spec."inherits"."2" =
    self.by-version."inherits"."2.0.1";
  by-version."inherits"."2.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-inherits-2.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/inherits/-/inherits-2.0.1.tgz";
        name = "inherits-2.0.1.tgz";
        sha1 = "b17d08d326b4423e568eff719f91b0b1cbdf69f1";
      })
    ];
    buildInputs =
      (self.nativeDeps."inherits" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "inherits" ];
  };
  by-spec."inherits"."~1.0.0" =
    self.by-version."inherits"."1.0.0";
  by-spec."inherits"."~2.0.0" =
    self.by-version."inherits"."2.0.1";
  by-spec."ini"."1" =
    self.by-version."ini"."1.1.0";
  by-version."ini"."1.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-ini-1.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ini/-/ini-1.1.0.tgz";
        name = "ini-1.1.0.tgz";
        sha1 = "4e808c2ce144c6c1788918e034d6797bc6cf6281";
      })
    ];
    buildInputs =
      (self.nativeDeps."ini" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ini" ];
  };
  by-spec."ini"."~1.1.0" =
    self.by-version."ini"."1.1.0";
  by-spec."inquirer"."~0.3.0" =
    self.by-version."inquirer"."0.3.5";
  by-version."inquirer"."0.3.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-inquirer-0.3.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/inquirer/-/inquirer-0.3.5.tgz";
        name = "inquirer-0.3.5.tgz";
        sha1 = "a78be064ac9abf168147c02169a931d9a483a9f6";
      })
    ];
    buildInputs =
      (self.nativeDeps."inquirer" or []);
    deps = [
      self.by-version."lodash"."1.2.1"
      self.by-version."async"."0.2.10"
      self.by-version."cli-color"."0.2.3"
      self.by-version."mute-stream"."0.0.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "inquirer" ];
  };
  by-spec."intersect"."~0.0.3" =
    self.by-version."intersect"."0.0.3";
  by-version."intersect"."0.0.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-intersect-0.0.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/intersect/-/intersect-0.0.3.tgz";
        name = "intersect-0.0.3.tgz";
        sha1 = "c1a4a5e5eac6ede4af7504cc07e0ada7bc9f4920";
      })
    ];
    buildInputs =
      (self.nativeDeps."intersect" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "intersect" ];
  };
  by-spec."isbinaryfile"."~0.1.9" =
    self.by-version."isbinaryfile"."0.1.9";
  by-version."isbinaryfile"."0.1.9" = lib.makeOverridable self.buildNodePackage {
    name = "node-isbinaryfile-0.1.9";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/isbinaryfile/-/isbinaryfile-0.1.9.tgz";
        name = "isbinaryfile-0.1.9.tgz";
        sha1 = "15eece35c4ab708d8924da99fb874f2b5cc0b6c4";
      })
    ];
    buildInputs =
      (self.nativeDeps."isbinaryfile" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "isbinaryfile" ];
  };
  by-spec."istanbul"."*" =
    self.by-version."istanbul"."0.2.4";
  by-version."istanbul"."0.2.4" = lib.makeOverridable self.buildNodePackage {
    name = "istanbul-0.2.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/istanbul/-/istanbul-0.2.4.tgz";
        name = "istanbul-0.2.4.tgz";
        sha1 = "faaaa400f2cf652c3dc8b3d9484b44a5528e3a04";
      })
    ];
    buildInputs =
      (self.nativeDeps."istanbul" or []);
    deps = [
      self.by-version."esprima"."1.0.4"
      self.by-version."escodegen"."1.0.1"
      self.by-version."handlebars"."1.3.0"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."nopt"."2.1.2"
      self.by-version."fileset"."0.1.5"
      self.by-version."which"."1.0.5"
      self.by-version."async"."0.2.10"
      self.by-version."abbrev"."1.0.4"
      self.by-version."wordwrap"."0.0.2"
      self.by-version."resolve"."0.6.1"
      self.by-version."js-yaml"."3.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "istanbul" ];
  };
  by-spec."istanbul"."~0.1.45" =
    self.by-version."istanbul"."0.1.46";
  by-version."istanbul"."0.1.46" = lib.makeOverridable self.buildNodePackage {
    name = "istanbul-0.1.46";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/istanbul/-/istanbul-0.1.46.tgz";
        name = "istanbul-0.1.46.tgz";
        sha1 = "cefeb1c787d125a6db23bd0f63b0eb9390b0b40d";
      })
    ];
    buildInputs =
      (self.nativeDeps."istanbul" or []);
    deps = [
      self.by-version."esprima"."1.0.4"
      self.by-version."escodegen"."0.0.23"
      self.by-version."handlebars"."1.0.12"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."nopt"."2.1.2"
      self.by-version."fileset"."0.1.5"
      self.by-version."which"."1.0.5"
      self.by-version."async"."0.2.10"
      self.by-version."abbrev"."1.0.4"
      self.by-version."wordwrap"."0.0.2"
      self.by-version."resolve"."0.5.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "istanbul" ];
  };
  by-spec."jade"."0.26.3" =
    self.by-version."jade"."0.26.3";
  by-version."jade"."0.26.3" = lib.makeOverridable self.buildNodePackage {
    name = "jade-0.26.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/jade/-/jade-0.26.3.tgz";
        name = "jade-0.26.3.tgz";
        sha1 = "8f10d7977d8d79f2f6ff862a81b0513ccb25686c";
      })
    ];
    buildInputs =
      (self.nativeDeps."jade" or []);
    deps = [
      self.by-version."commander"."0.6.1"
      self.by-version."mkdirp"."0.3.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "jade" ];
  };
  by-spec."jedediah"."~0.1.0" =
    self.by-version."jedediah"."0.1.1";
  by-version."jedediah"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-jedediah-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/jedediah/-/jedediah-0.1.1.tgz";
        name = "jedediah-0.1.1.tgz";
        sha1 = "51f33021ebec6847d844cb53bbc086ee38877f84";
      })
    ];
    buildInputs =
      (self.nativeDeps."jedediah" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "jedediah" ];
  };
  by-spec."js-yaml"."3.x" =
    self.by-version."js-yaml"."3.0.1";
  by-version."js-yaml"."3.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "js-yaml-3.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/js-yaml/-/js-yaml-3.0.1.tgz";
        name = "js-yaml-3.0.1.tgz";
        sha1 = "76405fea5bce30fc8f405d48c6dca7f0a32c6afe";
      })
    ];
    buildInputs =
      (self.nativeDeps."js-yaml" or []);
    deps = [
      self.by-version."argparse"."0.1.15"
      self.by-version."esprima"."1.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "js-yaml" ];
  };
  by-spec."js-yaml"."~2.0.5" =
    self.by-version."js-yaml"."2.0.5";
  by-version."js-yaml"."2.0.5" = lib.makeOverridable self.buildNodePackage {
    name = "js-yaml-2.0.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/js-yaml/-/js-yaml-2.0.5.tgz";
        name = "js-yaml-2.0.5.tgz";
        sha1 = "a25ae6509999e97df278c6719da11bd0687743a8";
      })
    ];
    buildInputs =
      (self.nativeDeps."js-yaml" or []);
    deps = [
      self.by-version."argparse"."0.1.15"
      self.by-version."esprima"."1.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "js-yaml" ];
  };
  by-spec."js-yaml"."~2.1.0" =
    self.by-version."js-yaml"."2.1.3";
  by-version."js-yaml"."2.1.3" = lib.makeOverridable self.buildNodePackage {
    name = "js-yaml-2.1.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/js-yaml/-/js-yaml-2.1.3.tgz";
        name = "js-yaml-2.1.3.tgz";
        sha1 = "0ffb5617be55525878063d7a16aee7fdd282e84c";
      })
    ];
    buildInputs =
      (self.nativeDeps."js-yaml" or []);
    deps = [
      self.by-version."argparse"."0.1.15"
      self.by-version."esprima"."1.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "js-yaml" ];
  };
  by-spec."jshint"."~2.4.0" =
    self.by-version."jshint"."2.4.3";
  by-version."jshint"."2.4.3" = lib.makeOverridable self.buildNodePackage {
    name = "jshint-2.4.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/jshint/-/jshint-2.4.3.tgz";
        name = "jshint-2.4.3.tgz";
        sha1 = "1beb074b4d9f817773bb5aa16882fd67164c216a";
      })
    ];
    buildInputs =
      (self.nativeDeps."jshint" or []);
    deps = [
      self.by-version."shelljs"."0.1.4"
      self.by-version."underscore"."1.4.4"
      self.by-version."cli"."0.4.5"
      self.by-version."minimatch"."0.2.14"
      self.by-version."htmlparser2"."3.3.0"
      self.by-version."console-browserify"."0.1.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "jshint" ];
  };
  by-spec."json-stringify-safe"."~3.0.0" =
    self.by-version."json-stringify-safe"."3.0.0";
  by-version."json-stringify-safe"."3.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-json-stringify-safe-3.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-3.0.0.tgz";
        name = "json-stringify-safe-3.0.0.tgz";
        sha1 = "9db7b0e530c7f289c5e8c8432af191c2ff75a5b3";
      })
    ];
    buildInputs =
      (self.nativeDeps."json-stringify-safe" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "json-stringify-safe" ];
  };
  by-spec."json-stringify-safe"."~5.0.0" =
    self.by-version."json-stringify-safe"."5.0.0";
  by-version."json-stringify-safe"."5.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-json-stringify-safe-5.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-5.0.0.tgz";
        name = "json-stringify-safe-5.0.0.tgz";
        sha1 = "4c1f228b5050837eba9d21f50c2e6e320624566e";
      })
    ];
    buildInputs =
      (self.nativeDeps."json-stringify-safe" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "json-stringify-safe" ];
  };
  by-spec."junk"."~0.2.0" =
    self.by-version."junk"."0.2.2";
  by-version."junk"."0.2.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-junk-0.2.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/junk/-/junk-0.2.2.tgz";
        name = "junk-0.2.2.tgz";
        sha1 = "d595eb199b37930cecd1f2c52820847e80e48ae7";
      })
    ];
    buildInputs =
      (self.nativeDeps."junk" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "junk" ];
  };
  by-spec."karma".">=0.11.11" =
    self.by-version."karma"."0.11.14";
  by-version."karma"."0.11.14" = lib.makeOverridable self.buildNodePackage {
    name = "karma-0.11.14";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma/-/karma-0.11.14.tgz";
        name = "karma-0.11.14.tgz";
        sha1 = "2f6f81611bfe62e588d4e1d63c14f3928971a77c";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma" or []);
    deps = [
      self.by-version."di"."0.0.1"
      self.by-version."socket.io"."0.9.16"
      self.by-version."chokidar"."0.8.1"
      self.by-version."glob"."3.2.8"
      self.by-version."minimatch"."0.2.14"
      self.by-version."http-proxy"."0.10.4"
      self.by-version."optimist"."0.6.1"
      self.by-version."coffee-script"."1.6.3"
      self.by-version."rimraf"."2.2.6"
      self.by-version."q"."0.9.7"
      self.by-version."colors"."0.6.2"
      self.by-version."lodash"."2.4.1"
      self.by-version."mime"."1.2.11"
      self.by-version."log4js"."0.6.10"
      self.by-version."useragent"."2.0.7"
      self.by-version."graceful-fs"."2.0.1"
      self.by-version."connect"."2.12.0"
      self.by-version."source-map"."0.1.31"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "karma" ];
  };
  by-spec."karma".">=0.9" =
    self.by-version."karma"."0.11.14";
  by-spec."karma".">=0.9.3" =
    self.by-version."karma"."0.11.14";
  by-spec."karma"."~0.11.0" =
    self.by-version."karma"."0.11.14";
  by-spec."karma"."~0.11.13" =
    self.by-version."karma"."0.11.14";
  "karma" = self.by-version."karma"."0.11.14";
  by-spec."karma-chrome-launcher"."~0.1.2" =
    self.by-version."karma-chrome-launcher"."0.1.2";
  by-version."karma-chrome-launcher"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-chrome-launcher-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-chrome-launcher/-/karma-chrome-launcher-0.1.2.tgz";
        name = "karma-chrome-launcher-0.1.2.tgz";
        sha1 = "f7154d03be01f4c246368d56d43d7232e14ccce6";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-chrome-launcher" or []);
    deps = [
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "karma-chrome-launcher" ];
  };
  "karma-chrome-launcher" = self.by-version."karma-chrome-launcher"."0.1.2";
  by-spec."karma-coverage"."~0.1.5" =
    self.by-version."karma-coverage"."0.1.5";
  by-version."karma-coverage"."0.1.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-coverage-0.1.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-coverage/-/karma-coverage-0.1.5.tgz";
        name = "karma-coverage-0.1.5.tgz";
        sha1 = "a4dcbe87d4a7765456ca64218b5f0601018e1371";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-coverage" or []);
    deps = [
      self.by-version."istanbul"."0.1.46"
      self.by-version."ibrik"."1.0.1"
      self.by-version."dateformat"."1.0.7-1.2.3"
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "karma-coverage" ];
  };
  "karma-coverage" = self.by-version."karma-coverage"."0.1.5";
  by-spec."karma-junit-reporter"."~0.2.1" =
    self.by-version."karma-junit-reporter"."0.2.1";
  by-version."karma-junit-reporter"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-junit-reporter-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-junit-reporter/-/karma-junit-reporter-0.2.1.tgz";
        name = "karma-junit-reporter-0.2.1.tgz";
        sha1 = "ae125962683a0d1286dc7768fbf66a8f02e448fc";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-junit-reporter" or []);
    deps = [
      self.by-version."xmlbuilder"."0.4.2"
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "karma-junit-reporter" ];
  };
  "karma-junit-reporter" = self.by-version."karma-junit-reporter"."0.2.1";
  by-spec."karma-mocha"."~0.1.1" =
    self.by-version."karma-mocha"."0.1.1";
  by-version."karma-mocha"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-mocha-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-mocha/-/karma-mocha-0.1.1.tgz";
        name = "karma-mocha-0.1.1.tgz";
        sha1 = "5edddb3e2d2c6fd47e9ad26f0af1595fe852c756";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-mocha" or []);
    deps = [
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
      self.by-version."mocha"."1.17.1"
    ];
    passthru.names = [ "karma-mocha" ];
  };
  "karma-mocha" = self.by-version."karma-mocha"."0.1.1";
  by-spec."karma-phantomjs-launcher"."~0.1.1" =
    self.by-version."karma-phantomjs-launcher"."0.1.2";
  by-version."karma-phantomjs-launcher"."0.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-phantomjs-launcher-0.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-phantomjs-launcher/-/karma-phantomjs-launcher-0.1.2.tgz";
        name = "karma-phantomjs-launcher-0.1.2.tgz";
        sha1 = "371c530be0fe2c21eac92c7c6de4dfdae8cd1a1d";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-phantomjs-launcher" or []);
    deps = [
      self.by-version."phantomjs"."1.9.7-1"
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "karma-phantomjs-launcher" ];
  };
  "karma-phantomjs-launcher" = self.by-version."karma-phantomjs-launcher"."0.1.2";
  by-spec."karma-requirejs"."~0.2.1" =
    self.by-version."karma-requirejs"."0.2.1";
  by-version."karma-requirejs"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-requirejs-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-requirejs/-/karma-requirejs-0.2.1.tgz";
        name = "karma-requirejs-0.2.1.tgz";
        sha1 = "7f3ac5df67bccd9d832a928ec658d733ec983c5d";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-requirejs" or []);
    deps = [
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
      self.by-version."requirejs"."2.1.10"
    ];
    passthru.names = [ "karma-requirejs" ];
  };
  "karma-requirejs" = self.by-version."karma-requirejs"."0.2.1";
  by-spec."karma-sauce-launcher"."~0.2.0" =
    self.by-version."karma-sauce-launcher"."0.2.0";
  by-version."karma-sauce-launcher"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-sauce-launcher-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-sauce-launcher/-/karma-sauce-launcher-0.2.0.tgz";
        name = "karma-sauce-launcher-0.2.0.tgz";
        sha1 = "0994da49a1774be876ff1b107fd47e8768e3ead0";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-sauce-launcher" or []);
    deps = [
      self.by-version."wd"."0.2.10"
      self.by-version."sauce-connect-launcher"."0.2.2"
      self.by-version."q"."0.9.7"
      self.by-version."saucelabs"."0.1.1"
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "karma-sauce-launcher" ];
  };
  "karma-sauce-launcher" = self.by-version."karma-sauce-launcher"."0.2.0";
  by-spec."karma-script-launcher"."~0.1.0" =
    self.by-version."karma-script-launcher"."0.1.0";
  by-version."karma-script-launcher"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-karma-script-launcher-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/karma-script-launcher/-/karma-script-launcher-0.1.0.tgz";
        name = "karma-script-launcher-0.1.0.tgz";
        sha1 = "b643e7c2faead1a52cdb2eeaadcf7a245f0d772a";
      })
    ];
    buildInputs =
      (self.nativeDeps."karma-script-launcher" or []);
    deps = [
    ];
    peerDependencies = [
      self.by-version."karma"."0.11.14"
    ];
    passthru.names = [ "karma-script-launcher" ];
  };
  "karma-script-launcher" = self.by-version."karma-script-launcher"."0.1.0";
  by-spec."kew"."~0.1.7" =
    self.by-version."kew"."0.1.7";
  by-version."kew"."0.1.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-kew-0.1.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/kew/-/kew-0.1.7.tgz";
        name = "kew-0.1.7.tgz";
        sha1 = "0a32a817ff1a9b3b12b8c9bacf4bc4d679af8e72";
      })
    ];
    buildInputs =
      (self.nativeDeps."kew" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "kew" ];
  };
  by-spec."lazystream"."~0.1.0" =
    self.by-version."lazystream"."0.1.0";
  by-version."lazystream"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-lazystream-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lazystream/-/lazystream-0.1.0.tgz";
        name = "lazystream-0.1.0.tgz";
        sha1 = "1b25d63c772a4c20f0a5ed0a9d77f484b6e16920";
      })
    ];
    buildInputs =
      (self.nativeDeps."lazystream" or []);
    deps = [
      self.by-version."readable-stream"."1.0.25"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lazystream" ];
  };
  by-spec."lcov-parse"."0.0.4" =
    self.by-version."lcov-parse"."0.0.4";
  by-version."lcov-parse"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-lcov-parse-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lcov-parse/-/lcov-parse-0.0.4.tgz";
        name = "lcov-parse-0.0.4.tgz";
        sha1 = "3853a4f132f04581db0e74c180542d90f0d1c66b";
      })
    ];
    buildInputs =
      (self.nativeDeps."lcov-parse" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lcov-parse" ];
  };
  by-spec."lcov-result-merger"."~0.0.2" =
    self.by-version."lcov-result-merger"."0.0.2";
  by-version."lcov-result-merger"."0.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "lcov-result-merger-0.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lcov-result-merger/-/lcov-result-merger-0.0.2.tgz";
        name = "lcov-result-merger-0.0.2.tgz";
        sha1 = "72a538c09f76e5c79b511bcd1053948d4aa98f10";
      })
    ];
    buildInputs =
      (self.nativeDeps."lcov-result-merger" or []);
    deps = [
      self.by-version."glob"."3.2.8"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lcov-result-merger" ];
  };
  "lcov-result-merger" = self.by-version."lcov-result-merger"."0.0.2";
  by-spec."less"."~1.6.0" =
    self.by-version."less"."1.6.3";
  by-version."less"."1.6.3" = lib.makeOverridable self.buildNodePackage {
    name = "less-1.6.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/less/-/less-1.6.3.tgz";
        name = "less-1.6.3.tgz";
        sha1 = "71ce89ec30b774b3567f254c67958f2f2c193bde";
      })
    ];
    buildInputs =
      (self.nativeDeps."less" or []);
    deps = [
      self.by-version."mime"."1.2.11"
      self.by-version."request"."2.33.0"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."clean-css"."2.0.8"
      self.by-version."source-map"."0.1.31"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "less" ];
  };
  by-spec."lodash"."~0.9.2" =
    self.by-version."lodash"."0.9.2";
  by-version."lodash"."0.9.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash-0.9.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash/-/lodash-0.9.2.tgz";
        name = "lodash-0.9.2.tgz";
        sha1 = "8f3499c5245d346d682e5b0d3b40767e09f1a92c";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash" ];
  };
  by-spec."lodash"."~1.0.1" =
    self.by-version."lodash"."1.0.1";
  by-version."lodash"."1.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash-1.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash/-/lodash-1.0.1.tgz";
        name = "lodash-1.0.1.tgz";
        sha1 = "57945732498d92310e5bd4b1ff4f273a79e6c9fc";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash" ];
  };
  by-spec."lodash"."~1.2.1" =
    self.by-version."lodash"."1.2.1";
  by-version."lodash"."1.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash-1.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash/-/lodash-1.2.1.tgz";
        name = "lodash-1.2.1.tgz";
        sha1 = "ed47b16e46f06b2b40309b68e9163c17e93ea304";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash" ];
  };
  by-spec."lodash"."~1.3.1" =
    self.by-version."lodash"."1.3.1";
  by-version."lodash"."1.3.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash-1.3.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash/-/lodash-1.3.1.tgz";
        name = "lodash-1.3.1.tgz";
        sha1 = "a4663b53686b895ff074e2ba504dfb76a8e2b770";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash" ];
  };
  by-spec."lodash"."~2.1.0" =
    self.by-version."lodash"."2.1.0";
  by-version."lodash"."2.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash-2.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash/-/lodash-2.1.0.tgz";
        name = "lodash-2.1.0.tgz";
        sha1 = "0637eaaa36a8a1cfc865c3adfb942189bfb0998d";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash" ];
  };
  by-spec."lodash"."~2.4.1" =
    self.by-version."lodash"."2.4.1";
  by-version."lodash"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash/-/lodash-2.4.1.tgz";
        name = "lodash-2.4.1.tgz";
        sha1 = "5b7723034dda4d262e5a46fb2c58d7cc22f71420";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash" ];
  };
  by-spec."lodash._isnative"."~2.4.1" =
    self.by-version."lodash._isnative"."2.4.1";
  by-version."lodash._isnative"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash._isnative-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash._isnative/-/lodash._isnative-2.4.1.tgz";
        name = "lodash._isnative-2.4.1.tgz";
        sha1 = "3ea6404b784a7be836c7b57580e1cdf79b14832c";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash._isnative" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash._isnative" ];
  };
  by-spec."lodash._objecttypes"."~2.4.1" =
    self.by-version."lodash._objecttypes"."2.4.1";
  by-version."lodash._objecttypes"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash._objecttypes-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash._objecttypes/-/lodash._objecttypes-2.4.1.tgz";
        name = "lodash._objecttypes-2.4.1.tgz";
        sha1 = "7c0b7f69d98a1f76529f890b0cdb1b4dfec11c11";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash._objecttypes" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash._objecttypes" ];
  };
  by-spec."lodash._shimkeys"."~2.4.1" =
    self.by-version."lodash._shimkeys"."2.4.1";
  by-version."lodash._shimkeys"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash._shimkeys-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash._shimkeys/-/lodash._shimkeys-2.4.1.tgz";
        name = "lodash._shimkeys-2.4.1.tgz";
        sha1 = "6e9cc9666ff081f0b5a6c978b83e242e6949d203";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash._shimkeys" or []);
    deps = [
      self.by-version."lodash._objecttypes"."2.4.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash._shimkeys" ];
  };
  by-spec."lodash.defaults"."~2.4.1" =
    self.by-version."lodash.defaults"."2.4.1";
  by-version."lodash.defaults"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash.defaults-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash.defaults/-/lodash.defaults-2.4.1.tgz";
        name = "lodash.defaults-2.4.1.tgz";
        sha1 = "a7e8885f05e68851144b6e12a8f3678026bc4c54";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash.defaults" or []);
    deps = [
      self.by-version."lodash.keys"."2.4.1"
      self.by-version."lodash._objecttypes"."2.4.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash.defaults" ];
  };
  by-spec."lodash.isobject"."~2.4.1" =
    self.by-version."lodash.isobject"."2.4.1";
  by-version."lodash.isobject"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash.isobject-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash.isobject/-/lodash.isobject-2.4.1.tgz";
        name = "lodash.isobject-2.4.1.tgz";
        sha1 = "5a2e47fe69953f1ee631a7eba1fe64d2d06558f5";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash.isobject" or []);
    deps = [
      self.by-version."lodash._objecttypes"."2.4.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash.isobject" ];
  };
  by-spec."lodash.keys"."~2.4.1" =
    self.by-version."lodash.keys"."2.4.1";
  by-version."lodash.keys"."2.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lodash.keys-2.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lodash.keys/-/lodash.keys-2.4.1.tgz";
        name = "lodash.keys-2.4.1.tgz";
        sha1 = "48dea46df8ff7632b10d706b8acb26591e2b3727";
      })
    ];
    buildInputs =
      (self.nativeDeps."lodash.keys" or []);
    deps = [
      self.by-version."lodash._isnative"."2.4.1"
      self.by-version."lodash.isobject"."2.4.1"
      self.by-version."lodash._shimkeys"."2.4.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lodash.keys" ];
  };
  by-spec."log-driver"."1.2.1" =
    self.by-version."log-driver"."1.2.1";
  by-version."log-driver"."1.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-log-driver-1.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/log-driver/-/log-driver-1.2.1.tgz";
        name = "log-driver-1.2.1.tgz";
        sha1 = "ada8202a133e99764306652e195e28268b0bea5b";
      })
    ];
    buildInputs =
      (self.nativeDeps."log-driver" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "log-driver" ];
  };
  by-spec."log4js"."~0.6.3" =
    self.by-version."log4js"."0.6.10";
  by-version."log4js"."0.6.10" = lib.makeOverridable self.buildNodePackage {
    name = "node-log4js-0.6.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/log4js/-/log4js-0.6.10.tgz";
        name = "log4js-0.6.10.tgz";
        sha1 = "3a47a2551dc6362672901b73f7f47aee6310f785";
      })
    ];
    buildInputs =
      (self.nativeDeps."log4js" or []);
    deps = [
      self.by-version."async"."0.1.15"
      self.by-version."semver"."1.1.4"
      self.by-version."readable-stream"."1.0.25"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "log4js" ];
  };
  by-spec."lru-cache"."2" =
    self.by-version."lru-cache"."2.5.0";
  by-version."lru-cache"."2.5.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-lru-cache-2.5.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lru-cache/-/lru-cache-2.5.0.tgz";
        name = "lru-cache-2.5.0.tgz";
        sha1 = "d82388ae9c960becbea0c73bb9eb79b6c6ce9aeb";
      })
    ];
    buildInputs =
      (self.nativeDeps."lru-cache" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lru-cache" ];
  };
  by-spec."lru-cache"."2.2.x" =
    self.by-version."lru-cache"."2.2.4";
  by-version."lru-cache"."2.2.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-lru-cache-2.2.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lru-cache/-/lru-cache-2.2.4.tgz";
        name = "lru-cache-2.2.4.tgz";
        sha1 = "6c658619becf14031d0d0b594b16042ce4dc063d";
      })
    ];
    buildInputs =
      (self.nativeDeps."lru-cache" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lru-cache" ];
  };
  by-spec."lru-cache"."~2.3.0" =
    self.by-version."lru-cache"."2.3.1";
  by-version."lru-cache"."2.3.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-lru-cache-2.3.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/lru-cache/-/lru-cache-2.3.1.tgz";
        name = "lru-cache-2.3.1.tgz";
        sha1 = "b3adf6b3d856e954e2c390e6cef22081245a53d6";
      })
    ];
    buildInputs =
      (self.nativeDeps."lru-cache" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "lru-cache" ];
  };
  by-spec."memoizee"."~0.2.5" =
    self.by-version."memoizee"."0.2.6";
  by-version."memoizee"."0.2.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-memoizee-0.2.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/memoizee/-/memoizee-0.2.6.tgz";
        name = "memoizee-0.2.6.tgz";
        sha1 = "bb45a7ad02530082f1612671dab35219cd2e0741";
      })
    ];
    buildInputs =
      (self.nativeDeps."memoizee" or []);
    deps = [
      self.by-version."es5-ext"."0.9.2"
      self.by-version."event-emitter"."0.2.2"
      self.by-version."next-tick"."0.1.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "memoizee" ];
  };
  by-spec."methods"."0.1.0" =
    self.by-version."methods"."0.1.0";
  by-version."methods"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-methods-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/methods/-/methods-0.1.0.tgz";
        name = "methods-0.1.0.tgz";
        sha1 = "335d429eefd21b7bacf2e9c922a8d2bd14a30e4f";
      })
    ];
    buildInputs =
      (self.nativeDeps."methods" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "methods" ];
  };
  by-spec."mime"."1.2.x" =
    self.by-version."mime"."1.2.11";
  by-version."mime"."1.2.11" = lib.makeOverridable self.buildNodePackage {
    name = "node-mime-1.2.11";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mime/-/mime-1.2.11.tgz";
        name = "mime-1.2.11.tgz";
        sha1 = "58203eed86e3a5ef17aed2b7d9ebd47f0a60dd10";
      })
    ];
    buildInputs =
      (self.nativeDeps."mime" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mime" ];
  };
  by-spec."mime"."~1.2.11" =
    self.by-version."mime"."1.2.11";
  by-spec."mime"."~1.2.2" =
    self.by-version."mime"."1.2.11";
  by-spec."mime"."~1.2.7" =
    self.by-version."mime"."1.2.11";
  by-spec."mime"."~1.2.9" =
    self.by-version."mime"."1.2.11";
  by-spec."minimatch"."0.x" =
    self.by-version."minimatch"."0.2.14";
  by-version."minimatch"."0.2.14" = lib.makeOverridable self.buildNodePackage {
    name = "node-minimatch-0.2.14";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/minimatch/-/minimatch-0.2.14.tgz";
        name = "minimatch-0.2.14.tgz";
        sha1 = "c74e780574f63c6f9a090e90efbe6ef53a6a756a";
      })
    ];
    buildInputs =
      (self.nativeDeps."minimatch" or []);
    deps = [
      self.by-version."lru-cache"."2.5.0"
      self.by-version."sigmund"."1.0.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "minimatch" ];
  };
  by-spec."minimatch"."0.x.x" =
    self.by-version."minimatch"."0.2.14";
  by-spec."minimatch"."~0.2" =
    self.by-version."minimatch"."0.2.14";
  by-spec."minimatch"."~0.2.0" =
    self.by-version."minimatch"."0.2.14";
  by-spec."minimatch"."~0.2.11" =
    self.by-version."minimatch"."0.2.14";
  by-spec."minimatch"."~0.2.12" =
    self.by-version."minimatch"."0.2.14";
  by-spec."minimatch"."~0.2.9" =
    self.by-version."minimatch"."0.2.14";
  by-spec."minimist"."~0.0.1" =
    self.by-version."minimist"."0.0.7";
  by-version."minimist"."0.0.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-minimist-0.0.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/minimist/-/minimist-0.0.7.tgz";
        name = "minimist-0.0.7.tgz";
        sha1 = "dc4c620253c542eda0d2eb91c3c6a971a11e63e7";
      })
    ];
    buildInputs =
      (self.nativeDeps."minimist" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "minimist" ];
  };
  by-spec."mkdirp"."*" =
    self.by-version."mkdirp"."0.3.5";
  by-version."mkdirp"."0.3.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-mkdirp-0.3.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mkdirp/-/mkdirp-0.3.5.tgz";
        name = "mkdirp-0.3.5.tgz";
        sha1 = "de3e5f8961c88c787ee1368df849ac4413eca8d7";
      })
    ];
    buildInputs =
      (self.nativeDeps."mkdirp" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mkdirp" ];
  };
  by-spec."mkdirp"."0.3" =
    self.by-version."mkdirp"."0.3.5";
  by-spec."mkdirp"."0.3.0" =
    self.by-version."mkdirp"."0.3.0";
  by-version."mkdirp"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-mkdirp-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mkdirp/-/mkdirp-0.3.0.tgz";
        name = "mkdirp-0.3.0.tgz";
        sha1 = "1bbf5ab1ba827af23575143490426455f481fe1e";
      })
    ];
    buildInputs =
      (self.nativeDeps."mkdirp" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mkdirp" ];
  };
  by-spec."mkdirp"."0.3.5" =
    self.by-version."mkdirp"."0.3.5";
  by-spec."mkdirp"."0.3.x" =
    self.by-version."mkdirp"."0.3.5";
  by-spec."mkdirp"."0.x.x" =
    self.by-version."mkdirp"."0.3.5";
  by-spec."mkdirp"."~0.3.3" =
    self.by-version."mkdirp"."0.3.5";
  by-spec."mkdirp"."~0.3.5" =
    self.by-version."mkdirp"."0.3.5";
  by-spec."mkpath"."~0.1.0" =
    self.by-version."mkpath"."0.1.0";
  by-version."mkpath"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-mkpath-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mkpath/-/mkpath-0.1.0.tgz";
        name = "mkpath-0.1.0.tgz";
        sha1 = "7554a6f8d871834cc97b5462b122c4c124d6de91";
      })
    ];
    buildInputs =
      (self.nativeDeps."mkpath" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mkpath" ];
  };
  by-spec."mocha"."*" =
    self.by-version."mocha"."1.17.1";
  by-version."mocha"."1.17.1" = lib.makeOverridable self.buildNodePackage {
    name = "mocha-1.17.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mocha/-/mocha-1.17.1.tgz";
        name = "mocha-1.17.1.tgz";
        sha1 = "7f7671d68526d074b7bae660c9099f87e0ea1ccb";
      })
    ];
    buildInputs =
      (self.nativeDeps."mocha" or []);
    deps = [
      self.by-version."commander"."2.0.0"
      self.by-version."growl"."1.7.0"
      self.by-version."jade"."0.26.3"
      self.by-version."diff"."1.0.7"
      self.by-version."debug"."0.7.4"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."glob"."3.2.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mocha" ];
  };
  by-spec."mocha"."~1.17.1" =
    self.by-version."mocha"."1.17.1";
  "mocha" = self.by-version."mocha"."1.17.1";
  by-spec."mout"."~0.6.0" =
    self.by-version."mout"."0.6.0";
  by-version."mout"."0.6.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-mout-0.6.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mout/-/mout-0.6.0.tgz";
        name = "mout-0.6.0.tgz";
        sha1 = "ce7abad8130d796b09d7fb509bcc73b09be024a6";
      })
    ];
    buildInputs =
      (self.nativeDeps."mout" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mout" ];
  };
  by-spec."mout"."~0.7.0" =
    self.by-version."mout"."0.7.1";
  by-version."mout"."0.7.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-mout-0.7.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mout/-/mout-0.7.1.tgz";
        name = "mout-0.7.1.tgz";
        sha1 = "218de2b0880b220d99f4fbaee3fc0c3a5310bda8";
      })
    ];
    buildInputs =
      (self.nativeDeps."mout" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mout" ];
  };
  by-spec."multiparty"."2.2.0" =
    self.by-version."multiparty"."2.2.0";
  by-version."multiparty"."2.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-multiparty-2.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/multiparty/-/multiparty-2.2.0.tgz";
        name = "multiparty-2.2.0.tgz";
        sha1 = "a567c2af000ad22dc8f2a653d91978ae1f5316f4";
      })
    ];
    buildInputs =
      (self.nativeDeps."multiparty" or []);
    deps = [
      self.by-version."readable-stream"."1.1.10"
      self.by-version."stream-counter"."0.2.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "multiparty" ];
  };
  by-spec."mute-stream"."0.0.3" =
    self.by-version."mute-stream"."0.0.3";
  by-version."mute-stream"."0.0.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-mute-stream-0.0.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mute-stream/-/mute-stream-0.0.3.tgz";
        name = "mute-stream-0.0.3.tgz";
        sha1 = "f09c090d333b3063f615cbbcca71b349893f0152";
      })
    ];
    buildInputs =
      (self.nativeDeps."mute-stream" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mute-stream" ];
  };
  by-spec."mute-stream"."~0.0.4" =
    self.by-version."mute-stream"."0.0.4";
  by-version."mute-stream"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-mute-stream-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/mute-stream/-/mute-stream-0.0.4.tgz";
        name = "mute-stream-0.0.4.tgz";
        sha1 = "a9219960a6d5d5d046597aee51252c6655f7177e";
      })
    ];
    buildInputs =
      (self.nativeDeps."mute-stream" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "mute-stream" ];
  };
  by-spec."nan"."~0.3.0" =
    self.by-version."nan"."0.3.2";
  by-version."nan"."0.3.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-nan-0.3.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/nan/-/nan-0.3.2.tgz";
        name = "nan-0.3.2.tgz";
        sha1 = "0df1935cab15369075ef160ad2894107aa14dc2d";
      })
    ];
    buildInputs =
      (self.nativeDeps."nan" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "nan" ];
  };
  by-spec."ncp"."0.4.2" =
    self.by-version."ncp"."0.4.2";
  by-version."ncp"."0.4.2" = lib.makeOverridable self.buildNodePackage {
    name = "ncp-0.4.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ncp/-/ncp-0.4.2.tgz";
        name = "ncp-0.4.2.tgz";
        sha1 = "abcc6cbd3ec2ed2a729ff6e7c1fa8f01784a8574";
      })
    ];
    buildInputs =
      (self.nativeDeps."ncp" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ncp" ];
  };
  by-spec."ncp"."0.4.x" =
    self.by-version."ncp"."0.4.2";
  by-spec."negotiator"."0.3.0" =
    self.by-version."negotiator"."0.3.0";
  by-version."negotiator"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-negotiator-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/negotiator/-/negotiator-0.3.0.tgz";
        name = "negotiator-0.3.0.tgz";
        sha1 = "706d692efeddf574d57ea9fb1ab89a4fa7ee8f60";
      })
    ];
    buildInputs =
      (self.nativeDeps."negotiator" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "negotiator" ];
  };
  by-spec."next-tick"."0.1.x" =
    self.by-version."next-tick"."0.1.0";
  by-version."next-tick"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-next-tick-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/next-tick/-/next-tick-0.1.0.tgz";
        name = "next-tick-0.1.0.tgz";
        sha1 = "1912cce8eb9b697d640fbba94f8f00dec3b94259";
      })
    ];
    buildInputs =
      (self.nativeDeps."next-tick" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "next-tick" ];
  };
  by-spec."node-uuid"."~1.4.0" =
    self.by-version."node-uuid"."1.4.1";
  by-version."node-uuid"."1.4.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-node-uuid-1.4.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/node-uuid/-/node-uuid-1.4.1.tgz";
        name = "node-uuid-1.4.1.tgz";
        sha1 = "39aef510e5889a3dca9c895b506c73aae1bac048";
      })
    ];
    buildInputs =
      (self.nativeDeps."node-uuid" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "node-uuid" ];
  };
  by-spec."nomnom"."1.6.x" =
    self.by-version."nomnom"."1.6.2";
  by-version."nomnom"."1.6.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-nomnom-1.6.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/nomnom/-/nomnom-1.6.2.tgz";
        name = "nomnom-1.6.2.tgz";
        sha1 = "84a66a260174408fc5b77a18f888eccc44fb6971";
      })
    ];
    buildInputs =
      (self.nativeDeps."nomnom" or []);
    deps = [
      self.by-version."colors"."0.5.1"
      self.by-version."underscore"."1.4.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "nomnom" ];
  };
  by-spec."nopt"."2" =
    self.by-version."nopt"."2.1.2";
  by-version."nopt"."2.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "nopt-2.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/nopt/-/nopt-2.1.2.tgz";
        name = "nopt-2.1.2.tgz";
        sha1 = "6cccd977b80132a07731d6e8ce58c2c8303cf9af";
      })
    ];
    buildInputs =
      (self.nativeDeps."nopt" or []);
    deps = [
      self.by-version."abbrev"."1.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "nopt" ];
  };
  by-spec."nopt"."2.1.x" =
    self.by-version."nopt"."2.1.2";
  by-spec."nopt"."~1.0.10" =
    self.by-version."nopt"."1.0.10";
  by-version."nopt"."1.0.10" = lib.makeOverridable self.buildNodePackage {
    name = "nopt-1.0.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/nopt/-/nopt-1.0.10.tgz";
        name = "nopt-1.0.10.tgz";
        sha1 = "6ddd21bd2a31417b92727dd585f8a6f37608ebee";
      })
    ];
    buildInputs =
      (self.nativeDeps."nopt" or []);
    deps = [
      self.by-version."abbrev"."1.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "nopt" ];
  };
  by-spec."nopt"."~2.1.1" =
    self.by-version."nopt"."2.1.2";
  by-spec."nopt"."~2.1.2" =
    self.by-version."nopt"."2.1.2";
  by-spec."npmconf"."0.0.24" =
    self.by-version."npmconf"."0.0.24";
  by-version."npmconf"."0.0.24" = lib.makeOverridable self.buildNodePackage {
    name = "node-npmconf-0.0.24";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/npmconf/-/npmconf-0.0.24.tgz";
        name = "npmconf-0.0.24.tgz";
        sha1 = "b78875b088ccc3c0afa3eceb3ce3244b1b52390c";
      })
    ];
    buildInputs =
      (self.nativeDeps."npmconf" or []);
    deps = [
      self.by-version."config-chain"."1.1.8"
      self.by-version."inherits"."1.0.0"
      self.by-version."once"."1.1.1"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."osenv"."0.0.3"
      self.by-version."nopt"."2.1.2"
      self.by-version."semver"."1.1.4"
      self.by-version."ini"."1.1.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "npmconf" ];
  };
  by-spec."oauth-sign"."~0.2.0" =
    self.by-version."oauth-sign"."0.2.0";
  by-version."oauth-sign"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-oauth-sign-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/oauth-sign/-/oauth-sign-0.2.0.tgz";
        name = "oauth-sign-0.2.0.tgz";
        sha1 = "a0e6a1715daed062f322b622b7fe5afd1035b6e2";
      })
    ];
    buildInputs =
      (self.nativeDeps."oauth-sign" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "oauth-sign" ];
  };
  by-spec."oauth-sign"."~0.3.0" =
    self.by-version."oauth-sign"."0.3.0";
  by-version."oauth-sign"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-oauth-sign-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/oauth-sign/-/oauth-sign-0.3.0.tgz";
        name = "oauth-sign-0.3.0.tgz";
        sha1 = "cb540f93bb2b22a7d5941691a288d60e8ea9386e";
      })
    ];
    buildInputs =
      (self.nativeDeps."oauth-sign" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "oauth-sign" ];
  };
  by-spec."once"."~1.1.1" =
    self.by-version."once"."1.1.1";
  by-version."once"."1.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-once-1.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/once/-/once-1.1.1.tgz";
        name = "once-1.1.1.tgz";
        sha1 = "9db574933ccb08c3a7614d154032c09ea6f339e7";
      })
    ];
    buildInputs =
      (self.nativeDeps."once" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "once" ];
  };
  by-spec."open"."~0.0.3" =
    self.by-version."open"."0.0.4";
  by-version."open"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-open-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/open/-/open-0.0.4.tgz";
        name = "open-0.0.4.tgz";
        sha1 = "5de46a0858b9f49f9f211aa8f26628550657f262";
      })
    ];
    buildInputs =
      (self.nativeDeps."open" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "open" ];
  };
  by-spec."optimist"."*" =
    self.by-version."optimist"."0.6.1";
  by-version."optimist"."0.6.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-optimist-0.6.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/optimist/-/optimist-0.6.1.tgz";
        name = "optimist-0.6.1.tgz";
        sha1 = "da3ea74686fa21a19a111c326e90eb15a0196686";
      })
    ];
    buildInputs =
      (self.nativeDeps."optimist" or []);
    deps = [
      self.by-version."wordwrap"."0.0.2"
      self.by-version."minimist"."0.0.7"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "optimist" ];
  };
  by-spec."optimist"."0.6.x" =
    self.by-version."optimist"."0.6.1";
  by-spec."optimist"."~0.3" =
    self.by-version."optimist"."0.3.7";
  by-version."optimist"."0.3.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-optimist-0.3.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/optimist/-/optimist-0.3.7.tgz";
        name = "optimist-0.3.7.tgz";
        sha1 = "c90941ad59e4273328923074d2cf2e7cbc6ec0d9";
      })
    ];
    buildInputs =
      (self.nativeDeps."optimist" or []);
    deps = [
      self.by-version."wordwrap"."0.0.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "optimist" ];
  };
  by-spec."optimist"."~0.3.5" =
    self.by-version."optimist"."0.3.7";
  by-spec."optimist"."~0.6.0" =
    self.by-version."optimist"."0.6.1";
  by-spec."options".">=0.0.5" =
    self.by-version."options"."0.0.5";
  by-version."options"."0.0.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-options-0.0.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/options/-/options-0.0.5.tgz";
        name = "options-0.0.5.tgz";
        sha1 = "9a3806378f316536d79038038ba90ccb724816c3";
      })
    ];
    buildInputs =
      (self.nativeDeps."options" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "options" ];
  };
  by-spec."osenv"."0.0.3" =
    self.by-version."osenv"."0.0.3";
  by-version."osenv"."0.0.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-osenv-0.0.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/osenv/-/osenv-0.0.3.tgz";
        name = "osenv-0.0.3.tgz";
        sha1 = "cd6ad8ddb290915ad9e22765576025d411f29cb6";
      })
    ];
    buildInputs =
      (self.nativeDeps."osenv" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "osenv" ];
  };
  by-spec."p-throttler"."~0.0.1" =
    self.by-version."p-throttler"."0.0.1";
  by-version."p-throttler"."0.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-p-throttler-0.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/p-throttler/-/p-throttler-0.0.1.tgz";
        name = "p-throttler-0.0.1.tgz";
        sha1 = "c341e3589ec843852a035e6f88e6c1e96150029b";
      })
    ];
    buildInputs =
      (self.nativeDeps."p-throttler" or []);
    deps = [
      self.by-version."q"."0.9.7"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "p-throttler" ];
  };
  by-spec."pause"."0.0.1" =
    self.by-version."pause"."0.0.1";
  by-version."pause"."0.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-pause-0.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/pause/-/pause-0.0.1.tgz";
        name = "pause-0.0.1.tgz";
        sha1 = "1d408b3fdb76923b9543d96fb4c9dfd535d9cb5d";
      })
    ];
    buildInputs =
      (self.nativeDeps."pause" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "pause" ];
  };
  by-spec."phantomjs"."~1.9" =
    self.by-version."phantomjs"."1.9.7-1";
  by-version."phantomjs"."1.9.7-1" = lib.makeOverridable self.buildNodePackage {
    name = "phantomjs-1.9.7-1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/phantomjs/-/phantomjs-1.9.7-1.tgz";
        name = "phantomjs-1.9.7-1.tgz";
        sha1 = "57a191c908de74d27ac4948bd66100ae88222f47";
      })
    ];
    buildInputs =
      (self.nativeDeps."phantomjs" or []);
    deps = [
      self.by-version."adm-zip"."0.2.1"
      self.by-version."kew"."0.1.7"
      self.by-version."ncp"."0.4.2"
      self.by-version."npmconf"."0.0.24"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."rimraf"."2.2.6"
      self.by-version."which"."1.0.5"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "phantomjs" ];
  };
  by-spec."pkginfo"."0.3.x" =
    self.by-version."pkginfo"."0.3.0";
  by-version."pkginfo"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-pkginfo-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/pkginfo/-/pkginfo-0.3.0.tgz";
        name = "pkginfo-0.3.0.tgz";
        sha1 = "726411401039fe9b009eea86614295d5f3a54276";
      })
    ];
    buildInputs =
      (self.nativeDeps."pkginfo" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "pkginfo" ];
  };
  by-spec."policyfile"."0.0.4" =
    self.by-version."policyfile"."0.0.4";
  by-version."policyfile"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-policyfile-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/policyfile/-/policyfile-0.0.4.tgz";
        name = "policyfile-0.0.4.tgz";
        sha1 = "d6b82ead98ae79ebe228e2daf5903311ec982e4d";
      })
    ];
    buildInputs =
      (self.nativeDeps."policyfile" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "policyfile" ];
  };
  by-spec."promptly"."~0.2.0" =
    self.by-version."promptly"."0.2.0";
  by-version."promptly"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-promptly-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/promptly/-/promptly-0.2.0.tgz";
        name = "promptly-0.2.0.tgz";
        sha1 = "73ef200fa8329d5d3a8df41798950b8646ca46d9";
      })
    ];
    buildInputs =
      (self.nativeDeps."promptly" or []);
    deps = [
      self.by-version."read"."1.0.5"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "promptly" ];
  };
  by-spec."proto-list"."~1.2.1" =
    self.by-version."proto-list"."1.2.2";
  by-version."proto-list"."1.2.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-proto-list-1.2.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/proto-list/-/proto-list-1.2.2.tgz";
        name = "proto-list-1.2.2.tgz";
        sha1 = "48b88798261ec2c4a785720cdfec6200d57d3326";
      })
    ];
    buildInputs =
      (self.nativeDeps."proto-list" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "proto-list" ];
  };
  by-spec."punycode".">=0.2.0" =
    self.by-version."punycode"."1.2.3";
  by-version."punycode"."1.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-punycode-1.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/punycode/-/punycode-1.2.3.tgz";
        name = "punycode-1.2.3.tgz";
        sha1 = "b4e304471082d783c73b3bafabf2fd9b6a486266";
      })
    ];
    buildInputs =
      (self.nativeDeps."punycode" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "punycode" ];
  };
  by-spec."q"."~0.9.2" =
    self.by-version."q"."0.9.7";
  by-version."q"."0.9.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-q-0.9.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/q/-/q-0.9.7.tgz";
        name = "q-0.9.7.tgz";
        sha1 = "4de2e6cb3b29088c9e4cbc03bf9d42fb96ce2f75";
      })
    ];
    buildInputs =
      (self.nativeDeps."q" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "q" ];
  };
  by-spec."q"."~0.9.6" =
    self.by-version."q"."0.9.7";
  by-spec."q"."~0.9.7" =
    self.by-version."q"."0.9.7";
  by-spec."q"."~1.0.0" =
    self.by-version."q"."1.0.0";
  by-version."q"."1.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-q-1.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/q/-/q-1.0.0.tgz";
        name = "q-1.0.0.tgz";
        sha1 = "dc1f92c4587be54f7853b29dc28e6d243a88498d";
      })
    ];
    buildInputs =
      (self.nativeDeps."q" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "q" ];
  };
  by-spec."qs"."0.6.6" =
    self.by-version."qs"."0.6.6";
  by-version."qs"."0.6.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-qs-0.6.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/qs/-/qs-0.6.6.tgz";
        name = "qs-0.6.6.tgz";
        sha1 = "6e015098ff51968b8a3c819001d5f2c89bc4b107";
      })
    ];
    buildInputs =
      (self.nativeDeps."qs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "qs" ];
  };
  by-spec."qs"."~0.5.0" =
    self.by-version."qs"."0.5.6";
  by-version."qs"."0.5.6" = lib.makeOverridable self.buildNodePackage {
    name = "node-qs-0.5.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/qs/-/qs-0.5.6.tgz";
        name = "qs-0.5.6.tgz";
        sha1 = "31b1ad058567651c526921506b9a8793911a0384";
      })
    ];
    buildInputs =
      (self.nativeDeps."qs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "qs" ];
  };
  by-spec."qs"."~0.6.0" =
    self.by-version."qs"."0.6.6";
  by-spec."range-parser"."0.0.4" =
    self.by-version."range-parser"."0.0.4";
  by-version."range-parser"."0.0.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-range-parser-0.0.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/range-parser/-/range-parser-0.0.4.tgz";
        name = "range-parser-0.0.4.tgz";
        sha1 = "c0427ffef51c10acba0782a46c9602e744ff620b";
      })
    ];
    buildInputs =
      (self.nativeDeps."range-parser" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "range-parser" ];
  };
  by-spec."raw-body"."1.1.2" =
    self.by-version."raw-body"."1.1.2";
  by-version."raw-body"."1.1.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-raw-body-1.1.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/raw-body/-/raw-body-1.1.2.tgz";
        name = "raw-body-1.1.2.tgz";
        sha1 = "c74b3004dea5defd1696171106ac740ec31d62be";
      })
    ];
    buildInputs =
      (self.nativeDeps."raw-body" or []);
    deps = [
      self.by-version."bytes"."0.2.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "raw-body" ];
  };
  by-spec."read"."~1.0.4" =
    self.by-version."read"."1.0.5";
  by-version."read"."1.0.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-read-1.0.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/read/-/read-1.0.5.tgz";
        name = "read-1.0.5.tgz";
        sha1 = "007a3d169478aa710a491727e453effb92e76203";
      })
    ];
    buildInputs =
      (self.nativeDeps."read" or []);
    deps = [
      self.by-version."mute-stream"."0.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "read" ];
  };
  by-spec."readable-stream"."1.0" =
    self.by-version."readable-stream"."1.0.25";
  by-version."readable-stream"."1.0.25" = lib.makeOverridable self.buildNodePackage {
    name = "node-readable-stream-1.0.25";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/readable-stream/-/readable-stream-1.0.25.tgz";
        name = "readable-stream-1.0.25.tgz";
        sha1 = "df19f64e6f74fd37ecf9d3ab8dbf1e2d11c9a045";
      })
    ];
    buildInputs =
      (self.nativeDeps."readable-stream" or []);
    deps = [
      self.by-version."string_decoder"."0.10.25"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "readable-stream" ];
  };
  by-spec."readable-stream"."~1.0.2" =
    self.by-version."readable-stream"."1.0.25";
  by-spec."readable-stream"."~1.0.24" =
    self.by-version."readable-stream"."1.0.25";
  by-spec."readable-stream"."~1.1.8" =
    self.by-version."readable-stream"."1.1.10";
  by-version."readable-stream"."1.1.10" = lib.makeOverridable self.buildNodePackage {
    name = "node-readable-stream-1.1.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/readable-stream/-/readable-stream-1.1.10.tgz";
        name = "readable-stream-1.1.10.tgz";
        sha1 = "d4dc2e5319e9c90d1e71c69390ef62cd90827f65";
      })
    ];
    buildInputs =
      (self.nativeDeps."readable-stream" or []);
    deps = [
      self.by-version."core-util-is"."1.0.1"
      self.by-version."string_decoder"."0.10.25"
      self.by-version."debuglog"."0.0.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "readable-stream" ];
  };
  by-spec."readable-stream"."~1.1.9" =
    self.by-version."readable-stream"."1.1.10";
  by-spec."redeyed"."~0.4.0" =
    self.by-version."redeyed"."0.4.2";
  by-version."redeyed"."0.4.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-redeyed-0.4.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/redeyed/-/redeyed-0.4.2.tgz";
        name = "redeyed-0.4.2.tgz";
        sha1 = "f0133b990cb972bdbcf2d2dce0aec36595f419bc";
      })
    ];
    buildInputs =
      (self.nativeDeps."redeyed" or []);
    deps = [
      self.by-version."esprima"."1.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "redeyed" ];
  };
  by-spec."redis"."0.7.3" =
    self.by-version."redis"."0.7.3";
  by-version."redis"."0.7.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-redis-0.7.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/redis/-/redis-0.7.3.tgz";
        name = "redis-0.7.3.tgz";
        sha1 = "ee57b7a44d25ec1594e44365d8165fa7d1d4811a";
      })
    ];
    buildInputs =
      (self.nativeDeps."redis" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "redis" ];
  };
  by-spec."replace"."~0.2.4" =
    self.by-version."replace"."0.2.9";
  by-version."replace"."0.2.9" = lib.makeOverridable self.buildNodePackage {
    name = "replace-0.2.9";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/replace/-/replace-0.2.9.tgz";
        name = "replace-0.2.9.tgz";
        sha1 = "64428de4451717e8cc34965d2d133dd86dace404";
      })
    ];
    buildInputs =
      (self.nativeDeps."replace" or []);
    deps = [
      self.by-version."nomnom"."1.6.2"
      self.by-version."colors"."0.5.1"
      self.by-version."minimatch"."0.2.14"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "replace" ];
  };
  by-spec."request"."2.16.2" =
    self.by-version."request"."2.16.2";
  by-version."request"."2.16.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-request-2.16.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/request/-/request-2.16.2.tgz";
        name = "request-2.16.2.tgz";
        sha1 = "83a028be61be4a05163e7e2e7a4b40e35df1bcb9";
      })
    ];
    buildInputs =
      (self.nativeDeps."request" or []);
    deps = [
      self.by-version."form-data"."0.0.10"
      self.by-version."mime"."1.2.11"
      self.by-version."hawk"."0.10.2"
      self.by-version."node-uuid"."1.4.1"
      self.by-version."cookie-jar"."0.2.0"
      self.by-version."aws-sign"."0.2.0"
      self.by-version."oauth-sign"."0.2.0"
      self.by-version."forever-agent"."0.2.0"
      self.by-version."tunnel-agent"."0.2.0"
      self.by-version."json-stringify-safe"."3.0.0"
      self.by-version."qs"."0.5.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "request" ];
  };
  by-spec."request".">=2.12.0" =
    self.by-version."request"."2.33.0";
  by-version."request"."2.33.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-request-2.33.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/request/-/request-2.33.0.tgz";
        name = "request-2.33.0.tgz";
        sha1 = "5167878131726070ec633752ea230a2379dc65ff";
      })
    ];
    buildInputs =
      (self.nativeDeps."request" or []);
    deps = [
      self.by-version."qs"."0.6.6"
      self.by-version."json-stringify-safe"."5.0.0"
      self.by-version."forever-agent"."0.5.2"
      self.by-version."node-uuid"."1.4.1"
      self.by-version."mime"."1.2.11"
      self.by-version."tough-cookie"."0.12.1"
      self.by-version."form-data"."0.1.2"
      self.by-version."tunnel-agent"."0.3.0"
      self.by-version."http-signature"."0.10.0"
      self.by-version."oauth-sign"."0.3.0"
      self.by-version."hawk"."1.0.0"
      self.by-version."aws-sign2"."0.5.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "request" ];
  };
  by-spec."request"."~2.27.0" =
    self.by-version."request"."2.27.0";
  by-version."request"."2.27.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-request-2.27.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/request/-/request-2.27.0.tgz";
        name = "request-2.27.0.tgz";
        sha1 = "dfb1a224dd3a5a9bade4337012503d710e538668";
      })
    ];
    buildInputs =
      (self.nativeDeps."request" or []);
    deps = [
      self.by-version."qs"."0.6.6"
      self.by-version."json-stringify-safe"."5.0.0"
      self.by-version."forever-agent"."0.5.2"
      self.by-version."tunnel-agent"."0.3.0"
      self.by-version."http-signature"."0.10.0"
      self.by-version."hawk"."1.0.0"
      self.by-version."aws-sign"."0.3.0"
      self.by-version."oauth-sign"."0.3.0"
      self.by-version."cookie-jar"."0.3.0"
      self.by-version."node-uuid"."1.4.1"
      self.by-version."mime"."1.2.11"
      self.by-version."form-data"."0.1.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "request" ];
  };
  by-spec."request"."~2.33.0" =
    self.by-version."request"."2.33.0";
  by-spec."request-progress"."~0.3.0" =
    self.by-version."request-progress"."0.3.1";
  by-version."request-progress"."0.3.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-request-progress-0.3.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/request-progress/-/request-progress-0.3.1.tgz";
        name = "request-progress-0.3.1.tgz";
        sha1 = "0721c105d8a96ac6b2ce8b2c89ae2d5ecfcf6b3a";
      })
    ];
    buildInputs =
      (self.nativeDeps."request-progress" or []);
    deps = [
      self.by-version."throttleit"."0.0.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "request-progress" ];
  };
  by-spec."request-replay"."~0.2.0" =
    self.by-version."request-replay"."0.2.0";
  by-version."request-replay"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-request-replay-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/request-replay/-/request-replay-0.2.0.tgz";
        name = "request-replay-0.2.0.tgz";
        sha1 = "9b693a5d118b39f5c596ead5ed91a26444057f60";
      })
    ];
    buildInputs =
      (self.nativeDeps."request-replay" or []);
    deps = [
      self.by-version."retry"."0.6.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "request-replay" ];
  };
  by-spec."requirejs"."~2.1" =
    self.by-version."requirejs"."2.1.10";
  by-version."requirejs"."2.1.10" = lib.makeOverridable self.buildNodePackage {
    name = "requirejs-2.1.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/requirejs/-/requirejs-2.1.10.tgz";
        name = "requirejs-2.1.10.tgz";
        sha1 = "1e1d7f608790e532a422c6199dad2abe15484b54";
      })
    ];
    buildInputs =
      (self.nativeDeps."requirejs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "requirejs" ];
  };
  by-spec."requirejs"."~2.1.0" =
    self.by-version."requirejs"."2.1.10";
  by-spec."requirejs"."~2.1.10" =
    self.by-version."requirejs"."2.1.10";
  "requirejs" = self.by-version."requirejs"."2.1.10";
  by-spec."resolve"."0.5.x" =
    self.by-version."resolve"."0.5.1";
  by-version."resolve"."0.5.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-resolve-0.5.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/resolve/-/resolve-0.5.1.tgz";
        name = "resolve-0.5.1.tgz";
        sha1 = "15e4a222c4236bcd4cf85454412c2d0fb6524576";
      })
    ];
    buildInputs =
      (self.nativeDeps."resolve" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "resolve" ];
  };
  by-spec."resolve"."0.6.x" =
    self.by-version."resolve"."0.6.1";
  by-version."resolve"."0.6.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-resolve-0.6.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/resolve/-/resolve-0.6.1.tgz";
        name = "resolve-0.6.1.tgz";
        sha1 = "b7fc874a8fe240b44de2c92b7f885a2e8598b652";
      })
    ];
    buildInputs =
      (self.nativeDeps."resolve" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "resolve" ];
  };
  by-spec."resolve"."~0.3.1" =
    self.by-version."resolve"."0.3.1";
  by-version."resolve"."0.3.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-resolve-0.3.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/resolve/-/resolve-0.3.1.tgz";
        name = "resolve-0.3.1.tgz";
        sha1 = "34c63447c664c70598d1c9b126fc43b2a24310a4";
      })
    ];
    buildInputs =
      (self.nativeDeps."resolve" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "resolve" ];
  };
  by-spec."retry"."~0.6.0" =
    self.by-version."retry"."0.6.0";
  by-version."retry"."0.6.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-retry-0.6.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/retry/-/retry-0.6.0.tgz";
        name = "retry-0.6.0.tgz";
        sha1 = "1c010713279a6fd1e8def28af0c3ff1871caa537";
      })
    ];
    buildInputs =
      (self.nativeDeps."retry" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "retry" ];
  };
  by-spec."rimraf"."2" =
    self.by-version."rimraf"."2.2.6";
  by-version."rimraf"."2.2.6" = lib.makeOverridable self.buildNodePackage {
    name = "rimraf-2.2.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/rimraf/-/rimraf-2.2.6.tgz";
        name = "rimraf-2.2.6.tgz";
        sha1 = "c59597569b14d956ad29cacc42bdddf5f0ea4f4c";
      })
    ];
    buildInputs =
      (self.nativeDeps."rimraf" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "rimraf" ];
  };
  by-spec."rimraf"."2.x.x" =
    self.by-version."rimraf"."2.2.6";
  by-spec."rimraf"."~2.0.3" =
    self.by-version."rimraf"."2.0.3";
  by-version."rimraf"."2.0.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-rimraf-2.0.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/rimraf/-/rimraf-2.0.3.tgz";
        name = "rimraf-2.0.3.tgz";
        sha1 = "f50a2965e7144e9afd998982f15df706730f56a9";
      })
    ];
    buildInputs =
      (self.nativeDeps."rimraf" or []);
    deps = [
      self.by-version."graceful-fs"."1.1.14"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "rimraf" ];
  };
  by-spec."rimraf"."~2.2.0" =
    self.by-version."rimraf"."2.2.6";
  by-spec."rimraf"."~2.2.2" =
    self.by-version."rimraf"."2.2.6";
  by-spec."rimraf"."~2.2.5" =
    self.by-version."rimraf"."2.2.6";
  by-spec."sauce-connect-launcher"."~0.2.2" =
    self.by-version."sauce-connect-launcher"."0.2.2";
  by-version."sauce-connect-launcher"."0.2.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-sauce-connect-launcher-0.2.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/sauce-connect-launcher/-/sauce-connect-launcher-0.2.2.tgz";
        name = "sauce-connect-launcher-0.2.2.tgz";
        sha1 = "cfd951c8b488af38d384aef14920261482e2e05a";
      })
    ];
    buildInputs =
      (self.nativeDeps."sauce-connect-launcher" or []);
    deps = [
      self.by-version."lodash"."1.3.1"
      self.by-version."async"."0.2.10"
      self.by-version."adm-zip"."0.4.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "sauce-connect-launcher" ];
  };
  by-spec."saucelabs"."~0.1.0" =
    self.by-version."saucelabs"."0.1.1";
  by-version."saucelabs"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-saucelabs-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/saucelabs/-/saucelabs-0.1.1.tgz";
        name = "saucelabs-0.1.1.tgz";
        sha1 = "5e0ea1cf3d735d6ea15fde94b5bda6bc15d2c06d";
      })
    ];
    buildInputs =
      (self.nativeDeps."saucelabs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "saucelabs" ];
  };
  by-spec."semver"."~1.1.0" =
    self.by-version."semver"."1.1.4";
  by-version."semver"."1.1.4" = lib.makeOverridable self.buildNodePackage {
    name = "semver-1.1.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/semver/-/semver-1.1.4.tgz";
        name = "semver-1.1.4.tgz";
        sha1 = "2e5a4e72bab03472cc97f72753b4508912ef5540";
      })
    ];
    buildInputs =
      (self.nativeDeps."semver" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "semver" ];
  };
  by-spec."semver"."~1.1.4" =
    self.by-version."semver"."1.1.4";
  by-spec."semver"."~2.1.0" =
    self.by-version."semver"."2.1.0";
  by-version."semver"."2.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "semver-2.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/semver/-/semver-2.1.0.tgz";
        name = "semver-2.1.0.tgz";
        sha1 = "356294a90690b698774d62cf35d7c91f983e728a";
      })
    ];
    buildInputs =
      (self.nativeDeps."semver" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "semver" ];
  };
  by-spec."send"."0.1.4" =
    self.by-version."send"."0.1.4";
  by-version."send"."0.1.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-send-0.1.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/send/-/send-0.1.4.tgz";
        name = "send-0.1.4.tgz";
        sha1 = "be70d8d1be01de61821af13780b50345a4f71abd";
      })
    ];
    buildInputs =
      (self.nativeDeps."send" or []);
    deps = [
      self.by-version."debug"."0.7.4"
      self.by-version."mime"."1.2.11"
      self.by-version."fresh"."0.2.0"
      self.by-version."range-parser"."0.0.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "send" ];
  };
  by-spec."shelljs"."0.1.x" =
    self.by-version."shelljs"."0.1.4";
  by-version."shelljs"."0.1.4" = lib.makeOverridable self.buildNodePackage {
    name = "shelljs-0.1.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/shelljs/-/shelljs-0.1.4.tgz";
        name = "shelljs-0.1.4.tgz";
        sha1 = "dfbbe78d56c3c0168d2fb79e10ecd1dbcb07ec0e";
      })
    ];
    buildInputs =
      (self.nativeDeps."shelljs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "shelljs" ];
  };
  by-spec."sigmund"."~1.0.0" =
    self.by-version."sigmund"."1.0.0";
  by-version."sigmund"."1.0.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-sigmund-1.0.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/sigmund/-/sigmund-1.0.0.tgz";
        name = "sigmund-1.0.0.tgz";
        sha1 = "66a2b3a749ae8b5fb89efd4fcc01dc94fbe02296";
      })
    ];
    buildInputs =
      (self.nativeDeps."sigmund" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "sigmund" ];
  };
  by-spec."sntp"."0.1.x" =
    self.by-version."sntp"."0.1.4";
  by-version."sntp"."0.1.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-sntp-0.1.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/sntp/-/sntp-0.1.4.tgz";
        name = "sntp-0.1.4.tgz";
        sha1 = "5ef481b951a7b29affdf4afd7f26838fc1120f84";
      })
    ];
    buildInputs =
      (self.nativeDeps."sntp" or []);
    deps = [
      self.by-version."hoek"."0.7.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "sntp" ];
  };
  by-spec."sntp"."0.2.x" =
    self.by-version."sntp"."0.2.4";
  by-version."sntp"."0.2.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-sntp-0.2.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/sntp/-/sntp-0.2.4.tgz";
        name = "sntp-0.2.4.tgz";
        sha1 = "fb885f18b0f3aad189f824862536bceeec750900";
      })
    ];
    buildInputs =
      (self.nativeDeps."sntp" or []);
    deps = [
      self.by-version."hoek"."0.9.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "sntp" ];
  };
  by-spec."socket.io"."~0.9.13" =
    self.by-version."socket.io"."0.9.16";
  by-version."socket.io"."0.9.16" = lib.makeOverridable self.buildNodePackage {
    name = "node-socket.io-0.9.16";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/socket.io/-/socket.io-0.9.16.tgz";
        name = "socket.io-0.9.16.tgz";
        sha1 = "3bab0444e49b55fbbc157424dbd41aa375a51a76";
      })
    ];
    buildInputs =
      (self.nativeDeps."socket.io" or []);
    deps = [
      self.by-version."socket.io-client"."0.9.16"
      self.by-version."policyfile"."0.0.4"
      self.by-version."base64id"."0.1.0"
      self.by-version."redis"."0.7.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "socket.io" ];
  };
  by-spec."socket.io-client"."0.9.16" =
    self.by-version."socket.io-client"."0.9.16";
  by-version."socket.io-client"."0.9.16" = lib.makeOverridable self.buildNodePackage {
    name = "node-socket.io-client-0.9.16";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/socket.io-client/-/socket.io-client-0.9.16.tgz";
        name = "socket.io-client-0.9.16.tgz";
        sha1 = "4da7515c5e773041d1b423970415bcc430f35fc6";
      })
    ];
    buildInputs =
      (self.nativeDeps."socket.io-client" or []);
    deps = [
      self.by-version."uglify-js"."1.2.5"
      self.by-version."ws"."0.4.31"
      self.by-version."xmlhttprequest"."1.4.2"
      self.by-version."active-x-obfuscator"."0.0.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "socket.io-client" ];
  };
  by-spec."source-map"."0.1.x" =
    self.by-version."source-map"."0.1.31";
  by-version."source-map"."0.1.31" = lib.makeOverridable self.buildNodePackage {
    name = "node-source-map-0.1.31";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/source-map/-/source-map-0.1.31.tgz";
        name = "source-map-0.1.31.tgz";
        sha1 = "9f704d0d69d9e138a81badf6ebb4fde33d151c61";
      })
    ];
    buildInputs =
      (self.nativeDeps."source-map" or []);
    deps = [
      self.by-version."amdefine"."0.1.0"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "source-map" ];
  };
  by-spec."source-map".">= 0.1.2" =
    self.by-version."source-map"."0.1.31";
  by-spec."source-map"."~0.1.30" =
    self.by-version."source-map"."0.1.31";
  by-spec."source-map"."~0.1.31" =
    self.by-version."source-map"."0.1.31";
  by-spec."source-map"."~0.1.7" =
    self.by-version."source-map"."0.1.31";
  by-spec."stream-counter"."~0.2.0" =
    self.by-version."stream-counter"."0.2.0";
  by-version."stream-counter"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-stream-counter-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/stream-counter/-/stream-counter-0.2.0.tgz";
        name = "stream-counter-0.2.0.tgz";
        sha1 = "ded266556319c8b0e222812b9cf3b26fa7d947de";
      })
    ];
    buildInputs =
      (self.nativeDeps."stream-counter" or []);
    deps = [
      self.by-version."readable-stream"."1.1.10"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "stream-counter" ];
  };
  by-spec."string_decoder"."~0.10.x" =
    self.by-version."string_decoder"."0.10.25";
  by-version."string_decoder"."0.10.25" = lib.makeOverridable self.buildNodePackage {
    name = "node-string_decoder-0.10.25";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/string_decoder/-/string_decoder-0.10.25.tgz";
        name = "string_decoder-0.10.25.tgz";
        sha1 = "668c9da4f8efbdc937a4a6b6bf1cfbec4e9a82e2";
      })
    ];
    buildInputs =
      (self.nativeDeps."string_decoder" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "string_decoder" ];
  };
  by-spec."stringify-object"."~0.1.4" =
    self.by-version."stringify-object"."0.1.8";
  by-version."stringify-object"."0.1.8" = lib.makeOverridable self.buildNodePackage {
    name = "node-stringify-object-0.1.8";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/stringify-object/-/stringify-object-0.1.8.tgz";
        name = "stringify-object-0.1.8.tgz";
        sha1 = "463348f38fdcd4fec1c011084c24a59ac653c1ee";
      })
    ];
    buildInputs =
      (self.nativeDeps."stringify-object" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "stringify-object" ];
  };
  by-spec."strip-ansi"."~0.1.0" =
    self.by-version."strip-ansi"."0.1.1";
  by-version."strip-ansi"."0.1.1" = lib.makeOverridable self.buildNodePackage {
    name = "strip-ansi-0.1.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/strip-ansi/-/strip-ansi-0.1.1.tgz";
        name = "strip-ansi-0.1.1.tgz";
        sha1 = "39e8a98d044d150660abe4a6808acf70bb7bc991";
      })
    ];
    buildInputs =
      (self.nativeDeps."strip-ansi" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "strip-ansi" ];
  };
  by-spec."sudo-block"."~0.2.0" =
    self.by-version."sudo-block"."0.2.1";
  by-version."sudo-block"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-sudo-block-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/sudo-block/-/sudo-block-0.2.1.tgz";
        name = "sudo-block-0.2.1.tgz";
        sha1 = "b394820741b66c0fe06f97b334f0674036837ba5";
      })
    ];
    buildInputs =
      (self.nativeDeps."sudo-block" or []);
    deps = [
      self.by-version."chalk"."0.1.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "sudo-block" ];
  };
  by-spec."tar"."~0.1.17" =
    self.by-version."tar"."0.1.19";
  by-version."tar"."0.1.19" = lib.makeOverridable self.buildNodePackage {
    name = "node-tar-0.1.19";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/tar/-/tar-0.1.19.tgz";
        name = "tar-0.1.19.tgz";
        sha1 = "fe45941799e660ce1ea52d875d37481b4bf13eac";
      })
    ];
    buildInputs =
      (self.nativeDeps."tar" or []);
    deps = [
      self.by-version."inherits"."2.0.1"
      self.by-version."block-stream"."0.0.7"
      self.by-version."fstream"."0.1.25"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "tar" ];
  };
  by-spec."throttleit"."~0.0.2" =
    self.by-version."throttleit"."0.0.2";
  by-version."throttleit"."0.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-throttleit-0.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/throttleit/-/throttleit-0.0.2.tgz";
        name = "throttleit-0.0.2.tgz";
        sha1 = "cfedf88e60c00dd9697b61fdd2a8343a9b680eaf";
      })
    ];
    buildInputs =
      (self.nativeDeps."throttleit" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "throttleit" ];
  };
  by-spec."tinycolor"."0.x" =
    self.by-version."tinycolor"."0.0.1";
  by-version."tinycolor"."0.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-tinycolor-0.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/tinycolor/-/tinycolor-0.0.1.tgz";
        name = "tinycolor-0.0.1.tgz";
        sha1 = "320b5a52d83abb5978d81a3e887d4aefb15a6164";
      })
    ];
    buildInputs =
      (self.nativeDeps."tinycolor" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "tinycolor" ];
  };
  by-spec."tmp"."~0.0.20" =
    self.by-version."tmp"."0.0.23";
  by-version."tmp"."0.0.23" = lib.makeOverridable self.buildNodePackage {
    name = "node-tmp-0.0.23";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/tmp/-/tmp-0.0.23.tgz";
        name = "tmp-0.0.23.tgz";
        sha1 = "de874aa5e974a85f0a32cdfdbd74663cb3bd9c74";
      })
    ];
    buildInputs =
      (self.nativeDeps."tmp" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "tmp" ];
  };
  by-spec."touch"."0.0.2" =
    self.by-version."touch"."0.0.2";
  by-version."touch"."0.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-touch-0.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/touch/-/touch-0.0.2.tgz";
        name = "touch-0.0.2.tgz";
        sha1 = "a65a777795e5cbbe1299499bdc42281ffb21b5f4";
      })
    ];
    buildInputs =
      (self.nativeDeps."touch" or []);
    deps = [
      self.by-version."nopt"."1.0.10"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "touch" ];
  };
  by-spec."tough-cookie".">=0.12.0" =
    self.by-version."tough-cookie"."0.12.1";
  by-version."tough-cookie"."0.12.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-tough-cookie-0.12.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/tough-cookie/-/tough-cookie-0.12.1.tgz";
        name = "tough-cookie-0.12.1.tgz";
        sha1 = "8220c7e21abd5b13d96804254bd5a81ebf2c7d62";
      })
    ];
    buildInputs =
      (self.nativeDeps."tough-cookie" or []);
    deps = [
      self.by-version."punycode"."1.2.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "tough-cookie" ];
  };
  by-spec."traverse".">=0.3.0 <0.4" =
    self.by-version."traverse"."0.3.9";
  by-version."traverse"."0.3.9" = lib.makeOverridable self.buildNodePackage {
    name = "node-traverse-0.3.9";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/traverse/-/traverse-0.3.9.tgz";
        name = "traverse-0.3.9.tgz";
        sha1 = "717b8f220cc0bb7b44e40514c22b2e8bbc70d8b9";
      })
    ];
    buildInputs =
      (self.nativeDeps."traverse" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "traverse" ];
  };
  by-spec."tunnel-agent"."~0.2.0" =
    self.by-version."tunnel-agent"."0.2.0";
  by-version."tunnel-agent"."0.2.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-tunnel-agent-0.2.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.2.0.tgz";
        name = "tunnel-agent-0.2.0.tgz";
        sha1 = "6853c2afb1b2109e45629e492bde35f459ea69e8";
      })
    ];
    buildInputs =
      (self.nativeDeps."tunnel-agent" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "tunnel-agent" ];
  };
  by-spec."tunnel-agent"."~0.3.0" =
    self.by-version."tunnel-agent"."0.3.0";
  by-version."tunnel-agent"."0.3.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-tunnel-agent-0.3.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.3.0.tgz";
        name = "tunnel-agent-0.3.0.tgz";
        sha1 = "ad681b68f5321ad2827c4cfb1b7d5df2cfe942ee";
      })
    ];
    buildInputs =
      (self.nativeDeps."tunnel-agent" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "tunnel-agent" ];
  };
  by-spec."uglify-js"."1.2.5" =
    self.by-version."uglify-js"."1.2.5";
  by-version."uglify-js"."1.2.5" = lib.makeOverridable self.buildNodePackage {
    name = "uglify-js-1.2.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/uglify-js/-/uglify-js-1.2.5.tgz";
        name = "uglify-js-1.2.5.tgz";
        sha1 = "b542c2c76f78efb34b200b20177634330ff702b6";
      })
    ];
    buildInputs =
      (self.nativeDeps."uglify-js" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "uglify-js" ];
  };
  by-spec."uglify-js"."~2.3" =
    self.by-version."uglify-js"."2.3.6";
  by-version."uglify-js"."2.3.6" = lib.makeOverridable self.buildNodePackage {
    name = "uglify-js-2.3.6";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/uglify-js/-/uglify-js-2.3.6.tgz";
        name = "uglify-js-2.3.6.tgz";
        sha1 = "fa0984770b428b7a9b2a8058f46355d14fef211a";
      })
    ];
    buildInputs =
      (self.nativeDeps."uglify-js" or []);
    deps = [
      self.by-version."async"."0.2.10"
      self.by-version."source-map"."0.1.31"
      self.by-version."optimist"."0.3.7"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "uglify-js" ];
  };
  by-spec."uglify-js"."~2.4.0" =
    self.by-version."uglify-js"."2.4.12";
  by-version."uglify-js"."2.4.12" = lib.makeOverridable self.buildNodePackage {
    name = "uglify-js-2.4.12";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/uglify-js/-/uglify-js-2.4.12.tgz";
        name = "uglify-js-2.4.12.tgz";
        sha1 = "2354d9659f85330c1e3e2910f8acd77fe14bb4a8";
      })
    ];
    buildInputs =
      (self.nativeDeps."uglify-js" or []);
    deps = [
      self.by-version."async"."0.2.10"
      self.by-version."source-map"."0.1.31"
      self.by-version."optimist"."0.3.7"
      self.by-version."uglify-to-browserify"."1.0.2"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "uglify-js" ];
  };
  by-spec."uglify-to-browserify"."~1.0.0" =
    self.by-version."uglify-to-browserify"."1.0.2";
  by-version."uglify-to-browserify"."1.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-uglify-to-browserify-1.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/uglify-to-browserify/-/uglify-to-browserify-1.0.2.tgz";
        name = "uglify-to-browserify-1.0.2.tgz";
        sha1 = "6e0924d6bda6b5afe349e39a6d632850a0f882b7";
      })
    ];
    buildInputs =
      (self.nativeDeps."uglify-to-browserify" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "uglify-to-browserify" ];
  };
  by-spec."uid2"."0.0.3" =
    self.by-version."uid2"."0.0.3";
  by-version."uid2"."0.0.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-uid2-0.0.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/uid2/-/uid2-0.0.3.tgz";
        name = "uid2-0.0.3.tgz";
        sha1 = "483126e11774df2f71b8b639dcd799c376162b82";
      })
    ];
    buildInputs =
      (self.nativeDeps."uid2" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "uid2" ];
  };
  by-spec."underscore"."1.4.x" =
    self.by-version."underscore"."1.4.4";
  by-version."underscore"."1.4.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-underscore-1.4.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/underscore/-/underscore-1.4.4.tgz";
        name = "underscore-1.4.4.tgz";
        sha1 = "61a6a32010622afa07963bf325203cf12239d604";
      })
    ];
    buildInputs =
      (self.nativeDeps."underscore" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "underscore" ];
  };
  by-spec."underscore"."~1.4.3" =
    self.by-version."underscore"."1.4.4";
  by-spec."underscore"."~1.4.4" =
    self.by-version."underscore"."1.4.4";
  by-spec."underscore.string"."~2.2.1" =
    self.by-version."underscore.string"."2.2.1";
  by-version."underscore.string"."2.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-underscore.string-2.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/underscore.string/-/underscore.string-2.2.1.tgz";
        name = "underscore.string-2.2.1.tgz";
        sha1 = "d7c0fa2af5d5a1a67f4253daee98132e733f0f19";
      })
    ];
    buildInputs =
      (self.nativeDeps."underscore.string" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "underscore.string" ];
  };
  by-spec."underscore.string"."~2.3.1" =
    self.by-version."underscore.string"."2.3.3";
  by-version."underscore.string"."2.3.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-underscore.string-2.3.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/underscore.string/-/underscore.string-2.3.3.tgz";
        name = "underscore.string-2.3.3.tgz";
        sha1 = "71c08bf6b428b1133f37e78fa3a21c82f7329b0d";
      })
    ];
    buildInputs =
      (self.nativeDeps."underscore.string" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "underscore.string" ];
  };
  by-spec."underscore.string"."~2.3.3" =
    self.by-version."underscore.string"."2.3.3";
  by-spec."update-notifier"."~0.1.3" =
    self.by-version."update-notifier"."0.1.7";
  by-version."update-notifier"."0.1.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-update-notifier-0.1.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/update-notifier/-/update-notifier-0.1.7.tgz";
        name = "update-notifier-0.1.7.tgz";
        sha1 = "b37fb55004835240fd2e7e360c52ccffde5219c9";
      })
    ];
    buildInputs =
      (self.nativeDeps."update-notifier" or []);
    deps = [
      self.by-version."request"."2.27.0"
      self.by-version."configstore"."0.1.7"
      self.by-version."semver"."2.1.0"
      self.by-version."chalk"."0.2.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "update-notifier" ];
  };
  by-spec."useragent"."~2.0.4" =
    self.by-version."useragent"."2.0.7";
  by-version."useragent"."2.0.7" = lib.makeOverridable self.buildNodePackage {
    name = "node-useragent-2.0.7";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/useragent/-/useragent-2.0.7.tgz";
        name = "useragent-2.0.7.tgz";
        sha1 = "a44c07d157a15e13d73d4af4ece6aab70f298224";
      })
    ];
    buildInputs =
      (self.nativeDeps."useragent" or []);
    deps = [
      self.by-version."lru-cache"."2.2.4"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "useragent" ];
  };
  by-spec."utile"."~0.2.1" =
    self.by-version."utile"."0.2.1";
  by-version."utile"."0.2.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-utile-0.2.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/utile/-/utile-0.2.1.tgz";
        name = "utile-0.2.1.tgz";
        sha1 = "930c88e99098d6220834c356cbd9a770522d90d7";
      })
    ];
    buildInputs =
      (self.nativeDeps."utile" or []);
    deps = [
      self.by-version."async"."0.2.10"
      self.by-version."deep-equal"."0.2.1"
      self.by-version."i"."0.3.2"
      self.by-version."mkdirp"."0.3.5"
      self.by-version."ncp"."0.4.2"
      self.by-version."rimraf"."2.2.6"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "utile" ];
  };
  by-spec."vargs"."~0.1.0" =
    self.by-version."vargs"."0.1.0";
  by-version."vargs"."0.1.0" = lib.makeOverridable self.buildNodePackage {
    name = "node-vargs-0.1.0";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/vargs/-/vargs-0.1.0.tgz";
        name = "vargs-0.1.0.tgz";
        sha1 = "6b6184da6520cc3204ce1b407cac26d92609ebff";
      })
    ];
    buildInputs =
      (self.nativeDeps."vargs" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "vargs" ];
  };
  by-spec."wd"."~0.2.8" =
    self.by-version."wd"."0.2.10";
  by-version."wd"."0.2.10" = lib.makeOverridable self.buildNodePackage {
    name = "wd-0.2.10";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/wd/-/wd-0.2.10.tgz";
        name = "wd-0.2.10.tgz";
        sha1 = "c4ac58eff5f32cc8e79e8f272a4c365c4240a68e";
      })
    ];
    buildInputs =
      (self.nativeDeps."wd" or []);
    deps = [
      self.by-version."async"."0.2.10"
      self.by-version."vargs"."0.1.0"
      self.by-version."q"."1.0.0"
      self.by-version."request"."2.33.0"
      self.by-version."archiver"."0.5.2"
      self.by-version."lodash"."2.4.1"
      self.by-version."underscore.string"."2.3.3"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "wd" ];
  };
  by-spec."which"."*" =
    self.by-version."which"."1.0.5";
  by-version."which"."1.0.5" = lib.makeOverridable self.buildNodePackage {
    name = "which-1.0.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/which/-/which-1.0.5.tgz";
        name = "which-1.0.5.tgz";
        sha1 = "5630d6819dda692f1464462e7956cb42c0842739";
      })
    ];
    buildInputs =
      (self.nativeDeps."which" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "which" ];
  };
  by-spec."which"."1.0.x" =
    self.by-version."which"."1.0.5";
  by-spec."which"."~1.0.5" =
    self.by-version."which"."1.0.5";
  by-spec."wordwrap"."0.0.x" =
    self.by-version."wordwrap"."0.0.2";
  by-version."wordwrap"."0.0.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-wordwrap-0.0.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/wordwrap/-/wordwrap-0.0.2.tgz";
        name = "wordwrap-0.0.2.tgz";
        sha1 = "b79669bb42ecb409f83d583cad52ca17eaa1643f";
      })
    ];
    buildInputs =
      (self.nativeDeps."wordwrap" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "wordwrap" ];
  };
  by-spec."wordwrap"."~0.0.2" =
    self.by-version."wordwrap"."0.0.2";
  by-spec."ws"."0.4.x" =
    self.by-version."ws"."0.4.31";
  by-version."ws"."0.4.31" = lib.makeOverridable self.buildNodePackage {
    name = "ws-0.4.31";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/ws/-/ws-0.4.31.tgz";
        name = "ws-0.4.31.tgz";
        sha1 = "5a4849e7a9ccd1ed5a81aeb4847c9fedf3122927";
      })
    ];
    buildInputs =
      (self.nativeDeps."ws" or []);
    deps = [
      self.by-version."commander"."0.6.1"
      self.by-version."nan"."0.3.2"
      self.by-version."tinycolor"."0.0.1"
      self.by-version."options"."0.0.5"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "ws" ];
  };
  by-spec."xmlbuilder"."0.4.2" =
    self.by-version."xmlbuilder"."0.4.2";
  by-version."xmlbuilder"."0.4.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-xmlbuilder-0.4.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/xmlbuilder/-/xmlbuilder-0.4.2.tgz";
        name = "xmlbuilder-0.4.2.tgz";
        sha1 = "1776d65f3fdbad470a08d8604cdeb1c4e540ff83";
      })
    ];
    buildInputs =
      (self.nativeDeps."xmlbuilder" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "xmlbuilder" ];
  };
  by-spec."xmlhttprequest"."1.4.2" =
    self.by-version."xmlhttprequest"."1.4.2";
  by-version."xmlhttprequest"."1.4.2" = lib.makeOverridable self.buildNodePackage {
    name = "node-xmlhttprequest-1.4.2";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/xmlhttprequest/-/xmlhttprequest-1.4.2.tgz";
        name = "xmlhttprequest-1.4.2.tgz";
        sha1 = "01453a1d9bed1e8f172f6495bbf4c8c426321500";
      })
    ];
    buildInputs =
      (self.nativeDeps."xmlhttprequest" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "xmlhttprequest" ];
  };
  by-spec."yaml"."0.2.3" =
    self.by-version."yaml"."0.2.3";
  by-version."yaml"."0.2.3" = lib.makeOverridable self.buildNodePackage {
    name = "node-yaml-0.2.3";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/yaml/-/yaml-0.2.3.tgz";
        name = "yaml-0.2.3.tgz";
        sha1 = "b5450e92e76ef36b5dd24e3660091ebaeef3e5c7";
      })
    ];
    buildInputs =
      (self.nativeDeps."yaml" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "yaml" ];
  };
  by-spec."zeparser"."0.0.5" =
    self.by-version."zeparser"."0.0.5";
  by-version."zeparser"."0.0.5" = lib.makeOverridable self.buildNodePackage {
    name = "node-zeparser-0.0.5";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/zeparser/-/zeparser-0.0.5.tgz";
        name = "zeparser-0.0.5.tgz";
        sha1 = "03726561bc268f2e5444f54c665b7fd4a8c029e2";
      })
    ];
    buildInputs =
      (self.nativeDeps."zeparser" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "zeparser" ];
  };
  by-spec."zip-stream"."~0.1.0" =
    self.by-version."zip-stream"."0.1.4";
  by-version."zip-stream"."0.1.4" = lib.makeOverridable self.buildNodePackage {
    name = "node-zip-stream-0.1.4";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/zip-stream/-/zip-stream-0.1.4.tgz";
        name = "zip-stream-0.1.4.tgz";
        sha1 = "fe5b565bc366b8d73d5d4c1606e07c8947de1654";
      })
    ];
    buildInputs =
      (self.nativeDeps."zip-stream" or []);
    deps = [
      self.by-version."readable-stream"."1.0.25"
      self.by-version."lodash.defaults"."2.4.1"
    ];
    peerDependencies = [
    ];
    passthru.names = [ "zip-stream" ];
  };
  by-spec."zlib-browserify"."0.0.1" =
    self.by-version."zlib-browserify"."0.0.1";
  by-version."zlib-browserify"."0.0.1" = lib.makeOverridable self.buildNodePackage {
    name = "node-zlib-browserify-0.0.1";
    src = [
      (fetchurl {
        url = "http://registry.npmjs.org/zlib-browserify/-/zlib-browserify-0.0.1.tgz";
        name = "zlib-browserify-0.0.1.tgz";
        sha1 = "4fa6a45d00dbc15f318a4afa1d9afc0258e176cc";
      })
    ];
    buildInputs =
      (self.nativeDeps."zlib-browserify" or []);
    deps = [
    ];
    peerDependencies = [
    ];
    passthru.names = [ "zlib-browserify" ];
  };
}
