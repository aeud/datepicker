var VF_datepicker = {
	drag: 0,
	currentYear: 0,
	currentMonth: 0,
	start: null,
	end: null,
	options: {},
	startCtrl: null,
	endCtrl: null,
	startDisplay: null,
	endDisplay: null,
	startInput: null,
	endInput: null,
	startDP: null,
	endDP: null,
	startDisplayOriginal: null,
	endDisplayOriginal: null,
	datepicker: function(ny, nm, options){
		prev = null;
		VF_datepicker.options = options;
		VF_datepicker.startCtrl = VF_datepicker.options.startCtrl;
		VF_datepicker.endCtrl = VF_datepicker.options.endCtrl;
		VF_datepicker.startDisplay = VF_datepicker.options.startDisplay;
		VF_datepicker.endDisplay = VF_datepicker.options.endDisplay;
		VF_datepicker.startInput = VF_datepicker.options.startInput;
		VF_datepicker.endInput = VF_datepicker.options.endInput;
		VF_datepicker.startDisplayOriginal = VF_datepicker.startDisplay.html();
		VF_datepicker.endDisplayOriginal = VF_datepicker.endDisplay.html();
		VF_datepicker.startDP = VF_datepicker.options.startDP;
		VF_datepicker.endDP = VF_datepicker.options.endDP;
		
		var html = '';
		html += '<div class="datepicker-inside">';
		html += '<div class="pre-table">';
		html += '<div class="go go-left">';
		html += '<a href="#"><i class="fa fa-angle-left"></i></a>';
		html += '</div>';
		html += '<div class="go go-right">';
		html += '<a href="#"><i class="fa fa-angle-right"></i></a>';
		html += '</div>';
		html += '<table class="table">';
		html += '<tr>';
		html += '<td><div class="datepicker-table vf-month1"></div></td>';
		html += '</tr>';
		html += '</table>';
		html += '</div>';
		html += '<a class="vf-clear" href="#">' + VF_datepicker.options.clearTxt + '</a>';
		html += '</div>';
		$('.vf-datepicker').html(html);
		VF_datepicker.displayMonths(ny, nm);
		VF_datepicker.controlArrows();
		$('.show-datepicker').click(function(){
			$('.vf-datepicker').addClass('active');
			return false;
		});
		if (options.relative == true) {
			$('.vf-datepicker').css('position', 'relative');
		} else {
			$('.vf-datepicker').css('position', 'absolute');
		}
		if (VF_datepicker.options.init) VF_datepicker.options.init();
	},
	displayMonths: function(currentYear, currentMonth){
		this.currentYear = currentYear;
		this.currentMonth = currentMonth;
		this.process(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1), '.vf-datepicker .vf-month1');
		$('.vf-datepicker .day').click(VF_datepicker.selection);
	},
	process: function(from, to, id){
		var fromExtra = new Date(from.getFullYear(), from.getMonth(), 1);
		var toExtra = new Date(to.getFullYear(), to.getMonth(), 1);
		var month = [];
		var week = [];
		prev = prev || null;
		while (fromExtra.getDay() != 1) fromExtra.setDate(fromExtra.getDate() - 1);
		while (toExtra.getDay() != 0) toExtra.setDate(toExtra.getDate() + 1);
		while (fromExtra <= toExtra) {
			var d = new Date(fromExtra.getFullYear(), fromExtra.getMonth(), fromExtra.getDate());
			var dy = '' + d.getFullYear();
			var dm = '' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1);
			var dd = '' + (d.getDate() < 10 ? '0' : '') + d.getDate();
			var DPclass = '';
			var DPUnavailable = VF_datepicker.options.unavailable ? VF_datepicker.options.unavailable : [];
			if (Array.prototype.indexOf) {
				if (DPUnavailable.indexOf(dy + '-' + dm + '-' + dd) !== -1) {
					if (prev) {
						DPclass = 'request-pm';
					} else {
						DPclass = 'request-full';
					}
					prev = 0;
				} else {
					if (!prev) {
						DPclass = 'request-am';
					}
					prev = 1;
				}
			}
			week.push({
				'date': dy+'-'+dm+'-'+dd,
				'year': dy,
				'day': dd,
				'black': (d < from || d > to),
				'month': VF_datepicker.options.monthNames[d.getMonth()],
				'DPclass': DPclass
			});
			if (fromExtra.getDay() == 0) {
				month.push(week);
				week = [];
			}
			fromExtra.setDate(fromExtra.getDate() + 1);
		}
		var html = '';
		html += '<table class="table month">';
		html += '<tr class="head-month">';
		html += '<th colspan="7">' + month[1][1].month + ' ' + month[1][1].year + '</th>';
		html += '</tr>';
		html += '<tr class="head-days">';
		html += '<th>' + VF_datepicker.options.dayNames[1].slice(0,2) + '</th>';
		html += '<th>' + VF_datepicker.options.dayNames[2].slice(0,2) + '</th>';
		html += '<th>' + VF_datepicker.options.dayNames[3].slice(0,2) + '</th>';
		html += '<th>' + VF_datepicker.options.dayNames[4].slice(0,2) + '</th>';
		html += '<th>' + VF_datepicker.options.dayNames[5].slice(0,2) + '</th>';
		html += '<th>' + VF_datepicker.options.dayNames[6].slice(0,2) + '</th>';
		html += '<th>' + VF_datepicker.options.dayNames[0].slice(0,2) + '</th>';
		html += '</tr>';
		for (var i = 0; i < month.length; i++) {
			html += '<tr class="week">';
			for (var j = 0; j < month[i].length; j++) {
				html += '<td>';
				html += '<div data-date="';
				html += month[i][j].date;
				html += '" class="day ';
				html += (month[i][j].black ? 'black' : 'no-black');
				html += ' ';
				html += month[i][j].DPclass;
				html += ' day-' + month[i][j].date;
				html += (VF_datepicker.start && VF_datepicker.start == month[i][j].date ? ' drag-from' : '');
				html += (VF_datepicker.end && VF_datepicker.end == month[i][j].date ? ' drag-to' : '');
				html += '">';
				html += '<div class="value">';
				html += month[i][j].day;
				html += '</div>';
				html += '</div>';
				html += '</td>';
			}
			html += '</tr>';
		}
		html += '</table>';
		$(id).html(html);
	},
	selection: function(){
		var drag = VF_datepicker.drag;
		var date = $(this).data('date');
		if (!drag) {
			VF_datepicker.setStart(date);
			VF_datepicker.inverseDates();
			VF_datepicker.setSelection();
			VF_datepicker.setVariables();
			VF_datepicker.hideStart();
			if (!VF_datepicker.end) VF_datepicker.showEnd();
		} else {
			VF_datepicker.setEnd(date);
			VF_datepicker.inverseDates();
			VF_datepicker.setSelection();
			VF_datepicker.setVariables();
			VF_datepicker.hideEnd();
		}
		return false;
	},
	inverseDates: function(){
		if (VF_datepicker.start && VF_datepicker.end) {
			var fromArray = VF_datepicker.start.split('-');
			var fromDate = new Date(parseInt(fromArray[0]), parseInt(fromArray[1]) - 1, parseInt(fromArray[2]));
			var toArray = VF_datepicker.end.split('-');
			var toDate = new Date(parseInt(toArray[0]), parseInt(toArray[1]) - 1, parseInt(toArray[2]));
			if (toDate < fromDate) {
				var tmp = VF_datepicker.start;
				VF_datepicker.setStart(VF_datepicker.end);
				VF_datepicker.setEnd(tmp);
			}
		}
	},
	controlArrows: function(){
		VF_datepicker.startCtrl.click(function(){
			VF_datepicker.showStart();
			return false;
		});
		VF_datepicker.endCtrl.click(function(){
			VF_datepicker.showEnd();
			return false;
		});
		$('.vf-datepicker .go.go-left a').click(function(){
			VF_datepicker.displayMonths(VF_datepicker.currentYear, VF_datepicker.currentMonth - 1);
			return false;
		});
		$('.vf-datepicker .go.go-right a').click(function(){
			VF_datepicker.displayMonths(VF_datepicker.currentYear, VF_datepicker.currentMonth + 1);
			return false;
		});
		$('.vf-datepicker .close a').click(function(){
			$('.vf-datepicker.active').removeClass('active');
			VF_datepicker.start = null;
			VF_datepicker.end = null;
			VF_datepicker.drag = 0;
			return false;
		});
		$('.vf-datepicker .dates .date-to').click(function(){
			VF_datepicker.removeTo();
		});
		$('.vf-datepicker .dates .date-from').click(function(){
			VF_datepicker.removeFrom();
		});
		$('.vf-datepicker .vf-clear').click(function(){
			VF_datepicker.clear();
			return false;
		});
	},
	setStart: function(start) {
		VF_datepicker.start  = start;
	},
	setEnd: function(end) {
		VF_datepicker.end  = end;
	},
	setStartVariables: function() {
		var start = VF_datepicker.start;
		VF_datepicker.startInput.val(start);
		if (start) {
			VF_datepicker.startDisplay.html(start.split('-').reverse().join('/'));
		} else {
			VF_datepicker.startDisplay.html(VF_datepicker.startDisplayOriginal);
		}
	},
	setEndVariables: function() {
		var end = VF_datepicker.end;
		VF_datepicker.endInput.val(end);
		if (end) {
			VF_datepicker.endDisplay.html(end.split('-').reverse().join('/'));
		} else {
			VF_datepicker.endDisplay.html(VF_datepicker.endDisplayOriginal);
		}
	},
	setSelection: function() {
		if (VF_datepicker.start) {
			$('.drag-from').removeClass('drag-from');
			$('.day-' + VF_datepicker.start).addClass('drag-from');
		}
		if (VF_datepicker.end) {
			$('.drag-to').removeClass('drag-to');
			$('.day-' + VF_datepicker.end).addClass('drag-to');
		}
	},
	setVariables: function() {
		VF_datepicker.setStartVariables();
		VF_datepicker.setEndVariables();
	},
	clear: function(){
		VF_datepicker.setStart(null);
		VF_datepicker.setEnd(null);
		VF_datepicker.setVariables();
		VF_datepicker.closeAll();
		$('.drag-from').removeClass('drag-from');
		$('.drag-to').removeClass('drag-to');
	},
	closeAll: function(){
		$('.vf-datepicker').fadeOut();
	},
	showAll: function(text){
		$('.vf-datepicker').fadeIn();
	},
	showStart: function(){
		if (VF_datepicker.start) {
			var tmp = VF_datepicker.start.split('-');
			VF_datepicker.displayMonths(parseInt(tmp[0]), parseInt(tmp[1]) - 1);
		}
		VF_datepicker.drag = 0;
		VF_datepicker.startDP.fadeIn();
		$(document).mouseup(function (e) {
		    var container = VF_datepicker.startDP;
		    if (!container.is(e.target) && container.has(e.target).length === 0){
		        VF_datepicker.hideStart();
		    }
		});
	},
	showEnd: function(){
		if (!VF_datepicker.end && VF_datepicker.start) {
			var tmpStart = VF_datepicker.start.split('-');
			var tmp = new Date(parseInt(tmpStart[0]), parseInt(tmpStart[1]) - 1, parseInt(tmpStart[2]) + 6);
			var m = tmp.getMonth() + 1;
			var d = tmp.getDate() + 1;
			m = ((m < 10) ? '0' : '') + m;
			d = ((d < 10) ? '0' : '') + d;
			VF_datepicker.setEnd([tmp.getFullYear(), m, d].join('-'));
			VF_datepicker.setVariables();
			VF_datepicker.setSelection();
		}
		if (VF_datepicker.end) {
			var tmp = VF_datepicker.end.split('-');
			VF_datepicker.displayMonths(parseInt(tmp[0]), parseInt(tmp[1]) - 1);
		}
		VF_datepicker.drag = 1;
		VF_datepicker.endDP.fadeIn();
		$(document).mouseup(function (e) {
		    var container = VF_datepicker.endDP;
		    if (!container.is(e.target) && container.has(e.target).length === 0){
		        VF_datepicker.hideEnd();
		    }
		});
	},
	hideStart: function(){
		VF_datepicker.startDP.fadeOut();
	},
	hideEnd: function(){
		VF_datepicker.endDP.fadeOut();
	},
}
