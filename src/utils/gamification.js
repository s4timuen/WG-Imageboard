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
import { getFileServerData, setFileServerData } from "@/api/fileServer.js";

// gamification events
const gameEvents = Object.freeze({
    0: "increment-like-count",
    1: "reduce-like-count",
    2: "increment-post-count",
    3: "reduce-post-count",
    4: "increment-reply-count",
    5: "reduce-reply-ount",
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
    "rooms": [],
    "rank": "newbie",
    "badges": []
}

let defaultRoomData = {
    "room_id": "",
    "room_visibility": "",
    "posts_count": 0,
    "replies_count": 0,
    "likes_count": 0
}

// file server gamification data URL
let baseUrl = "http://192.168.0.233:8080/";
let path = "more/files/";

// get gamification data for respective user
async function getUserGamificationData(userId) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');
    let url = baseUrl + path;
    let gameData = await getFileServerData(url, fileName);
    return gameData;
}

// set gamification data for respective user
async function updateUserGamificationData(userId, gameEvent) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');

    let url = baseUrl + path;
    let gameData = await getFileServerData(url, fileName);

    // update game data
    switch (gameEvent) {
        case gameEvents[0]:
            // TODO: event function
            break;
        case gameEvents[1]:
            // TODO: event function
            break;
        case gameEvents[2]:
            // TODO: event function
            break;
        case gameEvents[3]:
            // TODO: event function
            break;
        case gameEvents[4]:
            // TODO: event function
            break;
        case gameEvents[5]:
            // TODO: event function
            break;
        default:
            throw gamificationErrors[0];
    }
    setFileServerData(url, gameData);
}

async function checkUserGamificationData(userId, roomId, roomVisibility) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');
    let url = baseUrl + path;
    let gameData = null;
    gameData = await getFileServerData(url, fileName);

    // existing user, gamification data available
    if (gameData !== null) {

        let roomGameData = null;
        gameData.rooms.forEach(room => {
            if (room.room_id === roomId) {
                roomGameData = room;
            }
        });

        // existing room gamification data
        if (roomGameData !== null) {
            console.log(gamificationInfo[0]);
        }
        // new room gamification data
        if (roomGameData === null) {
            let newDefaultRoomData = defaultRoomData;
            defaultRoomData.room_id = roomId;
            defaultRoomData.room_visibility = roomVisibility;
            gameData.rooms.push(newDefaultRoomData);
            setFileServerData(url, fileName, gameData);
        }
    }
    // new user, no gamification data yet
    if (gameData === null) {
        let newDefaultGameData = defaultGameData;
        let newDefaultRoomData = defaultRoomData;
        defaultRoomData.room_id = roomId;
        defaultRoomData.room_visibility = roomVisibility;
        newDefaultGameData.user_id = userId;
        newDefaultGameData.rooms.push(newDefaultRoomData);
        setFileServerData(url, fileName, newDefaultGameData);
    }
}

export { getUserGamificationData, updateUserGamificationData, checkUserGamificationData }
