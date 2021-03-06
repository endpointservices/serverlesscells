import * as routes from './routes.mjs';
import {default as pathToRegexp} from 'path-to-regexp'
const keys = [];
const regexp = pathToRegexp(routes.pattern, keys)

function params(url) {
    const ret = {};
    const values = [...regexp.exec(url)].slice(1);
    for (let i = 0; i < keys.length; i++) {
        if (values[i]) ret[keys[i].name] = values[i];
    }
    return ret;
}


test('Route patterns default', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "default",
        "hasMods": false
    })
});


test('Route patterns regions', () => {
    const p = params("/regions/asia-east1/notebooks/@tomlarkworthy/echo-server")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "default",
        "hasMods": false
    })
});

test('Route patterns simple', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server/deployments/echo")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "echo",
        "hasMods": false
    })
});


test('Route patterns mods', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server/deploys/echo/mods/XT")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "echo",
        "isTerminal": true,
        "isExternal": true,
        "isOrchestrator": false,
        "hasMods": true,
    })
});



test('Route patterns mods, metadata first', () => {
    const p = params("/mods/XT/notebooks/@tomlarkworthy/echo-server/deploys/echo")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "echo",
        "isTerminal": true,
        "isExternal": true,
        "isOrchestrator": false,
        "hasMods": true,
    })
});

test('Route patterns deployments to deploy', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server/deploys/echo")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "echo",
        "hasMods": false
    })
});

test('Route patterns simple with secrets', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server/deployments/echo/secrets/a,b")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": ["a","b"],
        "userURL": "/" ,
        "deploy": "echo",
        "hasMods": false
    })
});

test('Route patterns simple with user URL', () => {
    const url = '/notebooks/@tomlarkworthy/echo-server/deployments/echo/yoyoyo'
    expect(routes.decode({
        params: params(url),
        url: url
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": [],
        "baseURL": "/notebooks/@tomlarkworthy/echo-server/deployments/echo" ,
        "userURL": "/yoyoyo" ,
        "deploy": "echo",
        "hasMods": false
    })
});

test('Route patterns simple with secrets with user URL', () => {
    const url = "/notebooks/@tomlarkworthy/echo-server/deployments/echo/secrets/e/yoyoyo"
    expect(routes.decode({
        params: params(url),
        url: url
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server",
        "secretKeys": ["e"],
        "baseURL": "/notebooks/@tomlarkworthy/echo-server/deployments/echo/secrets/e" ,
        "userURL": "/yoyoyo",
        "deploy": "echo",
        "hasMods": false
    })
});

test('Route patterns simple with cell', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server/deployments/echo/cells/cell")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server?cell=cell",
        "secretKeys": [],
        "userURL": "/",
        "deploy": "echo",
        "hasMods": false
    })
});

test('Route patterns simple with cell and user URL', () => {
    const url = "/notebooks/@tomlarkworthy/echo-server/deployments/echo/cells/cell/yoyoyo"
    expect(routes.decode({
        params: params(url),
        url: url
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server?cell=cell",
        "secretKeys": [],
        "baseURL": "/notebooks/@tomlarkworthy/echo-server/deployments/echo/cells/cell" ,
        "userURL": "/yoyoyo",
        "deploy": "echo",
        "hasMods": false
    })
});


test('Route patterns simple with secrets with cell', () => {
    const p = params("/notebooks/@tomlarkworthy/echo-server/deployments/echo/secrets/a/cells/cell")
    expect(routes.decode({
        params: p
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server?cell=cell",
        "secretKeys": ["a"],
        "userURL": "/",
        "deploy": "echo",
        "hasMods": false
    })
});

test('Route patterns simple with secrets with cell and user URL', () => {
    const url = "/notebooks/@tomlarkworthy/echo-server/deployments/echo/secrets/c,d/cells/cell/yoyoyo"
    const p = params(url)
    expect(routes.decode({
        params: p,
        url
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server?cell=cell",
        "secretKeys": ["c", "d"],
        "baseURL": "/notebooks/@tomlarkworthy/echo-server/deployments/echo/secrets/c,d/cells/cell",
        "userURL": "/yoyoyo",
        "deploy": "echo",
        "hasMods": false
    })
});



test('Route patterns simple with secrets with cell and user URL, meta data first', () => {
    const url = "/secrets/c,d/cells/cell/notebooks/@tomlarkworthy/echo-server/deployments/echo/yoyoyo"
    expect(routes.decode({
        params: params(url),
        url: url
    })).toEqual({
        "shard": "@tomlarkworthy/echo-server",
        "notebook": "echo-server",
        "notebookURL": "https://observablehq.com/embed/@tomlarkworthy/echo-server?cell=cell",
        "secretKeys": ["c", "d"],
        "baseURL": "/secrets/c,d/cells/cell/notebooks/@tomlarkworthy/echo-server/deployments/echo",
        "userURL": "/yoyoyo",
        "deploy": "echo",
        "hasMods": false
    })
});