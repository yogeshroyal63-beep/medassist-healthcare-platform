const axios = require("axios");
const mongoose = require("mongoose");

const { aiServiceUrl } = require("../../config/env");
const Triage = require("./triage.model");

async function runTriage(user, body) {
  const symptoms = String(body.symptoms || "").trim();
  if (!symptoms) {
    const err = new Error("Symptoms are required");
    err.status = 400;
    throw err;
  }

  const aiResp = await axios.post(
    `${aiServiceUrl}/triage`,
    { symptoms, age: body.age ?? null },
    { timeout: 15000 }
  );
  const ai = aiResp.data || {};

  const userId = user.id;
  const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

  if (isValidObjectId) {
    try {
      await Triage.create({
        userId,
        symptoms,
        age: body.age ?? undefined,
        status: ai.status || "",
        topCondition: ai.top_condition || "",
        severity: ai.severity || "",
        predictions: Array.isArray(ai.predictions) ? ai.predictions : [],
        specialty: ai.specialty || undefined,
        advice: ai.advice || undefined,
        isEmergency: ai.status === "emergency",
        rawResponse: ai,
      });
    } catch {
      // saving triage history should never block the response
    }
  }

  return ai;
}

async function history(user) {
  if (!mongoose.Types.ObjectId.isValid(user.id)) return [];
  return Triage.find({ userId: user.id }).sort({ createdAt: -1 }).limit(200);
}

module.exports = { runTriage, history };

