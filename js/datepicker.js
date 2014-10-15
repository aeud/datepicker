function VF_datepicker () {
	this.name = 'test',
	this.drag = 0,
	this.currentYear = 0,
	this.currentMonth = 0,
	this.start = null,
	this.end = null,
	this.options = {},
	this.startCtrl = null,
	this.endCtrl = null,
	this.startDisplay = null,
	this.endDisplay = null,
	this.startInput = null,
	this.endInput = null,
	this.startDP = null,
	this.endDP = null,
	this.startDisplayOriginal = null,
	this.endDisplayOriginal = null,
	this.datepicker = function(options){
		prev = null;
		this.options = options;
		this.startCtrl = this.options.startCtrl;
		this.endCtrl = this.options.endCtrl;
		this.startDisplay = this.options.startDisplay;
		this.endDisplay = this.options.endDisplay;
		this.startInput = this.options.startInput;
		this.endInput = this.options.endInput;
		this.startDisplayOriginal = this.startDisplay.html();
		this.endDisplayOriginal = this.endDisplay.html();
		this.startDP = this.options.startDP;
		this.endDP = this.options.endDP;
		
		this.name = this.options.name;
		
		this.startCtrl.addClass('dp-' + this.name);
		this.endCtrl.addClass('dp-' + this.name);
		this.startDisplay.addClass('dp-' + this.name);
		this.endDisplay.addClass('dp-' + this.name);
		this.startInput.addClass('dp-' + this.name);
		this.endInput.addClass('dp-' + this.name);
		this.startDP.addClass('dp-' + this.name);
		this.endDP.addClass('dp-' + this.name);
		
		this.start = this.options.start;
		this.end = this.options.end;
		
		this.chosen = this.options.chosen;
		
		console.log(this.name);
		
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
		html += '<a class="vf-clear" href="#">' + this.options.clearTxt + '</a>';
		html += '</div>';
		$('.vf-datepicker.dp-' + this.name).html(html);
		
		if (this.start) {
			var tmp = this.start.split('-');
			var ny = parseInt(tmp[0]);
			var nm = parseInt(tmp[1]) - 1;
		} else {
			var date = new Date();
			var ny = date.getFullYear();
			var nm = date.getMonth() + 1;
		}
		this.displayMonths(ny, nm);
		this.controlArrows();
		$('.vf-datepicker.dp-' + this.name).css('position', 'absolute');
		if (this.options.positions) {
			this.startDP.css(this.options.positions[0], '0');
			this.endDP.css(this.options.positions[1], '0');
		}
		
		this.setVariables();
	},
	this.displayMonths = function(currentYear, currentMonth){
		this.currentYear = currentYear;
		this.currentMonth = currentMonth;
		this.process(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1), '.dp-' + this.name + ' .vf-month1');
		var dp = this;
		$('.vf-datepicker.dp-' + this.name + ' .day').click(function(){
			var drag = dp.drag;
			var date = $(this).data('date');
			if (!drag) {
				dp.setStart(date);
				dp.inverseDates();
				dp.setSelection();
				dp.setVariables();
				dp.hideStart();
				if (!dp.end) dp.showEnd();
				if (dp.options.fromChosen) {
					dp.options.fromChosen(dp.start, dp.end);
				}
			} else {
				dp.setEnd(date);
				dp.inverseDates();
				dp.setSelection();
				dp.setVariables();
				dp.hideEnd();
				if (dp.options.toChosen) {
					dp.options.toChosen(dp.start, dp.end);
				}
			}
			if (dp.chosen) dp.chosen(dp.start, dp.end);
			return false;
		});
	},
	this.process = function(from, to, id){
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
			var DPUnavailable = this.options.unavailable ? this.options.unavailable : [];
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
				'black': (d < from || d >= to),
				'month': this.options.monthNames[d.getMonth()],
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
		html += '<th>' + this.options.dayNames[1].slice(0,2) + '</th>';
		html += '<th>' + this.options.dayNames[2].slice(0,2) + '</th>';
		html += '<th>' + this.options.dayNames[3].slice(0,2) + '</th>';
		html += '<th>' + this.options.dayNames[4].slice(0,2) + '</th>';
		html += '<th>' + this.options.dayNames[5].slice(0,2) + '</th>';
		html += '<th>' + this.options.dayNames[6].slice(0,2) + '</th>';
		html += '<th>' + this.options.dayNames[0].slice(0,2) + '</th>';
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
				html += (this.start && this.start == month[i][j].date ? ' drag-from' : '');
				html += (this.end && this.end == month[i][j].date ? ' drag-to' : '');
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
	this.inverseDates = function(){
		if (this.start && this.end) {
			var fromArray = this.start.split('-');
			var fromDate = new Date(parseInt(fromArray[0]), parseInt(fromArray[1]) - 1, parseInt(fromArray[2]));
			var toArray = this.end.split('-');
			var toDate = new Date(parseInt(toArray[0]), parseInt(toArray[1]) - 1, parseInt(toArray[2]));
			if (toDate < fromDate) {
				var tmp = this.start;
				this.setStart(this.end);
				this.setEnd(tmp);
			}
		}
	},
	this.controlArrows = function(){
		var dp = this;
		this.startCtrl.click(function(){
			dp.showStart();
			return false;
		});
		this.endCtrl.click(function(){
			dp.showEnd();
			return false;
		});
		$('.dp-' + this.name +  ' .go.go-left a').click(function(){
			dp.displayMonths(dp.currentYear, dp.currentMonth - 1);
			return false;
		});
		$('.dp-' + this.name + ' .go.go-right a').click(function(){
			dp.displayMonths(dp.currentYear, dp.currentMonth + 1);
			return false;
		});
		$('.dp-' + this.name + ' .close a').click(function(){
			$('.dp-' + this.name + '.active').removeClass('active');
			dp.start = null;
			dp.end = null;
			dp.drag = 0;
			return false;
		});
		$('.dp-' + this.name + ' .dates .date-to').click(function(){
			dp.removeTo();
		});
		$('.dp-' + this.name + ' .dates .date-from').click(function(){
			dp.removeFrom();
		});
		$('.dp-' + this.name + ' .vf-clear').click(function(){
			dp.clear();
			return false;
		});
	},
	this.setStart = function(start) {
		this.start = start;
	},
	this.setEnd = function(end) {
		this.end  = end;
	},
	this.setStartVariables = function() {
		var start = this.start;
		this.startInput.val(start);
		if (start) {
			this.startDisplay.html(start.split('-').reverse().join('/'));
		} else {
			this.startDisplay.html(this.startDisplayOriginal);
		}
	},
	this.setEndVariables = function() {
		var end = this.end;
		this.endInput.val(end);
		if (end) {
			this.endDisplay.html(end.split('-').reverse().join('/'));
		} else {
			this.endDisplay.html(this.endDisplayOriginal);
		}
	},
	this.setSelection = function() {
		if (this.start) {
			$('.dp-' + this.name + ' .drag-from').removeClass('drag-from');
			$('.dp-' + this.name + ' .day-' + this.start).addClass('drag-from');
		}
		if (this.end) {
			$('.dp-' + this.name + ' .drag-to').removeClass('drag-to');
			$('.dp-' + this.name + ' .day-' + this.end).addClass('drag-to');
		}
	},
	this.setVariables = function() {
		this.setStartVariables();
		this.setEndVariables();
	},
	this.clear = function(){
		this.setStart(null);
		this.setEnd(null);
		this.setVariables();
		this.closeAll();
		$('.drag-from').removeClass('drag-from');
		$('.drag-to').removeClass('drag-to');
	},
	this.closeAll = function(){
		$('.vf-datepicker').fadeOut();
	},
	this.showAll = function(text){
		$('.vf-datepicker').fadeIn();
	},
	this.showStart = function(){
		if (this.options.displayFrom) {
			this.options.displayFrom(this.start, this.end);
		}
		if (this.start) {
			var tmp = this.start.split('-');
			this.displayMonths(parseInt(tmp[0]), parseInt(tmp[1]) - 1);
		}
		this.drag = 0;
		this.startDP.fadeIn();
		var dp = this;
		$(document).mouseup(function (e) {
		    var container = dp.startDP;
		    if (!container.is(e.target) && container.has(e.target).length === 0){
		        dp.hideStart();
				if (dp.options.hideFrom) {
					dp.options.hideFrom(dp.start, dp.end);
				}
				$(document).unbind('mouseup');
		    }
		});
	},
	this.showEnd = function(){
		if (this.options.displayTo) {
			this.options.displayTo(this.start, this.end);
		}
		if (!this.start) {
			this.showStart();
		} else {
			if (!this.end && this.start) {
				var tmpStart = this.start.split('-');
				var tmp = new Date(parseInt(tmpStart[0]), parseInt(tmpStart[1]) - 1, parseInt(tmpStart[2]) + 6);
				var m = tmp.getMonth() + 1;
				var d = tmp.getDate() + 1;
				m = ((m < 10) ? '0' : '') + m;
				d = ((d < 10) ? '0' : '') + d;
				this.setEnd([tmp.getFullYear(), m, d].join('-'));
				this.setVariables();
				this.setSelection();
			}
			if (this.end) {
				var tmp = this.end.split('-');
				this.displayMonths(parseInt(tmp[0]), parseInt(tmp[1]) - 1);
			}
			this.drag = 1;
			this.endDP.fadeIn();
			var dp = this;
			$(document).mouseup(function (e) {
			    var container = dp.endDP;
			    if (!container.is(e.target) && container.has(e.target).length === 0){
			        dp.hideEnd();
					if (dp.options.hideTo) {
						dp.options.hideTo(dp.start, dp.end);
					}
					$(document).unbind('mouseup');
			    }
			});
		}
	},
	this.hideStart = function(){
		this.startDP.fadeOut();
	},
	this.hideEnd = function(){
		this.endDP.fadeOut();
	}
}
