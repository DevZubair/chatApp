/**
 * Created by Zubair.
 */
'use strict';

module.exports = function(app, router) {

    app.use('/api', router);


    //this url need discussion
    router
        .route('/unauthorized', function (req, res) {
            res.send({
                message: "The request is Unauthorized"
            });
        });

    router.route('/api')
        .get(app.controllers._welcome);


    /////////////////////////
    ///////Auth API's///////
    ////////////////////////
    router.route('/login')
        .post(app.controllers._login);

    /////////////////////////
    ///////Admin API's///////
    ////////////////////////
    router.route('/register/admin')
        .post(app.controllers._registerAdmin);

    router.route('/allAdmin/:emailAddress/:token')
        .get(app.services._checkSessionToken,app.controllers._getAllAdmin);

    /////////////////////////
    ///////User(Non Admin) API's///////
    ////////////////////////
    router.route('/user/all')
        .get(app.services._checkSessionToken,app.controllers._getAllUsers);
    router.route('/register/user')
        .post(app.controllers._registerUser);


    /////////////////////////
    ///////Profile API's///////
    ////////////////////////
    router.route('/uploadProfileImage')
        .post(app.controllers._uploadProfileImage);
    router.route('/updateProfileImage')
        .post(app.controllers._updateProfileImage);
    router.route('/getProfileImage')
        .post(app.controllers._getProfileImage);
    router.route('/updateUserProfile')
        .post(app.services._checkSessionToken,app.controllers._updateUserProfile);
    router.route('/getProfileByEmail/:emailAddress/:token')
        .get(app.services._checkSessionToken,app.controllers._getProfileByEmail);
    router.route('/updateProfileStatus')
        .post(app.services._checkSessionToken,app.controllers._updateProfileStatus);



    //////////////////////////
    /////Conversation Room API's///////
    ////////////////////////

    router.route('/admin/room/:emailAddress/:token')
        .get(app.services._checkSessionToken,app.controllers._getAdminRoom);

    router.route('/allAdminRooms/:emailAddress/:token')
        .get(app.services._checkSessionToken,app.controllers._getAllAdminRooms);

    router.route('/allChatRooms/:emailAddress/:token')
        .get(app.services._checkSessionToken,app.controllers._getChatRooms);

    router.route('/roomMessages')
        .post(app.services._checkSessionToken,app.controllers._getRoomMessages);

    router.route('/update/adminRoom')
        .post(app.services._checkSessionToken,app.controllers._updateAdminRoom);

    router.route('/profession/adminRoom/:profession')
        .get(app.services._checkSessionToken,app.controllers._getAdminRoomByProfession);

    router.route('/status/adminRoom/:roomStatus')
        .get(app.services._checkSessionToken,app.controllers._getAdminRoomByStatus);

    router.route('/upload/roomImage')
        .post(app.controllers._uploadRoomImage);

};
