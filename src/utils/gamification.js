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
import { urlFileServer, portFileServer, fileServerPath } from "@/utils/config.js";

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
    "rank": "newbie",
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
    let url = urlFileServer + portFileServer + fileServerPath;
    let gameData = await getFileServerData(url, fileName);
    return gameData;
}

// set gamification data for respective user
async function updateUserGamificationData(userId, roomId, eventId, gameEvent) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');

    let url = urlFileServer + portFileServer + fileServerPath;
    let gameData = await getFileServerData(url, fileName);


    // update game data
    switch (gameEvent) {
        case gameEvents[0]:
            // TODO: event function
            gameData.rooms[roomId].likes_count += 1;
            // change data strukture to rooms: [id: {} ]
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
        // likes -> user count + and event count + (message count)
        // likes -> how to only like or dislike and only one per user? game:{likes:[userIds], dislikes:[userIds]}
        default:
            throw gamificationErrors[0];
    }
    setFileServerData(url, gameData);
}

async function checkUserGamificationData(userId, roomId, roomVisibility) {
    let fileName = await userId.replaceAll(":", '_');
    fileName = fileName.replaceAll('.', '_');
    let url = urlFileServer + portFileServer + fileServerPath;
    let gameData = null;
    gameData = await getFileServerData(url, fileName);

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
            newDefaultRoomData[1].room_visibility = roomGameData[1].roomVisibility;
            gameData.rooms[defaultRoomData[0]] = defaultRoomData[1]
            setFileServerData(url, fileName, gameData);
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
        setFileServerData(url, fileName, newDefaultGameData);
    }
}

export { getUserGamificationData, updateUserGamificationData, checkUserGamificationData }
