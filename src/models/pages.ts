import {Schema, model, Document, Model, Query} from 'mongoose';

export type PageDocument = Document & {
    path: string,
    title: string,
    data: object,
    lang: string,
    meta: string,
};

const pageSchema = new Schema({
    path: {
        type: String,
        required: true,
        unique: false
    },
    title:{
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    lang: {
        type: String,
        required: true,
        unique: false
    },
    meta: {
        type: String,
        required: false
    }
},
{
    timestamps: { 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
).index({ path: 1, lang: 1 }, { unique: true });

pageSchema.statics.getPageData = function (path: string, lang: string) {
        const query = Page.findOne(
            {path: path, lang: lang},
            {path: 1, title: 1, data: 1, lang: 1, meta: 1, _id: 0}
            );
        let data = query.exec();
        return data;
    };
export const Page = model<PageDocument>('pages', pageSchema);