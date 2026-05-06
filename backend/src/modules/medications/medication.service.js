const Medication = require("./medication.model");

const resetIfNewDay = async (patientId) => {
  const today = new Date().toISOString().split("T")[0];
  await Medication.updateMany({ patientId, takenToday: true, lastTakenDate: { $ne: today } }, { takenToday: false });
};

async function add(user, body) {
  const med = await Medication.create({ ...body, patientId: user.id });
  return med;
}

async function getAll(user) {
  await resetIfNewDay(user.id);
  return Medication.find({ patientId: user.id }).sort({ createdAt: -1 });
}

async function update(user, id, body) {
  const med = await Medication.findOneAndUpdate({ _id: id, patientId: user.id }, body, { new: true });
  if (!med) {
    const err = new Error("Medication not found");
    err.status = 404;
    throw err;
  }
  return med;
}

async function remove(user, id) {
  const med = await Medication.findOneAndDelete({ _id: id, patientId: user.id });
  if (!med) {
    const err = new Error("Medication not found");
    err.status = 404;
    throw err;
  }
  return { message: "Deleted" };
}

async function markTaken(user, id) {
  const today = new Date().toISOString().split("T")[0];
  const med = await Medication.findOneAndUpdate(
    { _id: id, patientId: user.id },
    { takenToday: true, lastTakenDate: today },
    { new: true }
  );
  if (!med) {
    const err = new Error("Medication not found");
    err.status = 404;
    throw err;
  }
  return med;
}

module.exports = { add, getAll, update, remove, markTaken };

