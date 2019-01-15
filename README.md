ox-terms-js-date
================

Extension to javascript Date to handle Oxford term dates and office closure dates. This also comes with some date arithmetic functions.

You might find this is useful for: converting between Oxford term dates and dates; finding out which term a date is in; finding the date of a day in term time; finding out when holidays are; getting formatted date and term date strings; doing date calculations; calculating term; calculating full term; finding where Easter is.

Term date examples
------------------

Getting javascript objects for terms.

```
Date.getMichaelmasTermObject(year);
Date.getHilaryTermObject(year);
Date.getTrinityTermObject(year);

new Date().getMichaelmasTermObject();
new Date().getHilaryTermObject();
new Date().getTrinityTermObject();
```

E.g.

```
Date.getMichaelmasTermObject(2019);

{
  "year": 2019,
  "academicYear": 2019,
  "termNumber": 1,
  "term": "MT",
  "termName": "Michaelmas",
  "range": {
    "term": {
      "from": "2019-10-01T00:00:00.000Z",
      "to": "2019-12-17T00:00:00.000Z"
    },
    "full": {
      "from": "2019-10-13T00:00:00.000Z",
      "to": "2019-12-08T01:00:00.000Z"
    }
  }
}
```

All terms in an academic year:

```
Date.getTerms(academicYear);
new Date().getTerms();
```

e.g.

```
Date.getTerms(2019);

[
  {
    "year": 2019,
    "academicYear": 2019,
    "termNumber": 1,
    "term": "MT",
    "termName": "Michaelmas",
    "range": {
      "term": {
        "from": "2019-10-01T00:00:00.000Z",
        "to": "2019-12-17T00:00:00.000Z"
      },
      "full": {
        "from": "2019-10-13T00:00:00.000Z",
        "to": "2019-12-08T01:00:00.000Z"
      }
    }
  },
  {
    "year": 2020,
    "academicYear": 2019,
    "termNumber": 2,
    "term": "HT",
    "termName": "Hilary",
    "range": {
      "term": {
        "from": "2020-01-07T00:00:00.000Z",
        "to": "2020-03-25T00:00:00.000Z"
      },
      "full": {
        "from": "2020-01-19T00:00:00.000Z",
        "to": "2020-03-15T00:00:00.000Z"
      }
    }
  },
  {
    "year": 2020,
    "academicYear": 2019,
    "termNumber": 3,
    "term": "TT",
    "termName": "Trinity",
    "range": {
      "term": {
        "from": "2020-04-20T00:00:00.000Z",
        "to": "2020-07-06T00:00:00.000Z"
      },
      "full": {
        "from": "2020-04-26T00:00:00.000Z",
        "to": "2020-06-21T00:00:00.000Z"
      }
    }
  }
]
```

Getting a term object for a particular date. In addition to the term information, this adds the week-in-the-term and the day-of-the-week:
```
new Date(Date.UTC(2020,4,1,0,0,0,0)).getTerm();

{
  "year": 2020,
  "academicYear": 2019,
  "termNumber": 3,
  "term": "TT",
  "termName": "Trinity",
  "range": {
    "term": {
      "from": "2020-04-20T00:00:00.000Z",
      "to": "2020-07-06T00:00:00.000Z"
    },
    "full": {
      "from": "2020-04-26T00:00:00.000Z",
      "to": "2020-06-21T00:00:00.000Z"
    }
  },
  "weekInTerm": 1,
  "dayOfWeek": 6,
  "date": "2020-05-01T00:00:00.000Z"
}
```

Once you have a term object, it can be converted back to a date:
```
var date=new Date(Date.UTC(2020,4,1,0,0,0,0));
"2020-05-01T00:00:00.000Z"
var term=date.getTerm();
Date.getDateForTermObject(term);
"2020-05-01T00:00:00.000Z"
```

```
var terms=Date.getTerms(2019);
Date.getDateForTermObject(terms[2]);
"2020-04-26T00:00:00.000Z"
```

Creating a date for a particular year, term, week and day:
```
Date.getDateForTermWeekDay(2013,'MT',8,2); // Monday (2), week 8, Michaelmas term, 2013
```

Formatting dates

There are two built-it formats:
```
new Date().toTermString();
"Tuesday, Week 1 of Hilary Term 2019"
new Date().toDateString();
"Tue Jan 15 2019"
```

Using your own date/term format patterns using 'date.format()':

```
%acsyyyy - academic year start
%acsyy - last two digits of the academic year start
%aceyyyy - academic year end
%aceyy - last two digits of the academic year end
%yyyy - full year
%yy - last two digits of the year
%MMMM - full name of the month e.g. January
%MMM - shorter name of the month e.g. Jan
%MM - two digit month of the year e.g. 01
%M - month of the year, not zero padded e.g. 1
%EEEE - full name of the day of the week e.g. Monday
%EEE - shorter name of the day of the week e.g. Mon
%ww - day of week number 1-7 (sun-sat)
%w - day of week number, one digit
%tww - week in term, two digits
%tw - week in term, one digit
%tttt - name of the term
%tt - two letter abbreviation of the term
%tn - the term number 1,2 or 3
%t one letter abbreviation of the term
%dd two digit day of the month e.g. 03
%d day of the month, not zero padded e.g. 3
%o the ordinal of the day e.g. st nd rd th
```

```
new Date().format("%acsyyyy/%aceyy"); // 2018/19
new Date().format("0%tnACYR%acsyyyy"); // 02ACYR2018
new Date().format("%tt%yy"); // MT2015
new Date().format("%EEEE, Week %tw of %tttt Term %yyyy"); // Monday, Week 1 of Michaelmas Term 2015
new Date().format("%d%o %MMMM %yyyy"); // 19th January 2015
```

Office closure dates example
----------------------------

To get an array of office closure dates:

```
Date.getHolidays(2015);
new Date.getHolidays();
```

Getting the list of weekends
----------------------------

To get an array of weekend dates:

```
Date.getWeekends(2015);
new Date.getWeekends();
```

Added extras
------------

To make the above functions possible, the following functions have also been added to Date:

Easter:

```
Date.easter(2015); // returns a Date for easter in 2015 
new Date().easter(); // returns a Date for easter in the same year as the date used
```

Date arithmetic:

Add or subtract from a date. A new Date is returned.
```
Date.DATE_ADD(date,interval,unit);
new Date().DATE_ADD(interval,unit);
Date.DATE_SUB(date,interval,unit);
new Date().DATE_SUB(interval,unit);
```
where 'unit' is one of:

```
"MILLISECOND"
"SECOND"
"MINUTE"
"HOUR"
"DAY"
"WEEK"
"MONTH"
"YEAR"
```

and 'interval' is the number in that unit to add or subtract.

The absolute difference between two dates in days:

```
Date.DATEDIFF(date1,date2);
date1.DATEDIFF(date2);
```

Finding the number of days in a month:

```
Date.getDaysInMonth(date);
new Date().getDaysInMonth();
```

Finding the last day of a month:

```
Date.getLastDayOfMonth(date);
new Date().getLastDayOfMonth();
```

Is this year a leap year?
```
Date.isLeapYear(date);
new Date().isLeapYear();
```

Which day of the week is this? Returns 1..7 as Sunday..Saturday
```
Date.DAYOFWEEK(date);
new Date().DAYOFWEEK();
new Date().format("%w");
```
