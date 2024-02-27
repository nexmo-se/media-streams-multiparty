import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import { generateToken, getCredentials } from './opentok/index.js';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { vcr } from '@vonage/vcr-sdk';
import { env } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const envPath = path.join(__dirname, '..');
// dotenv.config({ path: `${__dirname}/.env.local` });
// console.log(`${__dirname}/.env.local`);
// console.log(envPath);

const isDev = false; // Determine the environment

const port = process.env.VCR_PORT || 3000;

// const { preload, css, js } = await parser({ input, outDir, publicPath, isDev });
const session = vcr.createSession();
const state = vcr.getInstanceState();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const sessions = {};

app.get('/session/:room', async (req, res) => {
  try {
    const { room: roomName } = req.params;
    console.log(sessions);
    if (sessions[roomName]) {
      const data = generateToken(sessions[roomName]);
      res.json({
        sessionId: sessions[roomName],
        token: data.token,
        apiKey: data.apiKey,
      });
    } else {
      const data = await getCredentials();
      sessions[roomName] = data.sessionId;
      res.json({
        sessionId: data.sessionId,
        token: data.token,
        apiKey: data.apiKey,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.get('/api/v1/hello', (_req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

// if (!process.env['VITE']) {
//   const frontendFiles = process.cwd() + '/dist';
//   app.use(express.static(frontendFiles));
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/issue', async (req, res) => {
  try {
    // console.log(req.body);
    const state = vcr.getInstanceState();
    const issue = req.body.issue;
    const issueid = issue.issueId;
    const resp = await state.mapSet('issues', { [issueid]: JSON.stringify(issue) });
    // const resp = await state.set(issueid, issue);
    console.log(resp);
    res.send(resp);
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});

app.get('/issues', async (req, res) => {
  try {
    const state = vcr.getInstanceState();
    // console.log(req.body);
    const issue = req.body.issue;
    console.log(issue);

    const resp = await state.mapGetAll('issues');
    console.log(resp);
    res.send(resp);
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});
// app.listen(port);
// }

app.get('/*', (req, res) => {
  console.log('testing');
  // res.sendFile(frontendFiles + '/index.html');
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  // res.sendFile('/Users/jmolinasanz/Desktop/projects/my-vveapp/dist/index.html');
});

app.listen(port, () => {
  console.log('Server listening on port', port);
});
