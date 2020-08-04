module.exports = {
	"env": {
		"es6": true,
		"react-native/react-native":true
	},
	"extends": "eslint:recommended",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"plugins": [
		"react",
	"react-native"
	],
	"rules": {
		"react/jsx-uses-vars": 2,
		"react/jsx-uses-react":2,
		"react-native/no-unused-styles": 2,
		"react-native/split-platform-components": 2,
	}

};
