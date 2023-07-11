# Taquito React template

![Built with Taquito][logo]

A minimal React setup for starting developing Tezos DApps quickly with Taquito.

## Getting Started

1. Make sure you have https://nodejs.org/ installed on your computer
2. Create a new repository from taquito-boilerplate by clicking "Use this template".
3. Clone your new repository:

   `git clone <YOUR_REPOSITORY_URL>`

4. Change your current working directory to the newly cloned repository directory.
5. Install dependencies:

   `npm install`

6. Start development server:

   `npm run dev`

7. Open http://localhost:5173/ in your browser to see a sample application.

## Building the App

1. Run the command:

   `npm run build`

2. After you have build the app you can run it locally:

   `npm run preview`

3. Open http://localhost:4173/ in your browser to see the production build. 

   For more information read the [Vite Guide](https://vitejs.dev/guide/static-deploy.html)

[logo]: https://raw.githubusercontent.com/ecadlabs/taquito-boilerplate/master/assets/built-with-taquito.png "Built with Taquito"

> ## Polyfill
>
> Before we start we need to add the following dependencies in order to not get polyfill issues. The reason for this step is that certain required dependencies are Node APIs, thus not included in Browsers. But still needed for communication and interaction with Wallets and Smart Contracts.
> For a better understanding here are the steps described. 
>
> You do not need to do the steps as it is already configured.
>
> Run `npm install buffer stream-browserify util events process`
>
> Then create a new file `nodeSpecific.ts` in the src folder of the project and add:
> ```js
> import { Buffer } from 'buffer'
>
> globalThis.Buffer = Buffer
> ```
>
> Then open the `index.html` file and add the following script in the body. 
> It should look like this:
>
> ```js
> <body>
>   <div id="root"></div>
>    <script type="module" src="/src/nodeSpecific.ts"></script> //add this line
>    <script type="module" src="/src/main.tsx"></script>
> </body>
> ```
>
> Finally open the `vite.config.ts` file and add the `resolve` part:
>
> ```js
> import { defineConfig } from 'vite'
> import react from '@vitejs/plugin-react-swc'
> 
> // https://vitejs.dev/config/
> export default defineConfig({
>   define: {
>     global: {},
>   },
>   plugins: [react()],
>   resolve: {
>     alias: {
>       stream: 'stream-browserify',
>       os: 'os-browserify/browser',
>       util: 'util',
>       process: 'process/browser',
>       buffer: 'buffer',
>     },
>   },
> })
> ```
>
> Now we can run the app. 
