# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# How deploy project as chrome-extension
1. Run `yarn install` at root
2. Need create production build using `npm run build` command.(Appears 'build' folder)
3. Visit chrome://extensions/ and turn on "Developer mode"
4. Click "Load unpacked" button and navigate to the build folder that you created early

If you pull down new changes or make a change to the extension's files locally, you'll need to hit the "refresh" icon in chrome://extensions/ in order to run the new functionality...

# Note
contentScripts.js -  listening document events, and handle event from site where `authEvent` will fire 