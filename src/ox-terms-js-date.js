"use strict";

/*
Author: Edward Crichton 
Extends Date to handle Oxford term dates.
*/

/* Utility functions */

Date.getDaysInMonth = function (date)
{
	return Date.getLastDayOfMonth(date).getDate();
};

Date.getLastDayOfMonth = function (date)
{
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

Date.isLeapYear = function (date)
{
	if (!date)
	{
		date = new Date();
	}

	var year = date.getFullYear();

	var feb = new Date(Date.UTC(year, 1, 1, 0, 0, 0, 0));
	return Date.getDaysInMonth(feb) > 28;
};

Date.easter = function (Y)
{
	var D;
	var E;
	var Q;

	D = 225 - 11 * (Y % 19);
	while (D > 50)
	{
		D = D - 30;
	}

	if (D > 48)
	{
		D = D - 1;
	}

	E = (Y + Math.floor(Y / 4) + D + 1) % 7;

	Q = D + 7 - E;

	if (Q < 32)
	{
		return new Date(Date.UTC(Y, 2, Q, 0, 0, 0, 0));
	}
	else
	{
		return new Date(Date.UTC(Y, 3, Q - 31, 0, 0, 0, 0));
	}
};

Date.DATE_ADD = function (date, interval, unit)
{
	if (interval === null || interval === undefined)
	{
		throw "Missing interval";
	}

	if (unit === null || unit === undefined)
	{
		throw "Missing unit";
	}

	var cloneDate = new Date(date.getTime());

	switch (unit.toUpperCase())
	{
		case "MILLISECOND":
			cloneDate.setUTCMilliseconds(cloneDate.getUTCMilliseconds() + interval);
			break;
		case "SECOND":
			cloneDate.setUTCSeconds(cloneDate.getUTCSeconds() + interval);
			break;
		case "MINUTE":
			cloneDate.setUTCMinutes(cloneDate.getUTCMinutes() + interval);
			break;
		case "HOUR":
			cloneDate.setUTCHours(cloneDate.getUTCHours() + interval);
			break;
		case "DAY":
			cloneDate.setUTCDate(cloneDate.getUTCDate() + interval);
			break;
		case "WEEK":
			cloneDate.setUTCDate(cloneDate.getUTCDate() + interval * 7);
			break;
		case "MONTH":
			cloneDate.setUTCMonth(cloneDate.getUTCMonth() + interval);
			break;
		case "YEAR":
			cloneDate.setUTCFullYear(cloneDate.getUTCFullYear() + interval);
			break;
		default:
			throw "Unknown unit: " + unit;
	}

	return cloneDate;
};

Date.DATE_SUB = function (date, interval, unit)
{
	return Date.DATE_ADD(date, -interval, unit);
};

Date.DATEDIFF = function (date1, date2)
{
	var millis_diff = Math.abs(date1.getTime() - date2.getTime());
	return Math.floor(millis_diff / (1000 * 60 * 60 * 24));
};

Date.DAYOFWEEK = function (date)
{
	// 1..7
	return date.getDay() + 1;
};

/* Returns the first day of full term (the teaching term) given a year */

Date.michaelmas = function (Y)
{
	// Full term is the first Sunday after the first Monday
	// find the first Monday in October and add 6 days.
	var oct1 = new Date(Date.UTC(Y, 9, 1, 0, 0, 0, 0));

	if (2 - Date.DAYOFWEEK(oct1) >= 0)
	{
		return Date.DATE_ADD(Date.DATE_ADD(oct1, 2 - Date.DAYOFWEEK(oct1), "DAY"), 6, "DAY");
	}
	else
	{
		return Date.DATE_ADD(Date.DATE_ADD(oct1, 9 - Date.DAYOFWEEK(oct1), "DAY"), 6, "DAY");
	}
};

Date.hilary = function (Y)
{
	// Full term is the first Sunday after the first Monday after 7th January

	var jan7 = new Date(Date.UTC(Y, 0, 7, 0, 0, 0, 0));

	if (2 - Date.DAYOFWEEK(jan7) >= 0)
	{
		return Date.DATE_ADD(Date.DATE_ADD(jan7, 2 - Date.DAYOFWEEK(jan7), "DAY"), 6, "DAY");
	}
	else
	{
		return Date.DATE_ADD(Date.DATE_ADD(jan7, 9 - Date.DAYOFWEEK(jan7), "DAY"), 6, "DAY");
	}
};

Date.trinity = function (Y)
{
	// Full term is the first Sunday after the latest out of (20th April or Wednesday after Easter)

	var latest;
	var twentyTh;

	twentyTh = new Date(Date.UTC(Y, 3, 20, 0, 0, 0, 0));

	// Wednesday after Easter
	latest = Date.DATE_ADD(Date.easter(Y), 3, "DAY");

	if (latest.getTime() < twentyTh.getTime())
	{
		latest = twentyTh;
	}

	if (1 - Date.DAYOFWEEK(latest) >= 0)
	{
		return Date.DATE_ADD(latest, 1 - Date.DAYOFWEEK(latest), "DAY");
	}
	else
	{
		return Date.DATE_ADD(latest, 8 - Date.DAYOFWEEK(latest), "DAY");
	}
};

/* Returns the first day of term (not full term) */

Date.michaelmas_start = function (Y)
{
	// Michaelmas shall begin on and include 1 October
	return new Date(Date.UTC(Y, 9, 1, 0, 0, 0, 0));
};

Date.hilary_start = function (Y)
{
	// Hilary shall begin on and include 7 January
	return new Date(Date.UTC(Y, 0, 7, 0, 0, 0, 0));
};

Date.trinity_start = function (Y)
{
	// Trinity shall begin on and include 20 April or the Wednesday after Easter, whichever is the later.

	var latest;
	var twentyTh;

	twentyTh = new Date(Date.UTC(Y, 3, 20, 0, 0, 0, 0));

	// Wednesday after Easter
	latest = Date.DATE_ADD(Date.easter(Y), 3, "DAY");

	if (latest.getTime() < twentyTh.getTime())
	{
		latest = twentyTh;
	}

	return latest;
};

/* Returns the last day of term (not full term) */

Date.michaelmas_end = function (Y)
{
	// Michaelmas shall end on and include 17 December.
	return new Date(Date.UTC(Y, 11, 17, 0, 0, 0, 0));
};

Date.hilary_end = function (Y)
{
	// Hilary shall end on and include 25 March or the Saturday before Palm Sunday, whichever is the earliest.

	var satBeforePalm;
	var twentyFifth;

	var easter = Date.easter(Y);

	twentyFifth = new Date(Date.UTC(Y, 2, 25, 0, 0, 0, 0));
	satBeforePalm = Date.DATE_SUB(easter, 8, "DAY");

	if (twentyFifth.getTime() < satBeforePalm.getTime())
	{
		return twentyFifth;
	}
	else
	{
		return satBeforePalm;
	}
};

Date.trinity_end = function (Y)
{
	// Trinity shall end on and include 6 July.
	return new Date(Date.UTC(Y, 6, 6, 0, 0, 0, 0));
};

/* returns the academic year the date is in */

Date.getAcademicYear = function (date)
{
	if (!date)
	{
		date = new Date();
	}

	var year = date.getFullYear();
	var michaelmas = Date.michaelmas_start(year);

	if (date.getTime() < michaelmas.getTime())
	{
		return year - 1;
	}
	else
	{
		return year;
	}
};

/* returns an array of terms as json objects for a given academic year */

Date.getTerms = function (academicYear)
{
	if (!academicYear)
	{
		academicYear = Date.getAcademicYear(new Date());
	}

	var terms = [];

	terms.push(Date.getMichaelmasTermObject(academicYear));
	terms.push(Date.getChristmasVacationObject(academicYear));
	terms.push(Date.getHilaryTermObject(academicYear + 1));
	terms.push(Date.getEasterVacationObject(academicYear + 1));
	terms.push(Date.getTrinityTermObject(academicYear + 1));
	terms.push(Date.getLongSummerVacationObject(academicYear + 1));

	return terms;
};

/* returns an array of office closure holidays for a given year */
Date.getHolidays = function (year)
{
	if (!year)
	{
		year = new Date().getFullYear();
	}

	var holidays = [];

	var yearEnd = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));

	var newYear = null;

	// When is new year day?
	if (yearEnd.DAYOFWEEK() === 1)
	{
		newYear = new Date(Date.UTC(year + 1, 0, 2, 0, 0, 0, 0));
	}
	else
	if (yearEnd.DAYOFWEEK() === 7)
	{
		newYear = new Date(Date.UTC(year + 1, 0, 3, 0, 0, 0, 0));
	}
	else
	{
		newYear = yearEnd;
	}

	// extend year end bounds to include the new year
	if (yearEnd.getTime() < newYear.getTime())
	{
		yearEnd = newYear;
	}

	// Easter

	var easter = Date.easter(year);

	holidays.push({ from: easter.DATE_SUB(3, "DAY"), to: easter.DATE_ADD(2, "DAY"), holiday: "Easter" });

	// May day bank
	var firstMay = new Date(Date.UTC(year, 4, 1, 0, 0, 0, 0));
	var mayDay = null;

	if (2 - firstMay.DAYOFWEEK() >= 0)
	{
		mayDay = firstMay.DATE_ADD(2 - firstMay.DAYOFWEEK(), "DAY");
	}
	else
	{
		mayDay = firstMay.DATE_ADD(9 - firstMay.DAYOFWEEK(), "DAY");
	}

	holidays.push({ from: mayDay, to: mayDay.DATE_ADD(1, "DAY"), holiday: "May day" });

	// Spring bank

	var lastMay = new Date(Date.UTC(year, 4, 31, 0, 0, 0, 0));
	var springBank = null;

	if (lastMay.DAYOFWEEK() >= 2)
	{
		springBank = lastMay.DATE_ADD(2 - lastMay.DAYOFWEEK(), "DAY");
	}
	else
	{
		springBank = lastMay.DATE_ADD(2 - lastMay.DAYOFWEEK() - 7, "DAY");
	}

	holidays.push({ from: springBank, to: springBank.DATE_ADD(1, "DAY"), holiday: "Spring bank" });

	var lastAugust = new Date(Date.UTC(year, 7, 31, 0, 0, 0, 0));
	var summerBank = null;

	if (lastAugust.DAYOFWEEK() >= 2)
	{
		summerBank = lastAugust.DATE_ADD(2 - lastAugust.DAYOFWEEK(), "DAY");
	}
	else
	{
		summerBank = lastAugust.DATE_ADD(2 - lastAugust.DAYOFWEEK() - 7, "DAY");
	}

	holidays.push({ from: summerBank, to: summerBank.DATE_ADD(1, "DAY"), holiday: "Summer bank" });
	// calc office closed for christmas

	var christmasClose = newYear.DATE_SUB(9, "DAY");
	if (christmasClose.DAYOFWEEK() === 1 || christmasClose.DAYOFWEEK() === 7)
	{
		christmasClose = christmasClose.DATE_SUB(2, "DAY");
	}

	holidays.push({ from: christmasClose, to: newYear.DATE_ADD(1, "DAY"), holiday: "Christmas" });
	return holidays;
};

/* Returns the list of weekends for a given year */

Date.getWeekends = function (year)
{
	if (!year)
	{
		year = new Date().getFullYear();
	}

	var weekends = [];

	// find the first Sunday of the year

	var yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));

	var firstSunday = null;

	firstSunday = yearStart.DATE_ADD(8 - yearStart.DAYOFWEEK(), "DAY");

	var sunday = firstSunday;
	for (var w = 0; w < 52; w++)
	{
		if (w > 0)
		{
			sunday = sunday.DATE_ADD(1, "WEEK");
		}
		weekends.push({ from: sunday.DATE_SUB(1, "DAY"), to: sunday.DATE_ADD(1, "DAY"), holiday: "Weekend" });
	}
	return weekends;
};

/* Translate an Oxford term date into a calendar date */

/*
	returns the date for: a term and a week and a day of week, with 1..7 being sun-sat. (2..6 = mon-fri)
	e.g. you can get Thursday of week 0 Michaelmas term with: SELECT getDateForTermWeekDay(2012,'MT',0,5);
*/

Date.getDateForTermWeekDay = function (year, term, weekInTerm, dayOfWeek)
{
	var termStart;
	if (term !== 'MT' && term !== 'HT' && term !== 'TT' && term !== 'CV' && term !== 'EV' && term !== 'LSV')
	{
		throw "The term parameter must be one of: MT, HT or TT for terms; or CV, EV or LSV for vacations";
	}

	switch (term)
	{
		case 'MT':
			termStart = Date.michaelmas(year);
			break;
		case 'HT':
			termStart = Date.hilary(year);
			break;
		case 'TT':
			termStart = Date.trinity(year);
			break;
		case 'CV':
			termStart = Date.DATE_ADD(Date.michaelmas_end(year), 1, "DAY");
			break;
		case 'EV':
			termStart = Date.DATE_ADD(Date.hilary_end(year), 1, "DAY");
			break;
		case 'LSV':
			termStart = Date.DATE_ADD(Date.trinity_end(year), 1, "DAY");
			break;
	}

	return Date.DATE_ADD(Date.DATE_ADD(termStart, weekInTerm - 1, "WEEK"), dayOfWeek - 1, "DAY");
};

/* returns the date for a term object. */
Date.getDateForTermObject = function (termObject)
{
	if (!termObject)
	{
		return null;
	}

	if (termObject.date)
	{
		return termObject.date;
	}

	if (termObject.year === null || termObject.year === undefined)
	{
		throw "Missing year";
	}
	if (termObject.term === null || termObject.term === undefined)
	{
		throw "Missing term";
	}

	var date = Date.getDateForTermWeekDay(termObject.year, termObject.term, termObject.weekInTerm === null || termObject.weekInTerm === undefined ? 1 : termObject.weekInTerm, termObject.dayOfWeek === null || termObject.dayOfWeek === undefined ? 1 : termObject.dayOfWeek);

	return date;
};

Date.getMichaelmasTermObject = function (year)
{
	var term = 'MT';
	var termName = 'Michaelmas';
	var termNumber = 1;
	var termFrom = Date.michaelmas_start(year);
	var termTo = Date.michaelmas_end(year);
	var fullTermFrom = Date.michaelmas(year);
	var fullTermTo = Date.DATE_SUB(Date.DATE_ADD(fullTermFrom, 8, "WEEK"), 1, "DAY");
	var academicYear = Date.getAcademicYear(fullTermFrom);

	var termObject =
	{
		"year": year,
		"academicYear": academicYear,
		"termNumber": termNumber,
		"term": term,
		"termName": termName,
		"range":
		{
			"term": { "from": termFrom, "to": termTo },
			"full": { "from": fullTermFrom, "to": fullTermTo }
		}
	};
	return termObject;
};

Date.getHilaryTermObject = function (year)
{
	var term = 'HT';
	var termName = 'Hilary';
	var termNumber = 2;
	var termFrom = Date.hilary_start(year);
	var termTo = Date.hilary_end(year);
	var fullTermFrom = Date.hilary(year);
	var fullTermTo = Date.DATE_SUB(Date.DATE_ADD(fullTermFrom, 8, "WEEK"), 1, "DAY");
	var academicYear = Date.getAcademicYear(fullTermFrom);

	var termObject =
	{
		"year": year,
		"academicYear": academicYear,
		"termNumber": termNumber,
		"term": term,
		"termName": termName,
		"range":
		{
			"term": { "from": termFrom, "to": termTo },
			"full": { "from": fullTermFrom, "to": fullTermTo }
		}
	};
	return termObject;
};

Date.getTrinityTermObject = function (year)
{
	var term = 'TT';
	var termName = 'Trinity';
	var termNumber = 3;
	var termFrom = Date.trinity_start(year);
	var termTo = Date.trinity_end(year);
	var fullTermFrom = Date.trinity(year);
	var fullTermTo = Date.DATE_SUB(Date.DATE_ADD(fullTermFrom, 8, "WEEK"), 1, "DAY");
	var academicYear = Date.getAcademicYear(fullTermFrom);

	var termObject =
	{
		"year": year,
		"academicYear": academicYear,
		"termNumber": termNumber,
		"term": term,
		"termName": termName,
		"range":
		{
			"term": { "from": termFrom, "to": termTo },
			"full": { "from": fullTermFrom, "to": fullTermTo }
		}
	};
	return termObject;
};

Date.getChristmasVacationObject = function (year)
{
	var term = 'CV';
	var termName = 'Christmas';
	var termNumber = 1.5;
	var termFrom = Date.DATE_ADD(Date.michaelmas_end(year), 1, "DAY");
	var termTo = Date.DATE_SUB(Date.hilary_start(year + 1), 1, "DAY");
	var academicYear = Date.getAcademicYear(termFrom);

	var termObject =
	{
		"year": year,
		"academicYear": academicYear,
		"termNumber": termNumber,
		"term": term,
		"termName": termName,
		"range":
		{
			"vacation": { "from": termFrom, "to": termTo }
		}
	};
	return termObject;
};

Date.getEasterVacationObject = function (year)
{
	var term = 'EV';
	var termName = 'Easter';
	var termNumber = 2.5;
	var termFrom = Date.DATE_ADD(Date.hilary_end(year), 1, "DAY");
	var termTo = Date.DATE_SUB(Date.trinity_start(year), 1, "DAY");
	var academicYear = Date.getAcademicYear(termFrom);

	var termObject =
	{
		"year": year,
		"academicYear": academicYear,
		"termNumber": termNumber,
		"term": term,
		"termName": termName,
		"range":
		{
			"vacation": { "from": termFrom, "to": termTo }
		}
	};
	return termObject;
};

Date.getLongSummerVacationObject = function (year)
{
	var term = 'LSV';
	var termName = 'Long Summer';
	var termNumber = 3.5;
	var termFrom = Date.DATE_ADD(Date.trinity_end(year), 1, "DAY");
	var termTo = Date.DATE_SUB(Date.michaelmas_start(year), 1, "DAY");
	var academicYear = Date.getAcademicYear(termFrom);

	var termObject =
	{
		"year": year,
		"academicYear": academicYear,
		"termNumber": termNumber,
		"term": term,
		"termName": termName,
		"range":
		{
			"vacation": { "from": termFrom, "to": termTo }
		}
	};
	return termObject;
};

/*
	returns an object representing a term given a date. Week starts from week '-1' onwards
	e.g. getTermObjectForDate(new Date(2012,9,4,0,0,0,0));
*/

Date.getTermObjectForDate = function (date_in)
{
	var Y;
	var MT, MT_end;
	var HT, HT_end;
	var TT, TT_end;

	var relative;
	var WEEK;

	var termObject;

	if (date_in.getUTCHours() !== 0 && date_in.getHours() === 0)
	{
		// Daylight savings correction
		date_in = new Date(date_in.getTime());

		date_in.setUTCHours(0);
		date_in.setUTCDate(date_in.getUTCDate() + 1);
	}

	Y = date_in.getFullYear();

	MT = Date.michaelmas(Y);MT_end = Date.michaelmas_end(Y);
	HT = Date.hilary(Y);HT_end = Date.hilary_end(Y);
	TT = Date.trinity(Y);TT_end = Date.trinity_end(Y);

	if (date_in.getTime() > MT_end.getTime())
	{
		// Christmas vacation
		termObject = Date.getChristmasVacationObject(Y);
		relative = Date.DATE_ADD(MT_end, 1, "DAY");
	}
	else
	if (date_in.getTime() >= Date.DATE_SUB(MT, 2, "WEEK").getTime())
	{
		termObject = Date.getMichaelmasTermObject(Y);
		relative = MT;
	}
	else
	if (date_in.getTime() > TT_end.getTime())
	{
		// Long summer vacation
		termObject = Date.getLongSummerVacationObject(Y);
		relative = Date.DATE_ADD(TT_end, 1, "DAY");
	}
	else
	if (date_in.getTime() >= Date.DATE_SUB(TT, 2, "WEEK").getTime())
	{
		termObject = Date.getTrinityTermObject(Y);
		relative = TT;
	}
	else
	if (date_in.getTime() > HT_end.getTime())
	{
		// Easter vacation
		termObject = Date.getEasterVacationObject(Y);
		relative = Date.DATE_ADD(HT_end, 1, "DAY");
	}
	else
	if (date_in.getTime() >= Date.DATE_SUB(HT, 2, "WEEK").getTime())
	{
		termObject = Date.getHilaryTermObject(Y);
		relative = HT;
	}
	else
	{
		// Previous Christmas vacation
		termObject = Date.getChristmasVacationObject(Y - 1);
		relative = Date.DATE_ADD(Date.michaelmas_end(Y - 1), 1, "DAY");
	}

	if (relative)
	{
		WEEK = Math.floor((Date.DATEDIFF(date_in, Date.DATE_SUB(relative, 2, "WEEK")) - 14) / 7) + 1;
	}
	else
	{
		WEEK = "";
	}

	termObject.weekInTerm = WEEK;
	termObject.dayOfWeek = Date.DAYOFWEEK(date_in);
	termObject.date = new Date(date_in.getTime());

	return termObject;
};

Date.format = Date.toTermString = function (date, format)
{
	if (!format)
	{
		throw "Missing date format";
	}

	var termObject;

	if (format.indexOf('%ac') || format.indexOf('%ruac') || format.indexOf('%w') || format.indexOf('%t') || format.indexOf('%vt'))
	{
		termObject = Date.getTermObjectForDate(date);
	}

	var pad = function pad(str)
	{
		str = '' + str;
		while (str.length < 2)
		{
			str = '0' + str;
		}
		return str;
	};

	var dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var monthOfYearNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	return format
		.split('%acsyyyy').join(termObject.academicYear)
		.split('%acsyy').join((termObject.academicYear + '').substring(2))
		.split('%aceyyyy').join(termObject.academicYear+1)
		.split('%aceyy').join(((termObject.academicYear+1) + '').substring(2))
		.split('%ruacsyyyy').join(termObject.termNumber===3.5?termObject.academicYear+1:termObject.academicYear)
		.split('%ruacsyy').join(((termObject.termNumber===3.5?termObject.academicYear+1:termObject.academicYear) + '').substring(2))
		.split('%ruaceyyyy').join(termObject.termNumber===3.5?termObject.academicYear+2:termObject.academicYear+1)
		.split('%ruaceyy').join(((termObject.termNumber===3.5?termObject.academicYear+2:termObject.academicYear+1) + '').substring(2))
		.split('%yyyy').join(date.getFullYear())
		.split('%yy').join((date.getFullYear() + '').substring(2))
		.split('%MMMM').join(monthOfYearNames[date.getMonth()])
		.split('%MMM').join(monthOfYearNames[date.getMonth()].substring(0,3))
		.split('%MM').join(pad(date.getMonth()+1))
		.split('%M').join((date.getMonth()+1))
		.split('%EEEE').join(dayOfWeekNames[termObject.dayOfWeek-1])
		.split('%EEE').join(dayOfWeekNames[termObject.dayOfWeek-1].substring(0,3))
		.split('%ww').join(pad(termObject.dayOfWeek))
		.split('%w').join(termObject.dayOfWeek)
		.split('%tww').join(pad(termObject.weekInTerm))
		.split('%tw').join(termObject.weekInTerm)
		.split('%tttt').join(termObject.termName)
		.split('%tt').join(termObject.term)
		.split('%tn').join(termObject.termNumber)
		.split('%t').join(termObject.term.substring(0,1))
		.split('%vt').join(termObject.range.vacation?"Vacation":"Term")
		.split('%dd').join(pad(date.getDate()))
		.split('%d').join(date.getDate())
		.split('%o').join("thstndrdthththththththththththththththththstndrdthththththththst".substring(((date.getDate() % 32)*2),((date.getDate() % 32)*2)+2))
		;
	};

/* Bind these functions to Date instances */

(
function()
{
	function addPrototype(function_name, func)
	{
		if( typeof Date.prototype[function_name] === 'undefined' ){Date.prototype[function_name] = func;}
	}
	
	function addPrototypeAttribute(attribute_name, attribute_value)
	{
		if( typeof Date.prototype[attribute_name] === 'undefined' ){Date.prototype[attribute_name] = attribute_value;}
	}
	
	addPrototype("getDaysInMonth",function(){return Date.getDaysInMonth(this);});
	addPrototype("getLastDayOfMonth",function(){return Date.getLastDayOfMonth(this);});
	addPrototype("isLeapYear",function(){return Date.isLeapYear(this);});
	addPrototype("easter",function(){return Date.easter(this.getFullYear());});
	
	addPrototype("DATE_ADD",function(interval,unit){return Date.DATE_ADD(this,interval,unit);});
	addPrototype("DATE_SUB",function(interval,unit){return Date.DATE_SUB(this,interval,unit);});
	addPrototype("DATEDIFF",function(date){return Date.DATEDIFF(this,date);});
	addPrototype("DAYOFWEEK",function(){return Date.DAYOFWEEK(this);});
	
	addPrototype("michaelmas",function(){return Date.michaelmas(this.getFullYear());});
	addPrototype("hilary",function(){return Date.hilary(this.getFullYear());});
	addPrototype("trinity",function(){return Date.trinity(this.getFullYear());});
	
	addPrototype("michaelmas_start",function(){return Date.michaelmas_start(this.getFullYear());});
	addPrototype("hilary_start",function(){return Date.hilary_start(this.getFullYear());});
	addPrototype("trinity_start",function(){return Date.trinity_start(this.getFullYear());});
	
	addPrototype("michaelmas_end",function(){return Date.michaelmas_end(this.getFullYear());});
	addPrototype("hilary_end",function(){return Date.hilary_end(this.getFullYear());});
	addPrototype("trinity_end",function(){return Date.trinity_end(this.getFullYear());});
	
	addPrototype("getAcademicYear",function(){return Date.getAcademicYear(this);});
	addPrototype("getTerms",function(){return Date.getTerms(this.getAcademicYear());});
	
	addPrototype("getMichaelmasTermObject",function(){return Date.getMichaelmasTermObject(this.getFullYear());});
	addPrototype("getHilaryTermObject",function(){return Date.getHilaryTermObject(this.getFullYear());});
	addPrototype("getTrinityTermObject",function(){return Date.getTrinityTermObject(this.getFullYear());});
	addPrototype("getChristmasVacationObject",function(){return Date.getChristmasVacationObject(this.getFullYear());});
	addPrototype("getEasterVacationObject",function(){return Date.getEasterVacationObject(this.getFullYear());});
	addPrototype("getLongSummerVacationObject",function(){return Date.getLongSummerVacationObject(this.getFullYear());});
	
	addPrototype("getTerm",function(){return Date.getTermObjectForDate(this);});
	addPrototypeAttribute("termFormat","%EEEE, Week %tw of %tttt %vt %yyyy");
	addPrototypeAttribute("dateFormat","%EEE, %dd %MMM %yyyy");
	addPrototype("toTermString",function(format){return Date.toTermString(this,format || this.termFormat);});
	addPrototype("toDateString",function(format){return Date.toTermString(this,format || this.dateFormat);});
	addPrototype("format",function(format){return Date.format(this,format || this.dateFormat);});
	addPrototype("getHolidays",function(){return Date.getHolidays(this.getFullYear());});
	addPrototype("getWeekends",function(){return Date.getWeekends(this.getFullYear());});
}
)();
