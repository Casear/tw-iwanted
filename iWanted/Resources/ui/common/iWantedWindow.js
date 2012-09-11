function iWantedWindow(wtitle){
	var self=Ti.UI.createWindow({
		backgroundColor:'white',
		barColor:'#FF3B5998',
		title:wtitle
	});
	return self;
}
module.exports=iWantedWindow;
