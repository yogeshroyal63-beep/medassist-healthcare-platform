const appointmentService = require("./appointment.service");

async function book(req, res, next) {
  try {
    const result = await appointmentService.book(req.user, req.body || {});
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

async function my(req, res, next) {
  try {
    const result = await appointmentService.myAppointments(req.user);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function status(req, res, next) {
  try {
    const result = await appointmentService.updateStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function cancel(req, res, next) {
  try {
    const result = await appointmentService.cancel(req.user, req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

module.exports = { book, my, status, cancel };

