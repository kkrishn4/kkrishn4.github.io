/* Write JavaScript here */

//Constants for the SVG

	
	var width = window.innerWidth,
		height = window.innerHeight-250;

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout.force()
    .charge(-500)
    .linkDistance(300)
    .size([width, height]);

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("#graph").append("svg")
    .attr("width", width)
    .attr("height", height);

//Read the data from the mis element 
var mis = document.getElementById('mis').innerHTML;
graph = JSON.parse(mis);

//Creates the graph data structure out of the json data
force.nodes(graph.nodes)
    .links(graph.links)
    .start();

//Create all the line svgs but without locations yet
var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function (d) {
    return Math.sqrt(d.value);
});

var gnodes = svg.selectAll(".node")
  .data(graph.nodes)
  .enter()
  .append('g')
  .classed('gnode', true);

//Do the same with the circles for the nodes - no 
var node = gnodes.append("circle")
    .attr("class", "node")
    .attr("r", function(d){
	return (d.group*10)})
    .style("fill", function (d) {
    return color(d.group);
	
})
    .call(force.drag);
	
	var labels=gnodes.append("text")
	  .attr("dx", 12)
      .attr("dy", ".35em")
	  .style("font-size","34px")
      .text(function(d) { return d.name });

//adding movement
var directionX = 1;
var directionY = 1;

function tick(){

	node.each(function(d){
		var speedX = (Math.random() - 0.5) * 5 *((Math.random()*3)-1)
		var speedY = (Math.random() - 0.5) * 5 *((Math.random()*3)-1)
		
		if ((d.x - d.radius - 2) < 100){
			speedX = Math.abs(speedX)
			directionX = 1
		}
		if ((d.x + d.radius + 2) > window.innerWidth-100) {
			speedX = Math.abs(speedX)
			directionX = -1
		}
		if ((d.y - d.radius - 2) < 100){
			speedY = Math.abs(speedY)
			directionY = -1
		}
		if ((d.y + d.radius + 2) > window.innerHeight-100){
			speedY = Math.abs(speedY)
			directionY = 1
		}
		d.x = d.x + (directionX*2*speedX * 0.1)
		d.y = d.y + (-directionY*2*speedY * 0.1)
	})
	node.attr("cx", function(d) { return d.x = Math.max(15, Math.min(width - 15, d.x)); })
    .attr("cy", function(d) { return d.y = Math.max(15, Math.min(height - 15, d.y)); });

	link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
        return d.source.y;
    })
        .attr("x2", function (d) {
        return d.target.x;
    })
        .attr("y2", function (d) {
        return d.target.y;
    });

    node.attr("cx", function (d) {

        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    });
	labels.attr("dx", function (d) {
        return d.x-15;
    })
        .attr("dy", function (d) {

	if(d.group==4){
	  return d.y-26
	}
        return d.y-d.group*10;
    });
	setInterval(tick,10000);
}
//Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
force.on("tick", tick);

//adding sound on click

//** Usage: Instantiate script by calling: var uniquevar=createsoundbite("soundfile1", "fallbackfile2", "fallebacksound3", etc)
//** Call: uniquevar.playclip() to play sound

var html5_audiotypes={ //define list of audio file extensions and their associated audio types. Add to it if your specified audio file isn't on this list:
	"mp3": "audio/mpeg",
	"mp4": "audio/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav"
}

function createsoundbite(sound){
	var html5audio=document.createElement('audio')
	if (html5audio.canPlayType){ //check support for HTML5 audio
		for (var i=0; i<arguments.length; i++){
			var sourceel=document.createElement('source')
			sourceel.setAttribute('src', arguments[i])
			if (arguments[i].match(/\.(\w+)$/i))
				sourceel.setAttribute('type', html5_audiotypes[RegExp.$1])
			html5audio.appendChild(sourceel)
		}
		html5audio.load()
		html5audio.playclip=function(){
			html5audio.pause()
			html5audio.currentTime=0
			html5audio.play()
		}
		return html5audio
	}
	else{
		return {playclip:function(){throw new Error("Your browser doesn't support HTML5 audio unfortunately")}}
	}
}

//Initialize two sound clips with 1 fallback file each:

var clicksound = createsoundbite("waterdrop.mp3", "click.mp3")
