module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": "warn",
        "no-undef": "off",
        "no-console": "off",
        "no-constant-condition": "off",
        "no-async-promise-executor": "warn",
        "no-prototype-builtins": "off",
        "no-useless-escape": "warn"
    },
    "globals": {
        "require": "readonly",
        "module": "readonly",
        "exports": "readonly",
        "process": "readonly",
        "__dirname": "readonly",
        "__filename": "readonly",
        "console": "readonly",
        "Buffer": "readonly",
        "global": "readonly",
        "setTimeout": "readonly",
        "clearTimeout": "readonly",
        "setInterval": "readonly",
        "clearInterval": "readonly"
    }
};
