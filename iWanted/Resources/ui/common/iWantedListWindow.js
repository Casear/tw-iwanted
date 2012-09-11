var iWantedWindow=require('ui/common/iWantedWindow');
function iWantedListWindow(title){
	var self=new iWantedWindow(title);

	var indicator=Ti.UI.createActivityIndicator({
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
		font : {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
		color:'white',
		message : 'Loading...'
	});
	self.setToolbar([indicator],{animated:true});
	//self.add(indicator);
	indicator.show();
	var xhr = Titanium.Network.createHTTPClient();
		xhr.onload = function()
		{
			indicator.hide();
			
			var wanteds= JSON.parse( this.responseText);
			var ids=[];
			var userId=[];
			for(var wanted in wanteds){
				ids.push(" url='http://tw.iwanted.jit.su/wanted/"+wanteds[wanted].id+"' ");
				userId.push(' uid='+wanteds[wanted].userId);
				Ti.API.log(wanteds[wanted].title);
					
			}
			var query="SELECT comments_fbid,url,like_count,commentsbox_count FROM link_stat WHERE "+ids.join(' or ');
			var query2="SELECT uid,name, sex, pic_small,birthday FROM user WHERE "+userId.join(' or ');
			Ti.API.info(query);
			Ti.API.info(query2);
			
	
			Ti.Facebook.request('fql.query', {query: query},  function(r)
			{
				if (r.success) {
					var tableView=Ti.UI.createTableView();	
					var rows=[];
					
				Ti.Facebook.request('fql.query', {query: query2},  function(k)
				{
					var users=JSON.parse(k.result);
					Ti.API.log(k.result);
					var results=JSON.parse(r.result);
					
					
					for(var wanted in wanteds){
						for(var result in results){
							if(("http://tw.iwanted.jit.su/wanted/"+wanteds[wanted].id)==results[result].url){
								wanteds[wanted].like_count=results[result].like_count;
								wanteds[wanted].comment_count=results[result].commentsbox_count;	
							}	
						}
						for(var user in users){
							if((wanteds[wanted].userId)==users[user].uid){
								wanteds[wanted].userName=users[user].name;
								wanteds[wanted].picture=users[user].pic_small;
								wanteds[wanted].gender=users[user].sex;	
							}	
						}
						if(wanteds[wanted].like_count==undefined){
							wanteds[wanted].like_count=0;
							wanteds[wanted].comment_count=0;
						}
						Ti.API.log(wanteds[wanted].gender);
						var row=Ti.UI.createTableViewRow({	
							hasChild:true,
							want:wanteds[wanted]
							
							
						});
						var submiterImage=Ti.UI.createImageView({
								url:wanteds[wanted].picture,
								top:5,
								left:5,
								width:30,
								height:30
							});
						
						var typeImage=Ti.UI.createImageView({
							url: wanteds[wanted].type=='wanted' ? 'images/Tools.png':'images/Film.png',
							top:5,
							right:5,
							width:30,
							height:30
						});
						var title=Ti.UI.createLabel({
							text:wanteds[wanted].title,
							top:5,
							left:40,
							height:30,
							color:  wanteds[wanted].gender=='male' ? 'black':'#ff87db'
							
						});
						Ti.API.log('2131');
						row.add(submiterImage)	;
						row.add(title);
						row.add(typeImage)	;
						rows.push(row);
					}
					Ti.API.log('t:');
					Ti.API.log(rows);
					tableView.setData(rows);
					self.add(tableView);
				});
				
				}	
				Ti.API.info(r);	
			});
			
		};
		xhr.onerror = function()
		{
			Titanium.API.info('error');
		};
		xhr.open("GET","http://tw.iwanted.jit.su/api/wanted");
		xhr.send();
	//Ti.Facebook.request()
	
	
	return self;
	
	
	
}
module.exports = iWantedListWindow;
