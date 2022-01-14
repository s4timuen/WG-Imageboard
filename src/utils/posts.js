async function buildPosts(timeline) {
    let posts = [];
    await timeline.forEach((matrixEvent) => {
        if (matrixEvent.getType() === "m.room.message") {
            // new post
            // "matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"].event_id"
            // should be "matrixClient.getRelation()"
            // but matrixEvent.getRelation() -> always returns null, bug?
            if (matrixEvent.getContent()["m.relates_to"] === undefined) {
                posts.push({
                    "initial-message": matrixEvent,
                    replies: [],
                });
            }
            // reply
            if (matrixEvent.getContent()["m.relates_to"] !== undefined) {
                // reply to post
                if (
                    matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]
                        .event_id !== undefined
                ) {
                    posts.forEach((post) => {
                        // reply to initial message
                        if (
                            post["initial-message"].getId() ===
                            matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]
                                .event_id
                        ) {
                            post.replies.push({
                                "reply-message": matrixEvent,
                                replies: [],
                            });
                        }
                        // reply to a reply
                        if (
                            post["initial-message"].getId() !==
                            matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]
                                .event_id
                        ) {
                            post.replies.forEach((reply) => {
                                if (
                                    reply["reply-message"].getId() ===
                                    matrixEvent.getContent()["m.relates_to"]["m.in_reply_to"]
                                        .event_id
                                ) {
                                    reply.replies.push({
                                        "reply-message": matrixEvent,
                                        replies: [],
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    });
    posts.reverse();
    return posts;
}

export { buildPosts }