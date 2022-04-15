/* eslint-env node */
module.exports = {
    "root": true,
    "extends": [
        "plugin:vue/vue3-essential",
        "eslint:recommended"
    ],
    "env": {
        "vue/setup-compiler-macros": true,
        "es6": true,
        "node": true
    },
    "globals": {
        "bootstrap": "readonly"
    },
    "rules": {
        "vue/multi-word-component-names": ["error", {
            "ignores": ["Indoors", "Outdoors", "Urban"]
        }]
    }
}
