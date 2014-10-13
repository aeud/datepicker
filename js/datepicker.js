var VF_datepicker = {
	drag: 0,
	currentYear: 0,
	currentMonth: 0,
	callback: null,
	from: null,
	to: null,
	options: {},
	datepicker: function(ny, nm, options, callback){
		prev = null;
		VF_datepicker.options = options;
		var html = '';
		html += '<div class="datepicker-inside">';
		html += '<div class="dates">';
		html += '<span class="date date-from"><span class="from"></span><i class="fa fa-times"></i></span>';
		html += '<span class="date date-to"><span class="to"></span><i class="fa fa-times"></i></span>';
		html += '</div>';
		html += '<div class="close">';
		html += '<a href="#"><span class="glyphicon glyphicon-remove"></span></a>';
		html += '</div>';
		html += '<div class="pre-table">';
		html += '<div class="go go-left">';
		html += '<a href="#"><i class="fa fa-chevron-left"></i></a>';
		html += '</div>';
		html += '<div class="go go-right">';
		html += '<a href="#"><i class="fa fa-chevron-right"></i></a>';
		html += '</div>';
		html += '<table class="table">';
		html += '<tr>';
		html += '<td><div class="datepicker-table" id="month1"></div></td>';
		html += '<td><div class="datepicker-table hidden-xs hidden-sm" id="month2"></div></td>';
		html += '</tr>';
		html += '</table>';
		html += '</div>';
		html += '<div class="helper">';
		html += '</div>';
		html += '</div>';
		$('#datepicker').html(html);
		VF_datepicker.displayMonths(ny, nm);
		VF_datepicker.controlArrows();
		if (callback) this.callback = callback;
		$('.show-datepicker').click(function(){
			$('.datepicker').addClass('active');
			return false;
		});
		if (options.relative == true) {
			$('.datepicker').css('position', 'relative');
		} else {
			$('.datepicker').css('position', 'absolute');
		}
		if (VF_datepicker.options.init) VF_datepicker.options.init();
	},
	displayMonths: function(currentYear, currentMonth){
		this.currentYear = currentYear;
		this.currentMonth = currentMonth;
		this.process(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1), '#datepicker #month1');
		this.process(new Date(currentYear, currentMonth + 1, 1), new Date(currentYear, currentMonth + 2, 1), '#datepicker #month2');
		$('#datepicker .day').click(VF_datepicker.selection);
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
			VF_datepicker.helper('Select your departure date');
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
				html += (VF_datepicker.from && VF_datepicker.from == month[i][j].date ? ' drag-from' : '');
				html += (VF_datepicker.from && VF_datepicker.to == month[i][j].date ? ' drag-to' : '');
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
			$('.drag').removeClass('drag');
			$('.drag-from').removeClass('drag-from');
			VF_datepicker.from = date;
			$(this).addClass('drag-from');
			VF_datepicker.valFrom(date.split('-').reverse().join('/'));
			$('.drag-to').removeClass('drag-to');
			VF_datepicker.removeTo();
			if (VF_datepicker.options.from_chosen) VF_datepicker.options.from_chosen(VF_datepicker.from);
		} else {
			VF_datepicker.to = date;
			var fromArray = VF_datepicker.from.split('-');
			var fromDate = new Date(parseInt(fromArray[0]), parseInt(fromArray[1]) - 1, parseInt(fromArray[2]));
			var toArray = VF_datepicker.to.split('-');
			var toDate = new Date(parseInt(toArray[0]), parseInt(toArray[1]) - 1, parseInt(toArray[2]));
			if (toDate < fromDate) {
				var tmp = VF_datepicker.from;
				VF_datepicker.from = VF_datepicker.to;
				VF_datepicker.to = tmp;
			}
			VF_datepicker.valFrom(VF_datepicker.from.split('-').reverse().join('/'));
			VF_datepicker.valTo(VF_datepicker.to.split('-').reverse().join('/'));
			$('.drag-to').removeClass('drag-to');
			$(this).addClass('drag-to');
			if (VF_datepicker.options.to_chosen) VF_datepicker.options.to_chosen(VF_datepicker.from, VF_datepicker.to);
			if (VF_datepicker.callback) VF_datepicker.callback(VF_datepicker.from, VF_datepicker.to);
		}
		VF_datepicker.drag = !drag;
		return false;
	},
	controlArrows: function(){
		$('#datepicker .go.go-left a').click(function(){
			console.log( VF_datepicker.currentMonth - 1)
			VF_datepicker.displayMonths(VF_datepicker.currentYear, VF_datepicker.currentMonth - 1);
			return false;
		});
		$('#datepicker .go.go-right a').click(function(){
			console.log( VF_datepicker.currentMonth + 1)
			VF_datepicker.displayMonths(VF_datepicker.currentYear, VF_datepicker.currentMonth + 1);
			return false;
		});
		$('#datepicker .close a').click(function(){
			$('#datepicker.active').removeClass('active');
			VF_datepicker.from = null;
			VF_datepicker.to = null;
			VF_datepicker.drag = 0;
			return false;
		});
		$('#datepicker .dates .date-to').click(function(){
			VF_datepicker.removeTo();
		});
		$('#datepicker .dates .date-from').click(function(){
			VF_datepicker.removeFrom();
		});
	},
	helper: function(text){
		var h = $('#datepicker .helper');
		h.slideUp(function(){
			h.html(text);
			h.slideDown();
		})
	},
	valFrom: function(date){
		var fv = $('#datepicker .dates .date-from .from');
		var f = $('#datepicker .dates .date-from');
		f.hide();
		if (date) {
			fv.html(date);
			f.show();
		}
		VF_datepicker.from = date;
	},
	valTo: function(date){
		var fv = $('#datepicker .dates .date-to .to');
		var f = $('#datepicker .dates .date-to');
		f.hide();
		if (date) {
			fv.html(date);
			f.show();
		}
		VF_datepicker.to = date;
	},
	removeTo: function(date){
		VF_datepicker.valTo(null);
		$('.drag-to').removeClass('drag-to');
		VF_datepicker.drag = 1;
		VF_datepicker.to = null;
		VF_datepicker.helper('');
	},
	removeFrom: function(date){
		VF_datepicker.valFrom(null);
		$('.drag-from').removeClass('drag-from');
		VF_datepicker.removeTo();
		VF_datepicker.drag = 0;
		VF_datepicker.from = null;
		VF_datepicker.helper('');
	},
	close: function(){
		$('#datepicker').css('display', 'none');
	},
	show: function(text){
		$('#datepicker').css('display', 'block');
		VF_datepicker.helper(text);
	},
}
