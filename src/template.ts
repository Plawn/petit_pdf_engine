import pdftk from 'node-pdftk';
import { PDFDocument, PDFField } from 'pdf-lib';
import { Template } from 'petit_nodejs_publipost_connector';

type delimitersType = {
    start: string;
    end: string;
};

// const delimiters: delimitersType = { start: '{{', end: '}}' };

const re = /\{{(.*?)\}}/g;

/**
 * Should create mapping between field value and real fieldName
 * @param fields 
 * @returns 
 */
function loadFields(fields: PDFField[]) {
    const res = {};
    fields.forEach(f => {
        const name = f.acroField.getPartialName();
        const value_ = f.acroField.V();
        if (name && value_) {
            const value = value_.toString();
            try {
                const match = value.match(re);
                match.forEach(m => {
                    // remove {{ and }}
                    res[m.slice(2, -2)] = name;
                })
            } catch (e) {

            }
        }
    });
    return res;
}


export default class PdfTemplate implements Template {
    data: any;
    placeholders: { [contentSide: string]:  /*real name side*/ string };

    constructor(data: any) {
        this.data = data;
    }

    async init() {
        const d = await PDFDocument.load(this.data);
        const form = d.getForm();
        const fields = form.getFields();
        this.placeholders = loadFields(fields);
    }

    private prepareFields(data: any) {
        const formData: { [k: string]: string } = {};
        Object.keys(data).forEach(key => {
            const val = data[key];
            formData[this.placeholders[key]] = val;
        });
        return formData;
    }

    async render(data: any, options?: string[]) {
        const fields = this.prepareFields(data);
        const res = pdftk
            .input(this.data)
            .fillForm(fields)
            .flatten()
            .output()
        return res;
    }

    getAllPlaceholders() {
        return Object.keys(this.placeholders);
    }

    static async of(data: Buffer) {
        const t = new PdfTemplate(data);
        await t.init();
        return t;
    }
}


