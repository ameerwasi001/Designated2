const Receiver = require("../Models/userModel");
const Notification = require("../Models/notificationModel");
const admin = require("firebase-admin");
let serviceAccount = require("../Utils/divet-350b8-firebase-adminsdk-l95jt-16cafcbd1d copy.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const singleNotification = ({ token, title, body, data }) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("dataaaa", data);
      console.log("FCM TOKEN: ", token);
      admin
        .messaging()
        .send({
          token: token,
          notification: {
            title,
            body,
          },
          // data: JSON.stringify(data),

          data: { notification: JSON.stringify(data) },
        })
        .then((response) => {
          // console.log("dataaaaaaaa" + data);
          console.log("Message were sent successfully", response);
          resolve(response);
        })
        .catch((err) => {
          console.log("Error in sending msg internally: ", err);
          // reject({
          //   message:
          //     err.message || "Something went wrong in sending notification!",
          // });
          resolve();
        });
    } catch (error) {
      console.log("ERROR", error);
      // reject(error);
      resolve();
    }
  });
module.exports = {
  sendNotification: async (data) => {
    let notification = null;
    if (data.type === "driverArrived") {
      notification = await new Notification({
        notifyType: data.type,
        sender: data.sender._id,
        receiver: data.receiver._id,
        postId: data.postId,
        title: data.title,
        description: data.description,
        media: data.media,
        additionalData: { likerUser: data.sender, postOwner: data.receiver },

        profilePic: data.profilePic,
        createdAt: data.createdAt,
      }).save();

      await Receiver.updateOne(
        { _id: data.receiver._id },
        { $push: { notifications: notification._id } }
      );
      // sending push notification
      singleNotification({
        token: data.deviceToken,
        title: data.title,
        body: data.body,
        data: { likerUser: data.sender, postOwner: data.receiver },
      });
    } else if (data.type === "rideStarted") {
      notification = await new Notification({
        notifyType: data.type,
        sender: data.sender._id,
        receiver: data.receiver._id,

        title: data.title,
        description: data.description,

        createdAt: data.createdAt,
        additionalData: [{ sender: data.sender }, { receiver: data.receiver }],
      }).save();

      await Receiver.updateOne(
        { _id: data.receiver._id },
        { $push: { notifications: notification._id } }
      );

      // sending push notification
      singleNotification({
        token: data.deviceToken,
        title: data.title,
        body: data.body,
        data: {},
        // data: { requestId: data.requestId.toString() },
        // data: data.requestId,
      });
    }
  },
};
