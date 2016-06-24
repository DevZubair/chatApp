/**
 * Created by Muhammad on 6/22/2016.
 */
'use strict';
module.exports = function(app) {
    app.constants.profile = ['emailAddress','profilePic'];
    app.constants.getProfileImage = ['emailAddress','imageName'];
    app.constants.userProfile = ['emailAddress','phoneNumber'];
    app.constants.getProfile = ['emailAddress'];
    app.constants.statusProfile = ['emailAddress','status'];
};