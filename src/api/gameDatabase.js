/**
 * this is a workaround, until public custom user data is supported by the matrix specification
 * thus this will provite only mock data
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

// download file from file server
async function downloadGameData(url, fileName) {
    console.log("Gamification data has been downloaded: \n" + url + fileName);
    return {
        "user_id": "@tim:my.matrix.host",
        "rooms": {
            "!JfkzmnQLZJNpsyZpkd:my.matrix.host": {
                "room_visibility": "private",
                "posts_count": 2,
                "replies_count": 3,
                "likes_count": 22,
            },
            "!jSwXuRByfWsjmmcRvh:my.matrix.host": {
                "room_visibility": "public",
                "posts_count": 1,
                "replies_count": 4,
                "likes_count": 9,
            }
        },
        "rank": "new user",
        "badges": [
            {
                "name": "Badge_01",
                "rank": "silver",
                "obtained": "10.02.2022"
            },
            {
                "name": "Badge_02",
                "rank": "gold",
                "obtained": "08.02.2022"
            }
        ],
    }
}

// upload file to file server
async function uploadGameData(url, fileName, obj) {
    console.log("Gameification data has been uploaded: \n" + url + fileName + "\n" + obj);
}

export { downloadGameData, uploadGameData }
