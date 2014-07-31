var datepicker = {
	drag: 0,
	currentYear: 0,
	currentMonth: 0,
	callback: null,
	from: null,
	to: null,
	options: {},
	datepicker: function(ny, nm, options, callback){
		datepicker.options = options;
		var html = '';
		html += '<div class="datepicker-inside">';
		html += '<div class="go go-left">';
		html += '<a href="#"><i class="fa fa-chevron-circle-left"></i></a>';
		html += '</div>';
		html += '<div class="go go-right">';
		html += '<a href="#"><i class="fa fa-chevron-circle-right"></i></a>';
		html += '</div>';
		html += '<div class="close">';
		html += '<a href="#"><span class="glyphicon glyphicon-remove"></span></a>';
		html += '</div>';
		html += '<table class="table">';
		html += '<tr>';
		html += '<td><div class="datepicker-table" id="month1"></div></td>';
		html += '<td><div class="datepicker-table hidden-xs" id="month2"></div></td>';
		html += '</tr>';
		html += '</table>';
		html += '</div>';
		$('#datepicker').html(html);
		datepicker.displayMonths(ny, nm);
		datepicker.controlArrows();
		if (callback) this.callback = callback;
		$('.show-datepicker').click(function(){
			$('.datepicker').addClass('active');
			return false;
		})
	},
	displayMonths: function(currentYear, currentMonth){
		this.currentYear = currentYear;
		this.currentMonth = currentMonth;
		this.process(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1), '#datepicker #month1')
		this.process(new Date(currentYear, currentMonth + 1, 1), new Date(currentYear, currentMonth + 2, 1), '#datepicker #month2')
		$('#datepicker .day').click(datepicker.selection)
	},
	process: function(from, to, id){
		var fromExtra = new Date(from.getFullYear(), from.getMonth(), 1);
		var toExtra = new Date(to.getFullYear(), to.getMonth(), 1);
		var month = [];
		var week = [];
		while (fromExtra.getDay() != 1) fromExtra.setDate(fromExtra.getDate() - 1)
		while (toExtra.getDay() != 0) toExtra.setDate(toExtra.getDate() + 1)
		while (fromExtra <= toExtra) {
			var d = new Date(fromExtra.getFullYear(), fromExtra.getMonth(), fromExtra.getDate());
			var dy = '' + d.getFullYear();
			var dm = '' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1);
			var dd = '' + (d.getDate() < 10 ? '0' : '') + d.getDate();
			week.push({
				'date': dy+'-'+dm+'-'+dd,
				'day': dd,
				'black': (d < from || d > to),
				'month': datepicker.options.monthNames[d.getMonth()]
			});
			if (fromExtra.getDay() == 0) {
				month.push(week);
				week = [];
			}
			fromExtra.setDate(fromExtra.getDate() + 1)
		}
		var html = '';
		html += '<table class="table month">';
		html += '<tr class="head-month">';
		html += '<th colspan="7">' + month[1][1].month + '</th>';
		html += '</tr>';
		html += '<tr class="head-days">';
		html += '<th>' + datepicker.options.dayNames[1].slice(0,2) + '</th>'
		html += '<th>' + datepicker.options.dayNames[2].slice(0,2) + '</th>'
		html += '<th>' + datepicker.options.dayNames[3].slice(0,2) + '</th>'
		html += '<th>' + datepicker.options.dayNames[4].slice(0,2) + '</th>'
		html += '<th>' + datepicker.options.dayNames[5].slice(0,2) + '</th>'
		html += '<th>' + datepicker.options.dayNames[6].slice(0,2) + '</th>'
		html += '<th>' + datepicker.options.dayNames[0].slice(0,2) + '</th>'
		html += '</tr>';
		for (var i = 0; i < month.length; i++) {
			html += '<tr class="days">';
			for (var j = 0; j < month[i].length; j++) {
				html += '<td data-date="' + month[i][j].date + '" class="day ' + (month[i][j].black ? 'black' : 'no-black') + ' ' + (datepicker.from && datepicker.from == month[i][j].date ? 'drag' : '') + '">';
				html += month[i][j].day,
				html += '</td>'
			}
			html += '</tr>';
		}
		html += '</table>';
		$(id).html(html);
	},
	selection: function(){
		var drag = datepicker.drag;
		var date = $(this).data('date');
		if (!drag) {
			$('.drag').removeClass('drag')
			datepicker.from = date;
		} else {
			datepicker.to = date;
			var tmpFrom = new Date(datepicker.from);
			var tmpTo = new Date(datepicker.to);
			if (tmpFrom < tmpTo) {
				$('#toInput').val(datepicker.to)
				$('#fromInput').val(datepicker.from)
			} else {
				$('#toInput').val(datepicker.from)
				$('#fromInput').val(datepicker.to)
			}
			$('#datepicker.active').removeClass('active')
			if (datepicker.callback) datepicker.callback(datepicker.from, datepicker.to);
		}
		$(this).addClass('drag')
		datepicker.drag = !drag;
		return false;
	},
	controlArrows: function(){
		$('#datepicker .go.go-left a').click(function(){
			datepicker.displayMonths(datepicker.currentYear, datepicker.currentMonth - 1)
			return false;
		})
		$('#datepicker .go.go-right a').click(function(){
			datepicker.displayMonths(datepicker.currentYear, datepicker.currentMonth + 1)
			return false;
		})
		$('#datepicker .close a').click(function(){
			$('#datepicker.active').removeClass('active')
			datepicker.from = null;
			datepicker.to = null;
			datepicker.drag = 0;
			return false;
		})
	}
}
