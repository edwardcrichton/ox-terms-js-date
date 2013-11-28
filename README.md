ox-terms-js-date
================

Extension to javascript Date to handle Oxford term dates.

Examples
========

Getting the start of full term:

Date.michaelmas(2013)
Date.hilary(2014)
Date.trinity(2014)

Getting the start of full term for the current calendar year:

new Date().michaelmas()
new Date().hilary()
new Date().trinity()

Converting between dates and terms

new Date().toTerm().toDate()

Formatting the term:

new Date().toTermString()
new Date().getTerm().toString()

Using a format pattern:

%yyyy - full year
%yy - last two digits of the year
%EEEE - full name of the day of the week e.g. Monday
%EEE - shorter name of the day of the week e.g. Mon
%ww - day of week number 1-7 (sun-sat)
%w - day of week number, one digit
%tww - week in term, two digits
%tw - week in term, one digit
%tttt name of the term
%tt two letter abbreviation of the term
%t one letter abbreviation of the term

new Date().toTermString("%tt%yy")
new Date().toTermString("%EEEE, Week %tw of %tttt Term %yyyy")

Creating a date for a particular year, term, week and day:

Date.getDateForTermWeekDay(2013,'MT',8,2) // Monday (2), week 8, Michaelmas term, 2013
