# <%= projectName %>

<%= projectDescription %>

## GIT

```
git checkout <%= projectRepository %>
```

## Setup

```
$ npm install
<% if( useBower ) { %>$ bower install<%  } %>
```

## Run

```
$ grunt
```

## RUN TESTS

Use [Beefy](http://didact.us/beefy/) to develop and test your modules independently before integrating into the framework.

```bash
$ cd <%= projectName %>
$ beefy test/thingtotest/index.js [PORT] [-- browserify args]
```

## NPM MODULES

When installing modules be sure to use `npm install --save` for dependencies that will be used in the actual application deployed to the server.

And `npm install --save-dev` for modules that are only used on your system for workflow and development, like automated grunts tasks etc.

[List of Jam3 Node modules](https://docs.google.com/a/jam3.com/spreadsheets/d/1bPImGwGLjqbOnBxMNmqGVz2mdfVb_R2FKaaoOw1IyP8/edit#gid=0)
