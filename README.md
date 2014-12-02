ox-terms-js-date
================

Extension to javascript Date to handle Oxford term dates and office closure dates. This also comes with some date arithmetic functions.

You might find this is useful for: converting between Oxford term dates and dates; finding out which term a date is in; finding the date of a day in term time; finding out when holidays are; getting formatted date and term date strings; doing date calculations.

Term date examples
------------------

Getting the start of full term:

```
Date.michaelmas(2013)
Date.hilary(2014)
Date.trinity(2014)
```

Getting the start of full term for the current calendar year:
```
new Date().michaelmas()
new Date().hilary()
new Date().trinity()
```
Converting between dates and terms
```
new Date().toTerm().toDate()
```
Formatting the term:
```
new Date().toTermString()
new Date().getTerm().toString()
```
Using a format pattern:

```
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
%tttt name of the term
%tt two letter abbreviation of the term
%t one letter abbreviation of the term
%dd two digit day of the month e.g. 03
%d day of the month, not zero padded e.g. 3
%o the ordinal of the day e.g. st nd rd th

```

```
new Date().toTermString("%tt%yy"); // MT2015
new Date().toTermString("%EEEE, Week %tw of %tttt Term %yyyy"); // Monday, Week 1 of Michaelmas Term 2015
new Date().toTermString("%d%o %MMMM %yyyy"); // 19th January 2015
```

Creating a date for a particular year, term, week and day:
```
Date.getDateForTermWeekDay(2013,'MT',8,2); // Monday (2), week 8, Michaelmas term, 2013
```

Office closure dates example
----------------------------

To get an array of office closure dates:

```
Date.getHolidays(2015);
new Date.getHolidays();
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
