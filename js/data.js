var Jabber = {
	data: [
		{ date: '04/22',way: { all: 1000, video: 220}, role: { host: 2,	    attendee: 5		}},
		{ date: '04/24',way: { all: 1010, video: 240}, role: { host: 6,	    attendee: 15	}},
		{ date: '04/26',way: { all: 1020, video: 280}, role: { host: 12,	attendee: 25	}},
		{ date: '04/28',way: { all: 1030, video: 300}, role: { host: 15,	attendee: 24	}},
		{ date: '04/30',way: { all: 1034, video: 320}, role: { host: 16,	attendee: 32	}},
		{ date: '05/02',way: { all: 1040, video: 360}, role: { host: 22,	attendee: 36	}},
		{ date: '05/04',way: { all: 1050, video: 400}, role: { host: 18,	attendee: 40	}},
		{ date: '05/06',way: { all: 1050, video: 420}, role: { host: 24,	attendee: 42	}},
		{ date: '05/08',way: { all: 1055, video: 450}, role: { host: 28,	attendee: 45	}},
		{ date: '05/10',way: { all: 1060, video: 480}, role: { host: 26,	attendee: 52	}},
		{ date: '05/12',way: { all: 1080, video: 520}, role: { host: 32,	attendee: 65	}},
		{ date: '05/14',way: { all: 1082, video: 550}, role: { host: 35,	attendee: 70	}},
		{ date: '05/16',way: { all: 1090, video: 590}, role: { host: 32,	attendee: 80	}},
		{ date: '05/18',way: { all: 1090, video: 620}, role: { host: 28,	attendee: 88	}},
		{ date: '05/20',way: { all: 1095, video: 640}, role: { host: 38,	attendee: 95	}},
		{ date: '05/22',way: { all: 1105, video: 700}, role: { host: 40,	attendee: 105	}}
		],
	usage: {
		Product: [  
			{ name: 'Webex Meeitngs',value: 50},
			{ name: 'Cisco Jabber',	 value: 39},
			{ name: 'Cisco Devices', value: 6},
			{ name: 'Webex Teams',	 value: 5}
			],
		Activity: [
			{ name: 'Messaging',value: 65 },
			{ name: 'Video',	value: 16 },
			{ name: 'Sharing',	value: 25}
			],
		Group: [
			{ name:'Enginnering', value: 11	},
			{ name:'Finanace',    value: 24	},
			{ name:'Sales',		  value: 65	}
			],
		Location: [
			{ name: 'iOS', 	   value: 20 },
			{ name: 'Win',	   value: 36 },
			{ name: 'Android', value: 24 },
			{ name: 'Mac',     value: 20 }
			]
	}
};
var Webex = {
	data: [
		{ date: '04/22',way: { all: 1100, video: 320}, role: { host: 12,	attendee: 15	}},
		{ date: '04/24',way: { all: 1210, video: 340}, role: { host: 16,    attendee: 35	}},
		{ date: '04/26',way: { all: 1220, video: 480}, role: { host: 32,	attendee: 35	}},
		{ date: '04/28',way: { all: 1330, video: 400}, role: { host: 35,	attendee: 44	}},
		{ date: '04/30',way: { all: 1334, video: 420}, role: { host: 36,	attendee: 42	}},
		{ date: '05/02',way: { all: 1340, video: 460}, role: { host: 32,	attendee: 46	}},
		{ date: '05/04',way: { all: 1350, video: 500}, role: { host: 28,	attendee: 40	}},
		{ date: '05/06',way: { all: 1350, video: 520}, role: { host: 44,	attendee: 52	}},
		{ date: '05/08',way: { all: 1355, video: 550}, role: { host: 48,	attendee: 65	}},
		{ date: '05/10',way: { all: 1360, video: 580}, role: { host: 26,	attendee: 62	}},
		{ date: '05/12',way: { all: 1380, video: 720}, role: { host: 32,	attendee: 65	}},
		{ date: '05/14',way: { all: 1382, video: 650}, role: { host: 55,	attendee: 80	}},
		{ date: '05/16',way: { all: 1390, video: 690}, role: { host: 52,	attendee: 82	}},
		{ date: '05/18',way: { all: 1390, video: 620}, role: { host: 38,	attendee: 85	}},
		{ date: '05/20',way: { all: 1395, video: 740}, role: { host: 38,	attendee: 95	}},
		{ date: '05/22',way: { all: 1400, video: 800}, role: { host: 60,	attendee: 105	}}
		],
	usage: {
		Product: [  
			{ name: 'Webex Meeitngs',value: 50},
			{ name: 'Cisco Jabber',	 value: 30},
			{ name: 'Cisco Devices', value: 10},
			{ name: 'Webex Teams',	 value: 10}
			],
		Activity: [
			{ name: 'Messaging',value: 45 },
			{ name: 'Video',	value: 16 },
			{ name: 'Sharing',	value: 15}
			],
		Group: [
			{ name:'Enginnering', value: 20	},
			{ name:'Finanace',    value: 35	},
			{ name:'Sales',		  value: 45	}
			],
		Location: [
			{ name: 'iOS', 	   value: 10 },
			{ name: 'Win',	   value: 46 },
			{ name: 'Android', value: 24 },
			{ name: 'Mac',     value: 20 }
			]
	}
};

var profit2010to2018 = [{ year: 2000, profit: 10},
  { year: 2001, profit: 12},
  { year: 2002, profit: 15},
  { year: 2003, profit: 20},
  { year: 2004, profit: 30},
  { year: 2005, profit: 32},
  { year: 2006, profit: 40},
  { year: 2007, profit: 60},
  { year: 2008, profit: 80},
  { year: 2009, profit: 100},
  { year: 2010, profit: 120},
  { year: 2011, profit: 102},
  { year: 2012, profit: 130},
  { year: 2013, profit: 130},
  { year: 2014, profit: 150},
  { year: 2015, profit: 160},
  { year: 2016, profit: 200},
  { year: 2017, profit: 180},
  { year: 2018, profit: 210}];

var profit2010to2018Lv2 = [{ year: 2000, profit: 10},
  { year: 2001, profit: 32},
  { year: 2002, profit: 25},
  { year: 2003, profit: 30},
  { year: 2004, profit: 60},
  { year: 2005, profit: 12},
  { year: 2006, profit: 30},
  { year: 2007, profit: 20},
  { year: 2008, profit: 80},
  { year: 2009, profit: 10},
  { year: 2010, profit: 220},
  { year: 2011, profit: 202},
  { year: 2012, profit: 130},
  { year: 2013, profit: 30},
  { year: 2014, profit: 50},
  { year: 2015, profit: 160},
  { year: 2016, profit: 100},
  { year: 2017, profit: 180},
  { year: 2018, profit: 210}];


window.MDATA = {
	Jabber: Jabber,
	Webex: Webex,
	profit2010to2018: profit2010to2018,
	profit2010to2018Lv2: profit2010to2018Lv2
}


