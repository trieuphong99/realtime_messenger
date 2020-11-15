import notification from "./../services/notificationService";

let readMore = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberNotifications = +(req.query.skipNumber);

    // get more items
    let newNotifications = await notification.readMore(req.user._id, skipNumberNotifications);
    return res.status(200).send(newNotifications);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  readMore: readMore
};