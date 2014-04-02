{ mockup ? { outPath = ./.; name = "mockup"; }
}:
let
  pkgs = import <nixpkgs> {};
  bowerComponents = pkgs.callPackage ./bower.nix {
    inherit (pkgs) fetchbower buildEnv;
  };
  nodePackages = import <nixpkgs/pkgs/top-level/node-packages.nix> {
    inherit pkgs;
    inherit (pkgs) stdenv nodejs fetchurl fetchgit;
    neededNatives = [ pkgs.python ] ++ pkgs.lib.optional pkgs.stdenv.isLinux pkgs.utillinux;
    self = nodePackages;
    generated = ./package.nix;
  };
in rec {
  tarball = pkgs.runCommand "mockup-1.6.0.tgz" { buildInputs = [ pkgs.nodejs ]; } ''
    mv `HOME=$PWD npm pack ${mockup}` $out
  '';
  build = nodePackages.buildNodePackage {
    name = "mockup-1.6.0";
    src = [ tarball ];
    buildInputs = [ bowerComponents ];
    deps = with nodePackages; [
      bower
      coveralls
      extend
      grunt
      grunt-cli
      grunt-contrib-copy
      grunt-contrib-jshint
      grunt-contrib-less
      grunt-contrib-requirejs
      grunt-contrib-uglify
      grunt-contrib-watch
      grunt-jscs-checker
      grunt-karma
      grunt-sed
      karma
      karma-chrome-launcher
      karma-coverage
      karma-junit-reporter
      karma-mocha
      karma-phantomjs-launcher
      karma-requirejs
      karma-sauce-launcher
      karma-script-launcher
      lcov-result-merger
      less
      mocha
      requirejs
    ];
    postInstall = ''
      ln -s ${bowerComponents} $out/bower_components
    '';

    peerDependencies = [];
    passthru.names = [ "mockup" ];
  };
}
