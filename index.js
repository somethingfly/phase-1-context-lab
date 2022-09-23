/* Your Code Here */

// When I did the previous, similar lab I wrote this note:

// Note: I am adding more to the Employee Record to record data, such as total time worked and total wages
// Further many data values are modified over time using the same keys
// I did this because the instructions do not say you cannot add keys to the employee records, nor that all values must never be modified
// I believe this method gains performance because then there are no nested loops when calculating hours and pay
// However, it likely means employees would not be able to reuse the same punch card after a time-in or time-out event
// Custom keys like totalTime and totalWage are constantly being rewritten, and I do not think one can easily "unpunch" a punch-card
// Further it suggests once a card is punched, it is computed on the spot, and then a new card is created for the employee
// We save computation time when finally calculating hours and pay, but we also assume a lot of paper and computers are readily available

// But this lab only say "will feature the same topic and area of work as the previous lab"
// It doesn't explicitly mention the 1960s, says the office is "state of the art," and gives example timestamp with the year "2018"
// Regardless, this code can definitely be hotfixed as needed if keys cannot be added, values cannot be modified, etc.


/*
 We're giving you this function. Take a look at it, you might see some usage
 that's new and different. That's because we're avoiding a well-known, but
 sneaky bug that we'll cover in the next few lessons!

 As a result, the lessons for this function will pass *and* it will be available
 for you to use if you need it!
 */

const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(function (e) {
        return e.date
    })

    const payable = eligibleDates.reduce(function (memo, d) {
        return memo + wagesEarnedOnDate.call(this, d)
    }.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!

    return payable
}

function createEmployeeRecord(employeeArray) {
    const employeeObject = {};
    employeeObject["firstName"] = employeeArray[0];
    employeeObject["familyName"] = employeeArray[1];
    employeeObject["title"] = employeeArray[2];
    employeeObject["payPerHour"] = employeeArray[3];
    employeeObject["timeInEvents"] = [];
    employeeObject["timeOutEvents"] = [];
    employeeObject["totalTime"] = 0;
    employeeObject["totalWages"] = 0;
    return employeeObject
}

function createEmployeeRecords(arrayOfEmloyeeArrays) {
    return arrayOfEmloyeeArrays.map(employeeArray => createEmployeeRecord(employeeArray))
}


function createTimeInEvent(dateStamp) {
    const employeeObject = this;
    return createTimeEvent(employeeObject,dateStamp,"TimeIn")
}

function createTimeOutEvent(dateStamp) {
    const employeeObject = this;
    return createTimeEvent(employeeObject,dateStamp,"TimeOut")
}

// Instructions say nothing about an imported CSV test
// Had to modify my code to accomodate the way the "employeeRecords" were created for the test (which are not according to normal time-card punching) 
// Originally, this code only had 1 key on the employeeObject of ["LastTimeIn"]
// Now there are as many keys as there are days on the employeeObject of [date + "LastTimeIn"]
// This is because the way the test employeeRecords object is built
// First all createTimeInEvent functions are called and then after that, all the create createTimeOutEvent functions are called
// In normal time-card punching, there would always be a createTimeInEvent followed by a createTimeOutEvent
// By calling all the createTimeInEvent functions first, my "LastTimeIn" key ended up always being the last day processed
// e.g. Loki works 3 days, he starts at 7 AM, then 7 AM, then 6 AM
// He ends his day at 5 PM, then 6 PM, then 6 PM
// Normal time-card punching alternate calling of functions: The "LastTimeIn" would be 7 AM, then 7 AM, then 6 AM, and subtracting from the end time would work correctly
// Calling all the createTimeInEvent functions first: "LastTimeIn" becomes 6 AM for all three days and for each call of createTimeOutEvent function, giving Loki two extra hours of work

function createTimeEvent(employeeObject,dateStamp,type) {
    const timeEventsObject = {}; 
    const date = dateStamp.substring(0,10);
    const hour = parseInt(dateStamp.substring(dateStamp.length - 4), 10);
    timeEventsObject["type"] = type;
    timeEventsObject["date"] = date;
    timeEventsObject["hour"] = hour;
    if (!(employeeObject[date])) {
        employeeObject[date] = 0;
    }
    if (type == "TimeIn") {
        employeeObject["timeInEvents"].push(timeEventsObject);
        employeeObject[date + "LastTimeIn"] = hour;
    } else {
        employeeObject["timeOutEvents"].push(timeEventsObject);
        employeeObject[date] += (hour - employeeObject[date + "LastTimeIn"])/100;
    }
    employeeObject["totalTime"] += (hour - employeeObject[date + "LastTimeIn"])/100;
    employeeObject["totalWages"] = employeeObject["totalTime"] * employeeObject["payPerHour"]
    return employeeObject
}

function hoursWorkedOnDate(date) {
    return this[date]
}

// calling hoursWorkedOnDate, because that was in the instructions and being tested
// this[date] would work fine otherwise as test calls createTimeInEvent and createTimeOuEvent which creates date key

function wagesEarnedOnDate(date) {
    return (hoursWorkedOnDate.call(this, date) * this["payPerHour"])
}

function findEmployeeByFirstName(srcArray, firstName) {
    return srcArray.find(function (element) {
        return (element["firstName"] === firstName)
    })
}

// could easily call allWagesFor
// Instead of: employeeObject["totalWages"]
// Would use: allWagesFor.call(this)
// But unlike wagesEanedOnDate, am not required via tests, and this has better performance I suspect

function calculatePayroll(arrayOfEmployeeObjects) {
    return arrayOfEmployeeObjects.reduce( (acc,employeeObject) => acc + employeeObject["totalWages"] , 0)
}