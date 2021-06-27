const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const fs = require('fs');

const ref = firestore.collection('fullfrontalphotographers').orderBy('name').get().then((query) => {
	var output = [];
	query.forEach((doc) => {
		output.push(doc.data());
	});

	fs.writeFileSync('data/photographers.json', JSON.stringify(output));
});
