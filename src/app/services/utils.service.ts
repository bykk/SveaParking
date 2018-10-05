import { Injectable } from "@angular/core";

@Injectable()
export class UtilsService {
    private toCamelCase(o) {
        var newO, origKey, newKey, value
        if (o instanceof Array) {
            return o.map(function (value) {
                if (typeof value === "object") {
                    value = this.toCamelCase(value)
                }
                return value
            })
        } else {
            newO = {}
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
                    value = o[origKey]
                    if (value instanceof Array || (value !== null && value.constructor === Object)) {
                        value = this.toCamelCase(value)
                    }
                    newO[newKey] = value
                }
            }
        }
        return newO
    }

    convertToCamelCase(response: string) {
        let responseObj = JSON.parse(response);
        let resultArrayOfObjects = new Array<object>();

        if (responseObj instanceof Array) {
            responseObj.forEach(object => {
                resultArrayOfObjects.push(this.toCamelCase(object));
            });

            return resultArrayOfObjects;
        }
        return this.toCamelCase(responseObj);
    }
}