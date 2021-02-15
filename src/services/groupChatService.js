import _ from "lodash";
import chatGroupModel from "../models/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      arrayMemberIds.unshift({ userId: `${currentUserId}` });

      arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");

      let newGroupChatItem = {
        name: groupChatName,
        userAmount: arrayMemberIds.length,
        userId: currentUserId,
        members: arrayMemberIds,
      };

      let newGroup = await chatGroupModel.createNew(newGroupChatItem);
      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { addNewGroup: addNewGroup };
