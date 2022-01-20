import makeConnector from 'petit_nodejs_publipost_connector';
import PDFTemplate from './template';

// Main wrapped for asyncness
const main = async () => {
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

