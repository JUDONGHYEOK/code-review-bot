const { main } = require('./langchain');
const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.post('/', async (req, res) => {
  try {
    const { diff, owner, repo, pull_number } = req.body;
    const response = await main(diff, owner, repo, pull_number);
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: response,
    });
    console.log(response);
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});
app.listen(3000, () => {
  console.log('server is running at 3000');
});
