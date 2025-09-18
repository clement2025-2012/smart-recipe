
Smart Recipe Generator — Ready-to-deploy project
-----------------------------------------------

WHAT'S INSIDE
- server.js     -> Node/Express backend that calls OpenAI (needs OPENAI_API_KEY)
- package.json  -> dependencies & start script
- public/       -> frontend PWA (index.html, app.js, style.css, manifest, service-worker)

HOW TO RUN LOCALLY
1. unzip this folder
2. create a file named .env in the root with:
   OPENAI_API_KEY=your_openai_key_here
3. run:
   npm install
   npm start
4. open http://localhost:3000

DEPLOY (simple)
- Deploy whole repo to Render as a Node web service (it serves static files + API).
- Add OPENAI_API_KEY in Render environment variables.

NOTES
- The project expects the OpenAI SDK. Replace the model or SDK calls if needed.
- AI responses should be valid JSON (the system prompt asks for JSON output).
