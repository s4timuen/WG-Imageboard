/**
 * this is a workaround, until public custom user data is supported by the matrix specification
 * 
 * proposal:
 * https://github.com/matrix-org/matrix-doc/blob/matthew/msc1769/proposals/1769-extensible-profiles-as-rooms.md 
 * 
 * could be used for custom data:
 * https://spec.matrix.org/latest/#profiles 
 * 
 * PUT only 'displayname' and 'avatar_url':
 * https://spec.matrix.org/v1.1/client-server-api/#profiles 
 */
import { downloadGameData, uploadGameData } from "@/api/gameDatabase.js";
import { urlDatabase, portDatabase } from "@/utils/config.js";

// gamification events
const gameEvents = Object.freeze({
    0: "increment-likes-count",
    1: "reduce-likes-count",
    2: "increment-posts-count",
    3: "reduce-posts-count",
    4: "increment-replies-count",
    5: "reduce-replies-ount",
});

// gamification error
const gamificationErrors = Object.freeze({
    0: "Gamification Error: Event not found.",
    1: "Gamification Error: User not found.",
});

// gamification info
const gamificationInfo = Object.freeze({
    0: "Gamification Info: User rejoined this room."
});

// default game and room data
let defaultGameData = {
    "user_id": "",
    "rooms": {},
    "rank": "new user",
    "badges": []
}

let defaultRoomData = [
    "",
    {
        "room_visibility": "",
        "posts_count": 0,
        "replies_count": 0,
        "likes_count": 0
    }
]

// get gamification data for respective user
async function getUserGamificationData(userId) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');
    let url = urlDatabase + portDatabase;
    let gameData = await downloadGameData(url, fileName);
    return gameData;
}

// set gamification data for respective user
async function updateUserGamificationData(userId, roomId, eventId, context, gameEvent) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');

    let url = urlDatabase + portDatabase;
    let gameData = await downloadGameData(url, fileName);


    // update game data
    switch (gameEvent) {
        case gameEvents[0]:
            gameData.rooms[roomId].likes_count += 1;
            uploadGameData(url, fileName, gameData);
            updateEventGameData(userId, eventId, roomId, context, gameEvent);
            break;
        case gameEvents[1]:
            gameData.rooms[roomId].likes_count -= 1;
            uploadGameData(url, fileName, gameData);
            updateEventGameData(userId, eventId, roomId, context, gameEvent);
            break;
        case gameEvents[2]:
            gameData.rooms[roomId].posts_count += 1;
            uploadGameData(url, fileName, gameData);
            break;
        case gameEvents[3]:
            gameData.rooms[roomId].posts_count -= 1;
            uploadGameData(url, fileName, gameData);
            break;
        case gameEvents[4]:
            gameData.rooms[roomId].replies_count += 1;
            uploadGameData(url, fileName, gameData);
            break;
        case gameEvents[5]:
            gameData.rooms[roomId].replies_count -= 1;
            uploadGameData(url, fileName, gameData);
            break;
        default:
            throw gamificationErrors[0];
    }
    uploadGameData(url, gameData);
}

function updateEventGameData(userId, eventId, roomId, context, gameEvent) {
    let matrixClient = context.$store.getters.matrixClient;
    let room = matrixClient.getRoom(roomId);
    let timeline = room.getTimelineForEvent(eventId);
    let event = {};
    timeline.events.forEach((timelineEvent) => {
        if (timelineEvent.event.event_id === eventId) {
            event = timelineEvent;
        }
    });

    let content = event.getContent();
    content["m.relates_to"] = {
        replace: {
            event_id: eventId,
        }
    }
    // like
    if (gameEvent === gameEvents[0]) {
        // in dislike -> change to likes
        console.log(content)
        if (content.game.dislikes.includes(userId)) {
            let newDislikes = content.game.dislikes.filter(function (element) {
                return element !== userId;
            })
            content.game.dislikes = newDislikes;
            content.game.likes.push(userId);
        }
        // in nether -> add to like
        if (!content.game.dislikes.includes(userId) && !content.game.likes.includes(userId)) {
            content.game.likes.push(userId);
        }
        // already in likes -> do nothing
    }
    // dislike
    if (gameEvent === gameEvents[1]) {
        // in like -> delete and add to dislike
        if (content.game.likes.includes(userId)) {
            let newLikes = content.game.likes.filter(function (element) {
                return element !== userId;
            })
            content.game.likes = newLikes;
            content.game.dislikes.push(userId);
        }
        // in nether -> add to dislike
        if (!content.game.dislikes.includes(userId) && !content.game.likes.includes(userId)) {
            content.game.dislikes.push(userId);
        }
        // already in dislike -> do nothing
    }
    matrixClient.sendEvent(
        roomId,
        "m.room.message",
        content,
        "",
        (err) => {
            console.log(err);
        }
    );  
}

async function checkUserGamificationData(userId, roomId, roomVisibility) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');
    let urlDownload = urlDatabase + portDatabase;
    let urlUpload = urlDatabase + portDatabase;
    let gameData = null;
    gameData = await downloadGameData(urlDownload, fileName);

    // existing user, gamification data available
    if (gameData !== null) {

        let roomGameData = [];
        Object.entries(gameData.rooms).forEach(room => {
            if (room[0] === roomId) {
                roomGameData = room;
            }
        });

        // existing room gamification data
        if (roomGameData.length !== 0) {
            console.log(gamificationInfo[0]);
        }
        // new room gamification data
        if (roomGameData.length === 0) {
            let newDefaultRoomData = defaultRoomData;
            newDefaultRoomData[0] = roomGameData[0];
            newDefaultRoomData[1].room_visibility = roomGameData[1].room_visibility;
            gameData.rooms[defaultRoomData[0]] = defaultRoomData[1]
            uploadGameData(urlUpload, fileName, gameData);
        }
    }
    // new user, no gamification data yet
    if (gameData === null) {
        let newDefaultGameData = defaultGameData;
        let newDefaultRoomData = defaultRoomData;
        newDefaultRoomData[0] = roomId;
        newDefaultRoomData[1].room_visibility = roomVisibility;
        newDefaultGameData.user_id = userId;
        newDefaultGameData.rooms[newDefaultRoomData[0]] = newDefaultRoomData[1];
        uploadGameData(urlUpload, fileName, newDefaultGameData);
    }
}

export { getUserGamificationData, updateUserGamificationData, checkUserGamificationData }
