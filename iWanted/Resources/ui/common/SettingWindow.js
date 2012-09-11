var iWantedWindow=require('ui/common/iWantedWindow');
function SettingWindow(title){
	var self=new iWantedWindow(title);
	
	var personalView=Ti.UI.createView({
		top:10,
		left:10,
		height:200
	});
	personalView.hide();
	var indicator=Ti.UI.createActivityIndicator({
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		font : {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
		color : 'black',
		message : 'Loading...'
	});
	self.setToolbar([indicator],{animated:true});
	Ti.Facebook.requestWithGraphPath('me?fields=id,name,gender,picture.height(100),birthday',{},'GET',function(e){
		
		if(e.success){
			Ti.API.info(e);
			var personal=JSON.parse(e.result);
			var userImage=Ti.UI.createImageView({
				url:personal.picture,
				top:0,
				left:0,
				width:100,
				height:100
			})
			var name=Ti.UI.createLabel({
				text:personal.name,
				top:0,
				left:110
			})
			var genderImage=Ti.UI.createImageView({
				url: personal.gender=='male' ? 'images/Boy.png':'images/Girl.png',
				top:25,
				left:110,
				width:30,
				height:30
			})
			personalView.add(userImage);
			personalView.add(name);
			personalView.add(genderImage);
			indicator.hide();
			personalView.show();
			
		}
	});
	
	self.add(personalView)
	return self;
}
module.exports = SettingWindow;
