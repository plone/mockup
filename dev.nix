{ }:

let
  pkgs = import <nixpkgs> { };
in

with pkgs;

buildEnv {
  name = "mockup-env";
  ignoreCollisions = true;
  paths = [
    nodejs
    nodePackages."bower"
    nodePackages."grunt-cli"
    nodePackages."grunt-contrib-jshint"
    nodePackages."grunt-contrib-requirejs"
    nodePackages."grunt-contrib-less"
    nodePackages."grunt-contrib-cssmin"
    nodePackages."grunt-contrib-uglify"
    nodePackages."grunt-karma"
    nodePackages."karma"
    nodePackages."karma-mocha"
    nodePackages."karma-coverage"
    nodePackages."karma-requirejs"
    nodePackages."karma-sauce-launcher"
    nodePackages."karma-chrome-launcher"
    nodePackages."karma-junit-reporter"
    nodePackages."almond"
    nodePackages."lcov-result-merger"
    nodePackages."coveralls"
  ];
}
