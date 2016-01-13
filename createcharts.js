function compareObj(dataset, canvasID, valueformat, labelSize) {
	this.data = dataset,
	this.drawCanvas = document.getElementById(canvasID),
	this.drawContext = this.drawCanvas.getContext("2d"),
	this.getLabelSize = function(){
		// automatically inserts a font or scales a font down that is set too large for the canvas
		var label="";
		if (labelSize=="") { label= "14px" } else { label=labelSize; }
		if (parseInt(labelSize)*this.data.length*3 > this.drawCanvas.height) {
			label = parseInt(this.drawCanvas.height/(this.data.length*3));
		}
		return label;
	},
	this.currentType = "",
	this.valueFormat = valueformat,
	this.greatestValue = function() {
		var grtVal=0;
		for (var i=0;i<this.data.length;i++) {
			if (this.data[i].value>grtVal) {
				grtVal=this.data[i];	
			}
		}
		return grtVal;
	},
	this.leastValue = function() {
		var lstVal=this.data[0];
		for (var i=0;i<this.data.length;i++) {
			if (this.data[i].value<lstVal) {
				lstVal=this.data[i];	
			}
		}
		return lstVal;
	},
	this.updateRecordByIndex = function(idx,nval)  {
		this.data[idx].value = nval;
		this.resetChart();
	},
	this.updateRecordByLabel = function(label,nval) {
		
	},
	this.degreesToRadians = function(degrees) {
    	return (degrees * Math.PI)/180;
	},
	this.sumTo = function (a, i) { // helper function
		var sum = 0;
		for (var j = 0; j < i; j++) {
		  sum += a[j].value;
		}
		sum = sum;
		return sum;
	},
	this.sumTotal = ( this.sumTo(this.data,this.data.length )),
	this.resetChart = function() {
		this.drawContext.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
		this.sumTotal = this.sumTo(this.data,this.data.length );
		switch (this.currentType) {
			case "pie": this.pie(); break;
			case "bar": this.bar(); break;
			default: break;
		}
	},
	this.addDataSet = function(dataset) {
		this.data.push(dataset);	
		this.resetChart();
	}
	this.getRandomColor = function() {
		var letters = '0123456789ABCD'.split('');
		var color = '';
		for (var k = 0; k < 6; k++ ) {
			color += letters[Math.floor(Math.random() * 14)];
		}
		var notValid=false;
		// needs deep thinking involving the colors intersecting
		for (var i = 0; i < this.data.length; i++ ) {
			if (color==this.data[i].color) {
				notValid=true;	
			}
		}
		if (notValid) {
			color = this.getRandomColor();	
		}
		return color;
	},
	this.pie = function() {
		if ( this.currentType !="pie" ) { this.currentType = "pie"; this.resetChart(); }
		var pieboxwidth = this.drawCanvas.height;
		var labelSize = this.getLabelSize();
		// draw the format label
		this.drawContext.font = parseInt(Math.floor(labelSize*0.75))+'px Calibri';
		if (this.valueFormat!=null) { 
			var valueFormatLabel = "* IN "+this.valueFormat.toUpperCase(); 
			this.drawContext.fillStyle = "#000000";
			this.drawContext.fillText(valueFormatLabel,pieboxwidth+20+labelSize,labelSize);
		} 
        
		// draw each element 
		for (var i = 0; i < this.data.length; i++) {
			this.drawContext.save();
						
			// select or define the draw color
			if (this.data[i].color!=null) {
				var add_color = this.data[i].color;
			} else {
				var add_color = this.getRandomColor();
				this.data[i].color = add_color;
			}
			var draw_color='#'+add_color;
			
			// draw the piechart arc
			var centerX = Math.floor(pieboxwidth / 2);
			var centerY = Math.floor(this.drawCanvas.height / 2);
			radius = Math.floor(pieboxwidth / 2);
			var startingAngle = this.degreesToRadians((this.sumTo(this.data, i)/this.sumTotal)*360);
			var arcSize = this.degreesToRadians(this.data[i].value/this.sumTotal*360);
			var endingAngle = startingAngle + arcSize;
			this.drawContext.beginPath();
			this.drawContext.moveTo(centerX, centerY);
			this.drawContext.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
			this.drawContext.closePath();
			this.drawContext.fillStyle = draw_color;
			this.drawContext.fill();
			
			// draw the sample color box
			this.drawContext.fillStyle = draw_color;
			this.drawContext.fillRect(pieboxwidth+10,((i+1)*labelSize*2.2),labelSize*2,labelSize*2); // x/y/width/height
			
			// draw the data value label
			var drawLabel = "";
			var pctLabel = "( "+parseInt(100*(this.data[i].value/this.sumTotal))+"% )";
			if ((""+this.data[i].value).split(".").length==1) { drawLabel = this.data[i].value+ ".0 "+pctLabel; } else { drawLabel = this.data[i].value+" "+pctLabel; }	
			this.drawContext.fillStyle = draw_color;
            this.drawContext.font = labelSize+'px Calibri';
			this.drawContext.fillText(drawLabel,pieboxwidth+20+labelSize*2,(labelSize)+((i+1)*labelSize*2.2));	// text/x/y		
			
			// draw the description label
			if (this.data[i].label!=null) { 
				this.drawContext.fillText( this.data[i].label ,pieboxwidth+20+labelSize*2,(labelSize*2)+((i+1)*labelSize*2.2)); // text/x/y
			}
			this.drawContext.restore();		
            
		}
	},
	this.bar = function() {
		// horizontal bar
		if ( this.currentType !="bar" ) { this.currentType = "bar"; this.resetChart(); }
		var labelSize = this.getLabelSize();
		
		// define the chart start x position
		var chartstartx = this.drawCanvas.width/4;
		var chartstarty = labelSize*3;
		var chartWidth = this.drawCanvas.width - chartstartx - 20;
		
		// draw the format label
		this.drawContext.font = parseInt(Math.floor(labelSize*0.75))+'px Calibri';
		if (this.valueFormat!=null) { 
			this.drawContext.fillStyle = "#000000";
			var valueFormatLabel = "* IN "+this.valueFormat.toUpperCase(); 
			this.drawContext.fillText(valueFormatLabel,chartstartx,labelSize);
		}
		
		// chart item height with a 10px gutter at the top and bottom of the chart
		var chartItemHeight = (this.drawCanvas.height - ((chartstarty)+20)) / this.data.length;
		
		// get measurement label increment based on greatestValue
		// get pre decimal digit length
		var digitArray = (""+this.greatestValue().value).split(".");
		var digm = (digitArray[0].length-1);
		var digitMultiplier = Math.pow(10,digm);
		var chartValueWidthRatio = (Math.floor(this.greatestValue().value/digitMultiplier))*digitMultiplier+digitMultiplier;
		var digitLabelNum = chartValueWidthRatio/digitMultiplier;
		var incrementRatio = chartWidth /digitLabelNum;
		
		// draw scale lines and digits
		this.drawContext.textAlign="right";
		for (var v=0;v<=digitLabelNum;v++) {
			this.drawContext.textAlign="right";
			this.drawContext.fillStyle = "#000000";
			this.drawContext.fillText(""+(v*digitMultiplier),chartstartx+10+(v*incrementRatio),chartstarty-5);
			this.drawContext.beginPath();
			this.drawContext.moveTo(chartstartx+10+(v*incrementRatio),chartstarty);
			this.drawContext.lineTo(chartstartx+10+(v*incrementRatio),this.drawCanvas.height-1);
			this.drawContext.strokeStyle="#AAAAAA";
			this.drawContext.stroke();
		}
		
		// draw chart lines
		this.drawContext.beginPath();
		this.drawContext.moveTo(chartstartx,chartstarty);
		this.drawContext.lineTo(chartstartx,this.drawCanvas.height-1);
		this.drawContext.strokeStyle="#AAAAAA";
		this.drawContext.stroke();
		
		this.drawContext.beginPath();
		this.drawContext.moveTo(chartstartx,chartstarty);
		this.drawContext.lineTo(this.drawCanvas.width-10,chartstarty);
		this.drawContext.strokeStyle="#AAAAAA";
		this.drawContext.stroke();
		
		this.drawContext.beginPath();
		this.drawContext.moveTo(chartstartx,this.drawCanvas.height-1);
		this.drawContext.lineTo(this.drawCanvas.width-10,this.drawCanvas.height-1);
		this.drawContext.strokeStyle="#AAAAAA";
		this.drawContext.stroke();
		
		// draw each element 
		for (var i=0;i<this.data.length;i++) {
			
			this.drawContext.save();
						
			// select or define the draw color
			if (this.data[i].color!=null) {
				var add_color = this.data[i].color;
			} else {
				var add_color = this.getRandomColor();
				this.data[i].color = add_color;
			}
			var draw_color='#'+add_color;
			
			// draw the labels
			if (this.data[i].label!=null) { 
				this.drawContext.fillStyle = draw_color;
				this.drawContext.textAlign="right";
				this.drawContext.font = labelSize+'px Calibri';
				this.drawContext.fillText( this.data[i].label ,chartstartx-10,chartstarty+10+(chartItemHeight*i)+(chartItemHeight*0.5)+(labelSize*0.25)); // text/x/y
			}
			
			// draw the bars
			this.drawContext.fillStyle = draw_color;
			this.drawContext.fillRect(chartstartx+10,chartstarty+10+(chartItemHeight*0.25)+((i*chartItemHeight)),(this.data[i].value/chartValueWidthRatio)*chartWidth,(chartItemHeight/2)); // x/y/width/height
			this.drawContext.restore();
			this.drawContext.beginPath();
			this.drawContext.moveTo(chartstartx+10+((this.data[i].value/chartValueWidthRatio)*chartWidth),chartstarty+10+(chartItemHeight*0.25)+((i*chartItemHeight))+(chartItemHeight/2));
			this.drawContext.lineTo(chartstartx+10+((this.data[i].value/chartValueWidthRatio)*chartWidth)-(labelSize/4),(labelSize/4)+chartstarty+10+(chartItemHeight*0.25)+((i*chartItemHeight))+(chartItemHeight/2));
			this.drawContext.lineTo(chartstartx+10,(labelSize/4)+chartstarty+10+(chartItemHeight*0.25)+((i*chartItemHeight))+(chartItemHeight/2));
			this.drawContext.lineTo(chartstartx+10,chartstarty+10+(chartItemHeight*0.25)+((i*chartItemHeight))+(chartItemHeight/2));
			this.drawContext.fillStyle = "#AAAAAA";
			this.drawContext.fill();
			
			// draw the bar labels
			if ((""+this.data[i].value).split(".").length==1) { drawLabel = this.data[i].value+ ".0 "; } else { drawLabel = this.data[i].value+" "; }	
			this.drawContext.textAlign="left";
			this.drawContext.fillStyle = draw_color;
			this.drawContext.font = (labelSize*0.75)+'px Calibri';
			this.drawContext.fillText( drawLabel ,chartstartx+10,chartstarty+10+(chartItemHeight*i)+(chartItemHeight*0.25)-2); // text/x/y
		}
	}
}
