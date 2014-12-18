/*
Author: Edward Crichton 
Extends Date to handle Oxford term dates.

Extends Date with:

easter DATE_ADD DATE_SUB DATEDIFF DAYOFWEEK michaelmas hilary trinity getDateForTermWeekDay getDateForTermObject getTermObjectForDate toTermString 

Adds OxfordTerm prototype.

Extends OxfordTerm with:

getDate toString

Can be used to:

Calculate the first day of a full term given a year.
Convert between Oxford term dates and calendar dates and back.
Get a formatted string of a term.
*/

/* Utility functions */
Date.easter=function(Y)
{
	var D;
	var E;
	var Q;
	
	D=225-(11 * (Y % 19));
	while(D>50)
	{
		D=D-30;
	}
	
	if(D>48){D=D-1;}
	
	E=(Y + Math.floor(Y/4) + D + 1) % 7;
	
	Q=D + 7 - E;
	
	if(Q<32)
	{
		return new Date(Y, 2, Q, 0, 0, 0, 0);
	}
	else
	{
		return new Date(Y, 3, (Q-31), 0, 0, 0, 0);
	}
	
};

Date.DATE_ADD=function(date,interval,unit)
{
	if (interval==null)
	{
		throw "Missing interval";
	}
	
	if (!unit)
	{
		throw "Missing unit";
	}
	
	var cloneDate = new Date(date.getTime());
	
	switch (unit.toUpperCase())
	{
		case "MILLISECOND":
			cloneDate.setMilliseconds(cloneDate.getMilliseconds() + interval);
			break;
		case "SECOND":
			cloneDate.setSeconds(cloneDate.getSeconds() + interval);
			break;
		case "MINUTE":
			cloneDate.setMinutes(cloneDate.getMinutes() + interval);
			break;
		case "HOUR":
			cloneDate.setHours(cloneDate.getHours() + interval);
			break;
		case "DAY":
			cloneDate.setDate(cloneDate.getDate() + interval);
			break;
		case "WEEK":
			cloneDate.setDate(cloneDate.getDate() + (interval*7));
			break;	
		case "MONTH":
			cloneDate.setMonth(cloneDate.getMonth() + interval);
			break;
		case "YEAR":
			cloneDate.setFullYear(cloneDate.getFullYear() + interval);
			break;
		default:
			throw "Unknown unit: "+unit;
	}
	
	return cloneDate;
};

Date.DATE_SUB = function(date,interval,unit)
{
	return Date.DATE_ADD(date,-interval,unit);
};

Date.DATEDIFF = function(date1,date2)
{
	var millis_diff=Math.abs(date1.getTime()-date2.getTime());
	return Math.floor(millis_diff/(1000*60*60*24));
};

Date.DAYOFWEEK = function(date)
{
	// 1..7
	return date.getDay()+1;
};

/* Returns the first day of full term given a year */

Date.michaelmas=function(Y)
{
	// Full term is the first Sunday after the first Monday
	// find the first Monday in October and add 6 days.
	var oct1=new Date(Y,9,1,0,0,0,0);
	
	if(2 - Date.DAYOFWEEK(oct1) >=0)
	{
		var interval=2 - Date.DAYOFWEEK(oct1);
		
		return Date.DATE_ADD(Date.DATE_ADD( oct1, ( 2 - Date.DAYOFWEEK(oct1) ),"DAY" ), 6, "DAY");
	}
	else
	{
		return Date.DATE_ADD(Date.DATE_ADD( oct1, ( 9 - Date.DAYOFWEEK(oct1) ),"DAY" ), 6, "DAY");
	}
	
};

Date.hilary=function(Y)
{
	// Full term is the first Sunday after the first Monday after 7th January
	
	var jan7=new Date(Y,0,7,0,0,0,0);
	
	if(2 - Date.DAYOFWEEK(jan7) >=0)
	{
		var interval=2 - Date.DAYOFWEEK(jan7);
		
		return Date.DATE_ADD(Date.DATE_ADD( jan7, ( 2 - Date.DAYOFWEEK(jan7) ),"DAY" ), 6, "DAY");
	}
	else
	{
		return Date.DATE_ADD(Date.DATE_ADD( jan7, ( 9 - Date.DAYOFWEEK(jan7) ),"DAY" ), 6, "DAY");
	}
};

Date.trinity=function(Y)
{
	// Full term is the first Sunday after the latest out of (20th April or Wednesday after Easter)
	
	var latest;
	var twentyTh;
	
	twentyTh=new Date(Y,3,20,0,0,0,0);
	
	// Wednesday after Easter
	latest=Date.DATE_ADD(Date.easter(Y),3,"DAY");
	
	if(latest.getTime() < twentyTh.getTime())
	{
		latest=twentyTh;
	}
	
	if(1-Date.DAYOFWEEK(latest)>=0)
    {
        return Date.DATE_ADD( latest, ( 1- Date.DAYOFWEEK(  latest ) ), "DAY" );
	}
    else
	{
        return Date.DATE_ADD(latest, ( 8 - Date.DAYOFWEEK(latest ) ), "DAY");
	}
};

/* returns an array of office closure holidays for a given year */
Date.getHolidays=function(year)
{
	if(!year)
		{
			year=(new Date()).getFullYear();
		}
	
		var holidays=[];
		
		var yearEnd=new Date(year+1, 0, 1,0,0,0,0);
		
		var newYear=null;

		// When is new year day?
		if(yearEnd.DAYOFWEEK()==1)
		{
			newYear=new Date(year+1,0,2,0,0,0,0);
		}
		else
		if(yearEnd.DAYOFWEEK()==7)
		{
			newYear=new Date(year+1,0,3,0,0,0,0);
		}
		else
		{
			newYear=yearEnd;
		}

		// extend year end bounds to include the new year
		if(yearEnd.getTime() < newYear.getTime())
		{
			yearEnd=newYear;
		}

		
		// Easter

		var easter=Date.easter(year);

		holidays.push({from:easter.DATE_SUB(3,"DAY"), to: easter.DATE_ADD(2,"DAY"), holiday:"Easter"});

		// May day bank
		var firstMay=new Date(year,4,1,0,0,0,0);
		var mayDay=null;

		if(2-firstMay.DAYOFWEEK()>=0)
		{
			mayDay=firstMay.DATE_ADD( ( 2 - firstMay.DAYOFWEEK() ), "DAY");
		}
		else
		{
			mayDay=firstMay.DATE_ADD( ( 9 - firstMay.DAYOFWEEK() ), "DAY");
		}

		
		holidays.push({from:mayDay, to: mayDay.DATE_ADD(1,"DAY"), holiday:"May day"});
		
		// Spring bank

		var lastMay=new Date(year, 4, 31,0,0,0,0);
		var springBank=null;

		if(lastMay.DAYOFWEEK()>=2)
		{
			springBank=lastMay.DATE_ADD( ( 2 - lastMay.DAYOFWEEK() ) , "DAY");
		}
		else
		{
			springBank=lastMay.DATE_ADD( ( 2 - lastMay.DAYOFWEEK() ) - 7, "DAY" );
		}

		holidays.push({from:springBank, to: springBank.DATE_ADD(1,"DAY"), holiday:"Spring bank"});

		var lastAugust=new Date(year, 7, 31,0,0,0,0);
		var summerBank=null;
		
		if(lastAugust.DAYOFWEEK()>=2)
		{
			summerBank=lastAugust.DATE_ADD(  ( 2 - lastAugust.DAYOFWEEK() ), "DAY");
		}
		else
		{
			summerBank=lastAugust.DATE_ADD( ( 2 - lastAugust.DAYOFWEEK() ) - 7 , "DAY");
		}

		
		holidays.push({from:summerBank, to: summerBank.DATE_ADD(1,"DAY"), holiday:"Summer bank"});
		// calc office closed for christmas

		var christmasClose=newYear.DATE_SUB(9,"DAY");
		if(christmasClose.DAYOFWEEK()==1 || christmasClose.DAYOFWEEK()==7)
		{
			christmasClose=christmasClose.DATE_SUB(2,"DAY");
		}

		holidays.push({from:christmasClose, to: newYear.DATE_ADD(1,"DAY"), holiday:"Christmas"});
		return holidays;
}

/* Returns the list of weekends for a given year */

Date.getWeekends=function(year)
{
        if(!year)
        {
                year=(new Date()).getFullYear();
        }

        var weekends=[];

        // find the first Sunday of the year

        var yearStart=new Date(year, 0, 1,0,0,0,0);

        var firstSunday=null;

        firstSunday=yearStart.DATE_ADD( ( 8 - yearStart.DAYOFWEEK() ), "DAY");


        var sunday=firstSunday;
        for(var w=0;w<52;w++)
        {
                if(w>0)
                {
                        sunday=sunday.DATE_ADD(1,"WEEK");
                }
                weekends.push({from:sunday.DATE_SUB(1,"DAY"), to: sunday.DATE_ADD(1,"DAY"), holiday:"Weekend"});
        }
        return weekends;
}


/* Translate an Oxford term date into a calendar date */

/*
	returns the date for: a term and a week and a day of week, with 1..7 being sun-sat. (2..6 = mon-fri)
	e.g. you can get Thursday of week 0 Michaelmas term with: SELECT getDateForTermWeekDay(2012,'MT',0,5);
*/

Date.getDateForTermWeekDay=function(year, term ,weekInTerm ,dayOfWeek)
{
	var termStart;
	if(term!='MT' && term!='HT' && term !='TT')
	{
		throw "The term parameter must be one of: MT, HT or TT";
	}
	
	switch(term)
	{
		case 'MT':
		termStart=Date.michaelmas(year);
		break;
		case 'HT':
		termStart=Date.hilary(year);
		break;
		case 'TT':
		termStart=Date.trinity(year);
		break;
	}
	
	return Date.DATE_ADD(Date.DATE_ADD(termStart, (weekInTerm-1), "WEEK"), (dayOfWeek-1), "DAY");
};

/* returns the date for a term object. */
Date.getDateForTermObject=function(termObject)
{
	if(!termObject){return null;}
	
	if(termObject.year==null){throw "Missing year";}
	if(termObject.term==null){throw "Missing term";}
	if(termObject.weekInTerm==null){throw "Missing weekInTerm";}
	if(termObject.dayOfWeek==null){throw "Missing dayOfWeek";}
	return Date.getDateForTermWeekDay(termObject.year, termObject.term ,termObject.weekInTerm ,termObject.dayOfWeek);
};


/*
	returns an object representing a term given a date. Week starts from week '-1' onwards
	e.g. getTermWeekDayForDate(new Date(2012,9,4,0,0,0,0));
*/

Date.getTermObjectForDate=function(date_in)
{
	var Y;
    var MT;
    var HT;
    var TT;
    var term;
	var termName;
    var relative;
    var WEEK_DEC;
    var WEEK;
	
	Y=date_in.getFullYear();
    
	MT=Date.michaelmas(Y);
	HT=Date.hilary(Y);
	TT=Date.trinity(Y);
	
	 if(date_in.getTime() >= Date.DATE_SUB(MT,2,"WEEK").getTime())
    {
        term='MT';
		termName='Michaelmas';
        relative=MT;
    }
	else
	if(date_in.getTime() >= Date.DATE_SUB(TT,2,"WEEK").getTime())
    {
        term='TT';
		termName='Trinity';
        relative=TT;
     }
     else
	 if(date_in.getTime() >= Date.DATE_SUB(HT,2,"WEEK").getTime())
	 {
        term='HT';
		termName='Hilary';
        relative=HT;
     }
	 
	if(relative)
	{
    	WEEK=Math.floor((((Date.DATEDIFF(date_in,Date.DATE_SUB(relative,2,"WEEK")))-14)/7))+1;
	}
	else
	{
		WEEK="";
		termName="";
		term="";
	}
    
	var termObject=new OxfordTerm({
		year: Y,
		term: term,
		termName: termName,
		weekInTerm: WEEK,
		dayOfWeek: Date.DAYOFWEEK(date_in),
		date: date_in
	});
	
    return termObject;
};

Date.toTermString=function(date,format)
{
	if(!format){throw "Missing term date format";}
	
	var termObject=Date.getTermObjectForDate(date);
	
	var pad=function(str)
	{
		str=''+str;
		while(str.length<2){str='0'+str;}
		return str;
	};
	
	var dayOfWeekNames=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var monthOfYearNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
	
	return format
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
		.split('%t').join(termObject.term.substring(0,1))
		.split('%dd').join(pad(date.getDate()))
		.split('%d').join(date.getDate())
		.split('%o').join("thstndrdthththththththththththththththththstndrdthththththththst".substring(((date.getDate() % 32)*2),((date.getDate() % 32)*2)+2))
		;
};

/* Create an  OxfordTerm object */

function OxfordTerm(object)
{
	if(object)
	{
		for(attr in object)
		{
			this[attr]=object[attr];
		}
	}
}


/* Bind functions to OxfordTerm instances */

(
function()
{

	function addPrototype(function_name, func)
	{
		if( typeof OxfordTerm.prototype[function_name] == 'undefined' ){OxfordTerm.prototype[function_name] = func;}
	};
	
	function addPrototypeAttribute(attribute_name, attribute_value)
	{
		if( typeof OxfordTerm.prototype[attribute_name] == 'undefined' ){OxfordTerm.prototype[attribute_name] = attribute_value;}
	};
	
	addPrototype("getDate",function(){return Date.getDateForTermObject(this);});
	addPrototypeAttribute("termFormat","%EEEE, Week %tw of %tttt Term %yyyy");
	OxfordTerm.prototype.toString=function(format){return Date.toTermString(this.getDate(),format || this.termFormat)};
}
)();


/* Bind these functions to Date instances */

(
function()
{

	
	function addPrototype(function_name, func)
	{
		if( typeof Date.prototype[function_name] == 'undefined' ){Date.prototype[function_name] = func;}
	};
	
	function addPrototypeAttribute(attribute_name, attribute_value)
	{
		if( typeof Date.prototype[attribute_name] == 'undefined' ){Date.prototype[attribute_name] = attribute_value;}
	};
	
	addPrototype("easter",function(){return Date.easter(this.getFullYear());});
	
	addPrototype("DATE_ADD",function(interval,unit){return Date.DATE_ADD(this,interval,unit);});
	addPrototype("DATE_SUB",function(interval,unit){return Date.DATE_SUB(this,interval,unit);});
	addPrototype("DATEDIFF",function(date){return Date.DATEDIFF(this,date);});
	addPrototype("DAYOFWEEK",function(date){return Date.DAYOFWEEK(this);});
	
	addPrototype("michaelmas",function(){return Date.michaelmas(this.getFullYear());});
	addPrototype("hilary",function(){return Date.hilary(this.getFullYear());});
	addPrototype("trinity",function(){return Date.trinity(this.getFullYear());});
	addPrototype("getTerm",function(){return Date.getTermObjectForDate(this);});
	addPrototypeAttribute("termFormat","%EEEE, Week %tw of %tttt Term %yyyy");
	addPrototype("toTermString",function(format){return Date.toTermString(this,format || this.termFormat)});
	addPrototype("getHolidays",function(){return Date.getHolidays(this.getFullYear());});
	addPrototype("getWeekends",function(){return Date.getWeekends(this.getFullYear());});
}
)();
