const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore;
const tumblr = require('tumblr.js');
const secrets = require('./secrets/tumblr.json');
const client = tumblr.createClient(secrets);

fetchPosts(0);

function fetchPosts(page) {
    client.blogPosts('fullfrontalbirds', {
        offset: (page * 20)
    }, async function(err, resp) {
        try {
            for (var post of resp.posts) {
                var content = post.body || post.answer || post.caption;

                var matches = [...content.matchAll(/<a href=\"([^\"]+)\">©([^<]+)<\/a>/g)];

                if (matches.length > 0) {

                    for (var match of matches) {
                        var photographer = match[2].trim();
                        var website = match[1];

                        const ref = firestore.doc(`fullfrontalphotographers/${photographer.toLowerCase()}`);
                        const doc = await ref.get();
                        const data = doc.data();

                        if (!data) {
                            ref.set({
                                name: photographer,
                                websites: [website]
                            });
                        }
                    }
                } else {
                    console.log(post);
                }
            }
        } catch (err) {
            console.log(err);
        }
    });
}
