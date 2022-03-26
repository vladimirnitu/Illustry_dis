import _ from "lodash";
import { FileProperties } from "../types/fileproperties";
import { Promise } from "bluebird";
import { FileError } from "../errors/fileError";
// const converter = require('json-2-csv')
var fs = require('fs')

const read = (file: FileProperties) => {
    return new Promise((resolve, reject) => {
        fs.readFile(_.get(file, 'filePath'), (error: any, data: any) => {
            if (error) {
                reject(new FileError("Problems while uploading the files"))
            }
            if (file.type === 'application/json') {
                let illustration = JSON.parse(data.toString());
                let finalJson: any = {
                    data: illustration?.data,
                    name: illustration?.name,
                    type: illustration?.type,
                    tags: illustration?.tags
                }

                resolve(finalJson)
            }
        })
    })
}
export const readFile = (files: FileProperties[]) => {
    return Promise.all(files.map(read))
        .then((files) => {
            return files

        })



}
// else
// if (file.type === 'text/csv'|| file.type ==='application/vnd.ms-excel') {
//     let illustration = data.toString();

//     converter.csv2json(illustration, function (err: any, json: any) {
//         if (err) throw err;
//         let finalJson = {
//             IllustrationData:json
//         }
//         next(null, { ...project, ...finalJson })
//     })


function csvToJson(csv: any) {
    const content = csv.split('\n');
    const header = content[0].split(',');
    return _.tail(content).map((row: any) => {
        return _.zipObject(header, row.split(','));
    });
}