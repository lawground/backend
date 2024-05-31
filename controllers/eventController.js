const eventModel = require('../models/eventModel');

// 모든 이벤트 조회
exports.getAllEvents = async (req, res) => {
  const office_id = req.user.office_id;
  try {
    const events = await eventModel.getAllEvents(office_id);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events', error });
  }
};

// 이벤트 생성
exports.createEvent = async (req, res) => {
  try {
    const id = await eventModel.createEvent(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// 이벤트 업데이트
exports.updateEvent = async (req, res) => {
  try {
    await eventModel.updateEvent(req.params.id, req.body);
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

// 이벤트 삭제
exports.deleteEvent = async (req, res) => {
    const office_id = req.user.office_id;
  try {
    await eventModel.deleteEvent(req.params.id, office_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
