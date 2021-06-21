
import makeConnector from 'petit_nodejs_publipost_connector';
import PDFTemplate from './template';
import util from 'util';
import fs from 'fs';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const test = async (filename: string) => {
    const t = await PDFTemplate.of(await readFile(filename));
    console.log(t.getAllPlaceholders());
    const data = {
        "junior.name":"JISEP",
        "junior.address":"jeb"
    }
    const res = await t.render(data);
    await writeFile('res.pdf', res);
}


// Main wrapped for asyncness
const main = async () => {
    if (process.argv[2] === "test") {
        return test("org_template2_repaired.pdf");
    }
    const port = Number(process.argv[2]);
    if (isNaN(port) || port > 65535) {
        throw new Error(`invalid port ${port}`)
    }
    const app = makeConnector(PDFTemplate);
    app.listen(port, () => {
        console.log(`Connector started on port ${port}`);
    });
};

main();

