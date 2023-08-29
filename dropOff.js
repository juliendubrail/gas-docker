const sendOverviewEmails = (() => {
    let ss_id = "1ecMEw6HheXqzupB5hfWweoEbQ28LDx8imYyK07OLnto";
    let merchantEmail;
    let branchEmail;
    let merchantToBranchTemplate = temple.getMerchant_to_Branch_Template();
    let branchToBranchTemplate = temple.getBranch_to_Branch_Template();
    let merchantToStorageTemplate = temple.getMerchant_to_Storage_Template();
    let branchToStorage = temple.getBranch_to_Storage_Template();

    let overviewValues = getSheetValues("Overview");
    let trackerValues = getSheetValues("To Send Tracker")

    const addLocation = data => {
        return data.map((row) => {
            row["Alternative_ID"] == ""
                ? (row["Location ID"] = row["Default_ID"])
                : (row["Location ID"] = row["Alternative_ID"]);
            row["Alternative_Name"] == ""
                ? (row["Location Name"] = row["Default_Name"])
                : (row["Location Name"] = row["Alternative_Name"]);
            return row;
        });
    };

    const addTemplateType = toSend => {
        return toSend.map((row) => {
            row["Type2"] == ""
                ? (row["template_type"] = row["Type1"])
                : (row["template_type"] = row["Type2"]);
            return row;
        });
    };


    const insertRow = (sheet, rowData, optIndex, numOfColumns) => {
        let index = optIndex || 1;
        sheet.insertRowBefore(index);
        sheet.getRange(index, 1, 1, numOfColumns).setValues([rowData]);
    }

    const deleteRow = valueToDelete => {
        let rowToDelete;
        let lock = LockService.getScriptLock();
        let overviewData = getSheetValues('Overview')
        overviewData.reverse().forEach((row, index) => {
            if (row[0] == valueToDelete["Stock Number"]) {
                rowToDelete = overviewData.length - index;
            }
        });
        lock.waitLock(5000);
        overviewSheet.deleteRow(rowToDelete);
        lock.releaseLock();
    }

    const logValue = valueToAdd => {
        let logSheet = SpreadsheetApp.openById(ss_id).getSheetByName('Sent Log');
        let logSheetData = getSheetValues('Sent Log')
        let newDataArr = objToArr(valueToAdd, logSheetData);
        let numOfColumns = logSheetData[0].length;
        let rowToUpdate = 2;
        insertRow(logSheet, newDataArr, rowToUpdate, numOfColumns)
    }

    const arrToArrOfObjects = (sheetValues, rowsToSkip) => {
        let i = 0;

        while (i < rowsToSkip) {
            sheetValues.shift();
            i++;
        }

        [headers, ...data] = sheetValues;

        let arrOfObj = data.map((row, rowIndex) => {
            let objToReturn = {};
            row.forEach((header, index) => {
                let rowNumber = rowsToSkip + rowIndex + 1
                index == 10
                    ? (objToReturn = { ...objToReturn, ["Default_ID"]: header })
                    : (objToReturn = { ...objToReturn, [headers[index]]: header });
                index == 11
                    ? (objToReturn = { ...objToReturn, ["Default_Name"]: header })
                    : (objToReturn = { ...objToReturn, [headers[index]]: header });
                index == 12
                    ? (objToReturn = { ...objToReturn, ["Type1"]: header })
                    : (objToReturn = { ...objToReturn, [headers[index]]: header });
                index == 16
                    ? (objToReturn = { ...objToReturn, ["Alternative_ID"]: header })
                    : (objToReturn = { ...objToReturn, [headers[index]]: header });
                index == 17
                    ? (objToReturn = { ...objToReturn, ["Alternative_Name"]: header })
                    : (objToReturn = { ...objToReturn, [headers[index]]: header });
                index == 18
                    ? (objToReturn = { ...objToReturn, ["Type2"]: header })
                    : (objToReturn = { ...objToReturn, [headers[index]]: header });
            });
            return objToReturn;
        });
        return arrOfObj;
    };


    const objectify = (sheetValues) => {
        [headers, ...data] = sheetValues;
        let arrofObj = data.map(row => {
            let obj = {}
            row.forEach((header, index) => {
                obj = { ...obj, [headers[index]]: header }
            });
            return obj
        });
        return arrofObj;
    }



    const getSheetValues = sheetName => {
        return SpreadsheetApp.openById(ss_id)
            .getSheetByName(sheetName)
            .getDataRange()
            .getValues();
    }

    const sendSelected = () => {
        let sentEmails = new Array();
        //let overviewValues = getSheetValues("Overview");
        const rowsToSkip = 2;
        let overviewData = arrToArrOfObjects(overviewValues, rowsToSkip);
        let toSend = overviewData.filter((item) => item["Send Email"] == "x");
        let withLocation = addLocation(toSend);
        let withTemplateType = addTemplateType(withLocation);
        withTemplateType.forEach(item => {
            if (item["template_type"] == "Branch") {
              merchantEmail = temple.fillTemplate(merchantToBranchTemplate, item);
              branchEmail = temple.fillTemplate(branchToBranchTemplate, item);
              MailApp.sendEmail(merchantEmail);
              MailApp.sendEmail(branchEmail);
              item["Sent To"] = item["Merchant Email"] + "," + item["AM/KAM Email"];
              item["cc"] = "abwicklung@auto1.com";
              item["Date Email Sent"] = Utilities.formatDate(new Date(), "Europe/Berlin", `yyyy-MM-dd hh:mm:ss`)
              //logValue(item);
              //deleteRow(item);
              sentEmails.push(item);
            } else {
              merchantEmail = temple.fillTemplate(merchantToStorageTemplate, item);
              branchEmail = temple.fillTemplate(branchToStorage, item);
              MailApp.sendEmail(merchantEmail);
              MailApp.sendEmail(branchEmail);
              item["Sent To"] = item["Merchant Email"] + "," + item["AM/KAM Email"];
              item["cc"] = "abwicklung@auto1.com";
              item["Date Email Sent"] = Utilities.formatDate(new Date(), "Europe/Berlin", `yyyy-MM-dd hh:mm:ss`)
              //logValue(item);
              //deleteRow(item);
              sentEmails.push(item);
            }
          });
          sentEmails.forEach(row => {logValue(row)});
          sentEmails.reverse().forEach(row => {deleteRow(row)});
          sentEmails.forEach(row => {Logger.log(`Email sent for ${row['Stock Number']} to ${row['Sent To']}`)})

    }

    return {
        sendSelected
    }
})()