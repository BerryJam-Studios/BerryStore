const fs = require('fs');
const path = require('path');

function CreateKey(name) {
    const filepath = path.join("key", name + ".json");
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify({ data: [] }));
    } else {
        console.log("Key already exists.. its so joever");
    }
}

function StoreData(dataName, dataValue, keyName) {
    const filepath = path.join("key", keyName + ".json");

    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let obj = JSON.parse(data);
            if (!Array.isArray(obj.data)) {
                obj.data = [];
            }

            const existingEntry = obj.data.find(entry => entry.hasOwnProperty(dataName));

            if (existingEntry) {
                existingEntry[dataName] = dataValue;
            } else {
                // idk how to do this without a data table
                obj.data.push({ [dataName]: dataValue });
            }

            let json = JSON.stringify(obj, null, 2);

            fs.writeFile(filepath, json, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("wrote " + dataName + ": \"" + dataValue + "\" to " + keyName);
                }
            });
        }
    });
}

function DeleteKey(name) {
    const filepath = path.join("key", name + ".json");

    fs.unlinkSync(filepath);
    console.log("deleted key " + name);
}

function DeleteData(dataName, name) {
    const filepath = path.join("key", name + ".json");

    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let obj = JSON.parse(data);
            const entryIndex = obj.data.findIndex(entry => entry.hasOwnProperty(dataName));

            if (entryIndex !== -1) {
                obj.data.splice(entryIndex, 1);
                fs.writeFile(filepath, JSON.stringify(obj, null, 2), 'utf8', function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`Deleted ${dataName} from ${name}`);
                    }
                });
            } else {
                console.log("key died (not here)");
            }
        }
    });
}
