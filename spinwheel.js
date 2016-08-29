	var svgns = "http://www.w3.org/2000/svg"; // SVG Namespace (in case we need it)
		var slices = []; // Array of wheel slice objects
		var numSlices = 6;  // Size of the circle slices
		var isSpinning = false; // Is the arrow spinning?
		var rotation = 0; // Arrow rotation
		var currentSlice = 0; // Current slice the arrow is over
		var wheel; // DOM Object for the spinner board
		var arrow; // DOM Object for the spinner arrow
		var spinButton; // DOM Object for the spin wheel <button>
		//var spinWheelTexts = ['Win $10','Please try again!','Win $100','2 Free Spins','Please try again!','Win 300 Points'];
		var spinWheelTexts = ['Win $10','Please try again!','Win $100','2 Free Spins','Please try again!','Win 300 Points'];

		var xPos = [120,275,300,260,130,90];
		var yPos = [100,110,200,300,300,200];
		var count = 1;
		
		var bonusSpinCount = 0;
		// Basic wheel "slice" object for drawing SVG
		function Slice(num, parent) {
			// Set instance vars
			this.parent = parent;
			this.size = 360/numSlices;
			this.offset = num * this.size;
			this.id = "slice_"+num;
			// Draw the object
			this.object = this.create();
			this.parent.appendChild(this.object);
		}
		Slice.prototype = {
			create:function(num) {
				// Create a group to store the slice in
				var g = document.createElementNS(svgns, "g");
				// Create the slice object
				var slice = document.createElementNS(svgns, "path");
				slice.setAttributeNS(null, "id", this.id);
				var x1 = 200 + 180 * Math.cos(Math.PI*(-90+this.offset)/180);
				var y1 = 200 + 180 * Math.sin(Math.PI*(-90+this.offset)/180);
				var x2 = 200 + 180 * Math.cos(Math.PI*(-90+this.size+this.offset)/180);
				var y2 = 200 + 180 * Math.sin(Math.PI*(-90+this.size+this.offset)/180);
				slice.setAttributeNS(null, "d", "M 200 200 L "+x1+" "+y1+" A 180 180 0 0 1 "+x2+" "+y2+"  Z");
				// Randomize the color of the slice and finish styling
				var red = Math.floor(Math.random() * 215) + 20;
				var green = Math.floor(Math.random() * 215) + 20;
				var blue = Math.floor(Math.random() * 215) + 20;
				slice.setAttributeNS(null, "fill", "rgb("+red+","+green+","+blue+")");
				slice.setAttributeNS(null, "stroke", "#222222");
				slice.setAttributeNS(null, "style", "stroke-width:2px");
				// Add the slice to the group
				g.appendChild(slice);
				// Create the highlight for the slice
				var overlay = document.createElementNS(svgns, "path");
				overlay.setAttributeNS(null, "d", "M 200 200 L "+x1+" "+y1+" A 180 180 0 0 1 "+x2+" "+y2+"  Z");
				overlay.setAttributeNS(null, "fill", "#FFFFFF");
				overlay.setAttributeNS(null, "stroke", "#222222");
				overlay.setAttributeNS(null, "style", "stroke-width:1px");
				overlay.setAttributeNS(null, "opacity", "0");
				// Add the highlight for the slice to the group


				//Manually create text for 1st element
				var data = document.createTextNode(spinWheelTexts[0]);
			    var text = document.createElementNS(svgns, "text");
			    text.setAttributeNS(null, "x", xPos[0]);
			    text.setAttributeNS(null, "y", yPos[0]);
			    text.setAttributeNS(null, "fill", "white");
			    text.setAttributeNS(null,"font-size","18");
			    text.setAttributeNS(null, "text-anchor", "middle");
			    text.appendChild(data);
			    g.appendChild(text);


				var data = document.createTextNode(spinWheelTexts[count]);
			    var text = document.createElementNS(svgns, "text");
			    text.setAttributeNS(null, "x", xPos[count]);
			    text.setAttributeNS(null, "y", yPos[count]);
			    text.setAttributeNS(null, "fill", "white");
			    text.setAttributeNS(null,"font-size","18");
			    text.setAttributeNS(null, "text-anchor", "middle");
			    text.appendChild(data);
			    g.appendChild(text);
			    count++;

				g.appendChild(overlay);
				return g;
			},
			toggleOverlay:function() {
				var overlay = this.object.childNodes[1];
				if (overlay.getAttribute("opacity") == 0) {
					overlay.setAttributeNS(null, "opacity", 1);
				}
				else {
					overlay.setAttributeNS(null, "opacity", 0);
				}
			}
		};


		function showPopUpMessage(){

			var msg;
			if( rotation>= 0 && rotation<60  || rotation >=180 && rotation <240 ){
				msg = "Sorry, you have not won anything. Please try again!";
			}
			else if( rotation >=60 && rotation <120 ){
				msg = "Congratulations, you have won $100!"
			}
			else if( rotation >=120 && rotation <180 ){
				msg = "Congratulations, you have won 2 free spins worth of points!"
				user.points += 3*spinWheelLimit;
				updateUserDisplay();
			}
			else if( rotation >=240 && rotation <300 ){
				msg = "Congratulations, you have won 300 Points!";
				user.points += 300;
				updateUserDisplay();

			}else if( rotation >=300 && rotation <360 ){
				msg = "Congratulations, you have won $10!";
			}
			setTimeout(function () { 
				alert(msg); 

                if(user.points < spinWheelLimit){
                    $("#wrapper").hide();
                }

			}, 1000);

		}




		// Toggle the spinning of the wheel
		function toggleSpinning() {
			// Toggle the spinning animation
			if (isSpinning) {
				// Stop the arrow
				isSpinning = false;
				clearInterval(toggleSpinning.spinInt);
				spinButton.removeAttribute("disabled");
				setTimeout(showPopUpMessage, duration);


			}
			else {
                user.points -= spinWheelLimit;
                updateUserDisplay();
				// Start spinning the arrow
				isSpinning = true;
				toggleSpinning.spinInt = setInterval(spinWheel, 1000/60);
				// Set how long the wheel will be spinning
				var duration = Math.floor(Math.random() * 2000) + 1000;
				setTimeout(toggleSpinning, duration);
				// Disable the spin button
				spinButton.setAttribute("disabled", "true");
			}
		}
		// Animation step for spinning the wheel arrow
		function spinWheel() {
			// Rotate the spinner arrow
			do{
				rotation = (rotation + 12) % 360;
			}while(rotation %60 == 0);

			arrow.setAttributeNS(null, "transform", "rotate("+rotation+",200,200)");
			// Highlight the slice the arrow is above
			var newSlice = Math.floor(rotation / (360/numSlices));
			if (newSlice != currentSlice) {
				// slices[currentSlice].toggleOverlay();
				// slices[newSlice].toggleOverlay();
				currentSlice = newSlice;
			}


		}
		// Document ready event
		document.addEventListener("DOMContentLoaded", function() {
			// Get a handle to all necessary DOM elements
			wheel = document.getElementById("spinner-board"); // DOM Object for the spinner board
			arrow = document.getElementById("spinner-arrow"); // DOM Object for the spinner arrow
			spinButton = document.getElementById("spinner-button"); // DOM Object for the spin wheel <button>
			// Generate the wheel sections
			for (var i = 0; i < numSlices; i++) {
				slices[i] = new Slice(i, wheel);
			}
			// Highlight the first slice
			slices[0].toggleOverlay();
		}, false);