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
	 
    WEEK=Math.floor((((Date.DATEDIFF(date_in,Date.DATE_SUB(relative,2,"WEEK")))-14)/7))+1;
    
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
	
	return format
		.split('%yyyy').join(date.getFullYear())
		.split('%yy').join((date.getFullYear() + '').substring(2))
		.split('%dddd').join(dayOfWeekNames[termObject.dayOfWeek-1])
		.split('%ddd').join(dayOfWeekNames[termObject.dayOfWeek-1].substring(0,3))
		.split('%ddn').join(pad(termObject.dayOfWeek))
		.split('%dn').join(termObject.dayOfWeek)
		.split('%ww').join(pad(termObject.weekInTerm))
		.split('%w').join(termObject.weekInTerm)
		.split('%tttt').join(termObject.termName)
		.split('%tt').join(termObject.term)
		.split('%t').join(termObject.term.substring(0,1))
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
	addPrototypeAttribute("termFormat","%dddd, Week %w of %tttt term %yyyy");
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
	addPrototypeAttribute("termFormat","%dddd, Week %w of %tttt term %yyyy");
	addPrototype("toTermString",function(format){return Date.toTermString(this,format || this.termFormat)});

}
)();
