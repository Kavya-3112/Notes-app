// routes/notes.js

const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const User = require('../models/User');
const checkAuth = require('../middleware/checkAuth');

// Endpoint to share a note
router.post('/:noteId/share', checkAuth, async (req, res) => {
  const { noteId } = req.params;
  const { email } = req.body;

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send('Note not found');
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).send('You do not have permission to share this note');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!note.sharedWith.includes(user._id)) {
      note.sharedWith.push(user._id);
      await note.save();
    }

    res.status(200).send('Note shared successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
