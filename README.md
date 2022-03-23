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

All terms and vacations in an academic year:

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
        "to": "2019-12-07T00:00:00.000Z"
      }
    }
  },
  {
    "year": 2019,
    "academicYear": 2019,
    "termNumber": 1.5,
    "term": "CV",
    "termName": "Christmas",
    "range": {
      "vacation": {
        "from": "2019-12-18T00:00:00.000Z",
        "to": "2020-01-06T00:00:00.000Z"
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
        "to": "2020-03-14T00:00:00.000Z"
      }
    }
  },
  {
    "year": 2020,
    "academicYear": 2019,
    "termNumber": 2.5,
    "term": "EV",
    "termName": "Easter",
    "range": {
      "vacation": {
        "from": "2020-03-26T00:00:00.000Z",
        "to": "2020-04-19T00:00:00.000Z"
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
        "to": "2020-06-20T00:00:00.000Z"
      }
    }
  },
  {
    "year": 2020,
    "academicYear": 2019,
    "termNumber": 3.5,
    "term": "LSV",
    "termName": "Long Summer",
    "range": {
      "vacation": {
        "from": "2020-07-07T00:00:00.000Z",
        "to": "2020-09-30T00:00:00.000Z"
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
%ruacsyyyy - 'Running up to' academic year start - 
%ruacsyy - last two digits of the running up to academic year start
%ruaceyyyy - 'Running up to' academic year end
%ruaceyy - last two digits of the running up to academic year end
%yyyy - full year
%yy - last two digits of the year
%MMMM - full name of the month e.g. January
%MMM - shorter name of the month e.g. Jan
%MM - two digit month of the year e.g. 01
%M - month of the year, not zero padded e.g. 1
%EEEE - full name of the day of the week e.g. Monday
%EEE - shorter name of the day of the week e.g. Mon
%ww - day of week number 01-07 (sun-sat)
%w - day of week number, one digit 1-7 (sun-sat)
%tww - week in term, two digits
%tw - week in term, one digit
%tttt - name of the term e.g. Michaelmas, Hilary, Trinity, Christmas, Easter, Long Summer
%tt - two letter abbreviation of the term e.g. MT, HT, TT, CV, EV, LV
%tn - the term number 1,2 or 3; or vacation number 1.5, 2.5 or 3.5
%t one letter abbreviation of the term or vacation e.g. M,H,T,C,E,L
%vt - The word 'Term' or 'Vacation'
%dd two digit day of the month e.g. 03
%d day of the month, not zero padded e.g. 3
%o the ordinal of the day of the month e.g. st nd rd th
```

```
new Date().format("%acsyyyy/%aceyy"); // 2018/19
new Date().format("%ruacsyyyy"); // Same as %acsyyyy until Trinity Term has ended, when it reports the up coming academic year
new Date().format("0%tnACYR%acsyyyy"); // 02ACYR2018
new Date().format("%tt%yy"); // MT2015
new Date().format("%EEEE, Week %tw of %tttt %vt %yyyy"); // Monday, Week 1 of Michaelmas Term 2015
new Date().format("%EEEE of Week %tw, %tttt %vt"); // Monday of Week 1, Michaelmas Term
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

Dates in web pages
------------------

Here's an example of using term dates in a web page.

Say that there are recurring deadlines each academic year and these are alwaying given as terms, week of term, and the day of the week. It would be convenient to list these in a web page along with the corresponding dates but without having to edit the page each academic year.

For example for the academic year 2021/2022:
```
Monday of Week 7, Hilary Term (28th Feb 2022): registration
Monday of Week 1, Trinity Term (25th Apr 2022): project proposal
12pm on Monday of Week 4 of Trinity Term (16th May 2022): submission deadline
Tuesday of Week -5 (minus 5), Michaelmas Term (30th Aug 2022): submission deadline
```

For each of these term dates, we can use javascript to insert the corresponding date into the page. In the web page's HTML we can give the term date and the date format we want to display. The academic year we are in changes over time, so we use a date pattern to describe the academic year.

e.g. Put the recurring term details into ```<span></span>``` elements using attributes for term and date format:
```
<h3>Important Deadlines are:</h3>
 
 <dl>
 	<dt>All:</dt>
	<dd>
	Monday of Week 7, Hilary Term
	<span x-term="%ruaceyyyy,HT,7,2" x-format="(%d%o %MMM %yyyy)"></span>:
	your online project registration survey must be completed.
	</dd>
	
	<dt>MSc students:</dt>
	<dd>
	Monday of Week 1, Trinity Term
	<span x-term="%ruaceyyyy,TT,1,2" x-format="(%d%o %MMM %yyyy)"></span>:
	submission deadline for your project proposal.
	</dd>
	
	<dt>3rd/4th year students:</dt>
	<dd>
	12pm on Monday of Week 4 of Trinity Term
	<span x-term="%ruaceyyyy,TT,4,2" x-format="(%d%o %MMM %yyyy)"></span>:
	Submission deadline.
	</dd>
	
	<dt>MSc students:</dt>
	<dd>
	Tuesday of Week <strong>-</strong>5 (minus 5), Michaelmas Term
	<span x-term="%ruaceyyyy,MT,-5,3" x-format="(%d%o %MMM %yyyy)"></span>:
	Submission deadline
	</dd>
 </dl>

```

Use jQuery to find all elements with a term description and put the resulting date into that element's text.
```
<script type="text/javascript">
$(document).ready
(
	function()
	{
		$('*[x-term]').each
		(
			function()
			{
				var term=$(this).attr("x-term");
				var termParametersFormatted=new Date().format(term);
				var params=termParametersFormatted.split(",");
				var format=$(this).attr("x-format");
				var formatted=Date.getDateForTermWeekDay(params[0],params[1],params[2],params[3]).format(format);
				$(this).text(formatted);
			}
		);
	}
);
</script>
```

This works by taking the contents of an x-term attribute and passing it through the date formatter. The date formatter replaces formatting patterns with values. In this example it is replacing the pattern %ruaceyyyy (running up to academic year end) with 2022 during the academic year 2021/2022 for MT,HT,TT and then 2023 following TT. The given pattern for x-term '%ruaceyyyy,HT,7,2' becomes '2022,HT,7,2' meaning Monday Week 7 of HT2022. It converts that to a date, formats it with the pattern given in the attribute x-format and puts the result in the element. After TT or into 2022/2023 the page will display the date for '2023,HT,7,2' and so on.
