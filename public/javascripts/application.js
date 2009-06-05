$(document).ready(function() {
	getDirContents('./public/music/', $('#navBar'), false, true );
	$('#playButton').click(function(){
		loadPlayer();
		var player = $('#player');
		player.hide();
		player.fadeIn("slow");
	});
});

function loadPlayer(){
	var getParam = '';
	for (var i = 0; i < songArray.length; i++){
		var temp = "." + songArray[i].substring(8);
		getParam +=  (temp + '|');
	}
	
	getParam = getParam.substring(0, getParam.length - 1)
	var htParam = 20 + songArray.length * 20;
	
	$.get('http://localhost:3000/loadPlayer', {songList:getParam, height:htParam}, function(data){
		$('#player').append(data);
	});
}

var songArray = new Array();
var songArrayCounter = 0;

function getDirContents(dirPathString, callingEle, grow, first){
	$.get('http://localhost:3000/getDirContents', {dirPath:dirPathString}, function(data){
			if (first)
			callingEle.append(data);
			else
			callingEle.parent().append(data);
			
			var nextList = callingEle.parent().find('ul:first'), nextDirItems = callingEle.parent().find("ul li[class = 'directoryItem'] span"), nextFileItems = callingEle.parent().find("ul li[class = 'fileItem']");
			
			if (grow){
				var orgHeight = nextList.css('height');
				nextList.css('height', '0px');
				nextList.animate( {height: orgHeight}, 500);
				
				if (nextList.parents('ul:first').attr('class') == 'sublist'){
					nextList.parents('ul').each(function(){
						var htOldPos = $(this).css('height').indexOf('p'), htNewPos = orgHeight.indexOf('p');
						var htOld = $(this).css('height').substring(0, htOldPos), htNew = orgHeight.substring(0, htNewPos);
						var adjustedHeight = 1 * ( parseInt(htOld) + parseInt(htNew) );
						$(this).animate( {height: adjustedHeight}, 500);						
					});
				}
			}
			
			nextDirItems.hover(function(){
				$(this).addClass('hover');
			},	function(){
				$(this).removeClass('hover');
			});
				
			nextDirItems.click( function(){
				var pathString = dirPathString + $(this).text();
				getDirContents(pathString, $(this), true, false)
			});

			nextFileItems.click( function(){
				songArray[songArrayCounter] = dirPathString + $(this).text();
				songArrayCounter++;
				$('#playlistlist').append("<span class='mp3'>" + $(this).text() + "</span>");
				var latestMp3 = $('#playlistlist .mp3:last');
				latestMp3.hide();
				latestMp3.fadeIn("slow");
			});				
	}, 'html');
}