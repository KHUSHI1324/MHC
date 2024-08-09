const messageModel = require("../modules/msg.Module");

exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
   const timestamp = new Date();

    const data = await messageModel.create({
      message: { text: message, },
      users: [from, to],
      sender: from,
      createdAt: timestamp,
    });

    if (data) return res.json({ msg: "Message added successfully" });
    return res.json({ msg: "Failed to add message" });
  } catch (error) {
    next(error);
  }
};

exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ createdAt: 1 }); // Sort by createdAt field to get the messages in chronological order

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        timestamp: msg.createdAt,
      };
    });
    res.json(projectedMessages);
  } catch (error) {
    next(error);
  }
};