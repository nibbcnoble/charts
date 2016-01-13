# charts
Simple javascript object for making html5 pie and bar charts with the canvas

creating a chart is simple.

1. Include the createcharts.js file in the head of your document.

  <script type="text/javascript" src="createcharts.js"></script>

2. In the body of the document create a canvas and give it a height width and an ID.  Its best to have a canvas that is roughly twice as wide as it's height.

  <canvas id="piechart" width="900" height="400"></canvas>

3. create a new compareObj passing in the array of data objects and the ID of the canvas

each data object being put in the chart has a value and an optional label and color.  If no color is given, a random color is assigned.  Here is an example object :

{ value:581.0, label:"United States", color:"FF4400" }

this would then be passed in to the compareObject along with any other data objects in the following format:

var newset = new compareObj([
	{ value:581.0, label:"United States", color:"FF4400" },
	{ value:129.4, label:"China" },
	{ value:80.8, label:"Saudi Arabia" },
	{ value:70.0, label:"Russia" },
	{ value:61.8, label:"United Kingdom" },
	], "piechart");

If you want to define a unit of measure and a label font size you can include those in the parameters when creating your compareObj, such as this example:

var newset = new compareObj([
	{ value:581.0, label:"United States", color:"FF4400" },
	{ value:129.4, label:"China" },
	{ value:80.8, label:"Saudi Arabia" },
	{ value:70.0, label:"Russia" },
	{ value:61.8, label:"United Kingdom" },
	], "piechart", "billions" ,44);
	
Now you can start displaying your chart.  You can even bounce back and forth between a barchart and a pie chart if you want, the data and color schema will remain the same.

4.  at this point you would be ready to call on your compare object to create a pie or bar chart like this:

newset.pie();

or 

newset.bar();

The above functions will draw the chart.  You can even bounce back and forth between a barchart and a pie chart if you want, the data and color schema will remain the same.

Other stuff:

You can also add more values to the data even after the chart has been drawn.  Just call the addDataSet function like so

newset.addDataSet({ value:250, label:"made up country", color:"8855FF" });

You want to update values, go ahead and use the updateRecordByIndex or updateRecordByLabel functions

newset.updateRecordByIndex(object index, new value);

assuming that all labels are different, this function may also be useful.  just remember this is for updating the value, not the label.

newset.updateRecordByLabel(Object label, new value);

Another function you might need is the greatest and least values in the data set you can call these like this:

newset.greatestValue() and newset.leastValue()

they will return the value.
Finally if you want to know the sum of the values you can call:

newset.sumTotal()

Sorting functions may come some day..
