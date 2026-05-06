const triageService = require("./triage.service");

async function triage(req, res, next) {
  try {
    const result = await triageService.runTriage(req.user, req.body || {});
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function history(req, res, next) {
  try {
    const result = await triageService.history(req.user);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

module.exports = { triage, history };

