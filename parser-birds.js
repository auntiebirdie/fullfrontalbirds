const csv = require('csv-parser');
const fs = require('fs');

var output = {};

// Clements, J. F., T. S. Schulenberg, M. J. Iliff, S. M. Billerman, T. A. Fredericks, B. L. Sullivan, and C. L. Wood. 2019.
// The eBird/Clements Checklist of Birds of the World: v2019.
// Downloaded from https://www.birds.cornell.edu/clementschecklist/download/ 

fs.createReadStream('data/eBird_Taxonomy_v2019.csv')
    .pipe(csv())
    .on('data', (row) => {
	if (row['CATEGORY'] == 'species') {
        var order = row['ORDER1']
        var family = row['FAMILY'].split(' ').shift();

        if (!output[order]) {
            output[order] = {}
        }

        if (!output[order][family]) {
            output[order][family] = {
                display: row['FAMILY'],
                children: []
            };
        }

       output[order][family].children.push([row['PRIMARY_COM_NAME'], row['SCI_NAME']]);
	}
    })
    .on('end', () => {
        fs.writeFileSync('data/birds.json', JSON.stringify(output));
    });
