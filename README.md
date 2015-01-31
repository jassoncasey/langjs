#langjs-starter
Framework for building a language in nodejs

## Prerequisites
* install nodejs
* sudo npm install -g grunt-cli

### NPM Cleanup
Your npm permissions may be amiss, fix them ...
* sudo chown -R $(whoami) ~/.npm

## Setup
* git clone the repo
* cd lang/
* npm install

## Usage
* grunt              - build project and execute tests
* grunt clear        - clean the build tree
* ./index <files...> - compile target files
    * -p             - display the parse tree
    * -e             - display the elaboration tree
    * -h             - display command help

