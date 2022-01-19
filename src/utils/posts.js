// build complete (all) posts structure for room
async function buildPosts(timeline) {
    let posts = [];
    await timeline.forEach((matrixEvent) => {
        if (matrixEvent.getType() === "m.room.message" && !matrixEvent.isRedacted()) {
            // new post
            if (matrixEvent.getContent()["m.relates_to"] === undefined) {
                posts.push({
                    "initial-message": matrixEvent,
                    replies: [],
                    edits: [],
                });
            }
            // reply or edit
            if (matrixEvent.getContent()["m.relates_to"] !== undefined) {
                // reply to post or edit to post or reply
                posts.forEach((post) => {
                    let isReply = Boolean(matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]);
                    let isEdit = Boolean(matrixEvent.getContent()["m.relates_to"].replace);

                    // reply to initial message
                    if (isReply) {
                        if (
                            post["initial-message"].getId() ===
                            matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]
                                .event_id
                        ) {
                            post.replies.push({
                                "reply-message": matrixEvent,
                                edits: [],
                            });
                        }
                    }
                    // edit
                    if (isEdit) {
                        // edit to initial post 
                        if (post["initial-message"].getId() ===
                            matrixEvent.getContent()["m.relates_to"].replace.event_id) {
                            post.edits.push(matrixEvent);
                        }
                        // edit to reply
                        post.replies.forEach((reply) => {
                            if (reply["reply-message"].getId() === matrixEvent.getContent()["m.relates_to"].replace.event_id) {
                                reply.edits.push(matrixEvent);
                            }
                        })
                    }
                });
            }
        }
    });
    return posts.reverse();
}

// replace old messages of a (single) post and its replies with newest edits
function applyEdits(posts) {
    posts.forEach(post => {
        // edits initial message
        if (post.edits.length !== 0) {
            post["initial-message"].getContent().body = post.edits[post.edits.length - 1].getContent().body;
        }
        // edits replies
        post.replies.forEach(reply => {
            if (reply.edits.length !== 0) {
                reply["reply-message"].getContent().body = reply.edits[reply.edits.length - 1].getContent().body;
            }
        });
    });
    return posts;
}

export { buildPosts, applyEdits }
