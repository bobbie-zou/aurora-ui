Aurora.Tab = Ext.extend(Aurora.Component,{
	constructor: function(config){
		this.selectIndex = 1;
		this.loaded = {};
		Aurora.Tab.superclass.constructor.call(this,config);
	},
	initComponent:function(config){
		Aurora.Tab.superclass.initComponent.call(this, config);
		this.head = this.wrap.child('td[atype=tab.strips]'); 
		this.body = this.wrap.child('div[atype=tab.bodys]');
		this.selectTab(config.select||0)
	},
	processListener: function(ou){
    	Aurora.Tab.superclass.processListener.call(this,ou);
    	this.head[ou]('click',this.onClick, this);
    },
	initEvents:function(){
		Aurora.Tab.superclass.initEvents.call(this);   
		this.addEvents('select');
		
	},
	selectTab:function(index){		
		if(index <0)index=0;
		var strips = Ext.DomQuery.select('div.strip',this.head.dom);
		var bodys = Ext.DomQuery.select('div.tab',this.body.dom)
		var activeStrip = strips[index];
		var activeBody = bodys[index];
		if(activeStrip){
			if(this.activeTab){
				this.activeTab.removeClass('active');
			}
			this.activeTab = Ext.get(activeStrip);
			Ext.fly(activeStrip).addClass('active');
		}
		if(activeBody){
			if(this.activeBody){
//				this.activeBody.setXY([-1000,-1000]);//setDisplayed('none');
				this.activeBody.setLeft('-10000px');
				this.activeBody.setTop('-10000px');
			}
			this.activeBody = Ext.get(activeBody);
			Ext.fly(activeBody).setLeft('0px');
			Ext.fly(activeBody).setTop('0px');//setDisplayed('block');
		}
		if(this.items[index].ref && this.loaded['tab_'+index]!= true){
			this.load(this.items[index].ref,activeBody);
			this.loaded['tab_'+index] = true;
		}
	},
	onClick:function(e){
		var strip = Ext.fly(e.target.parentNode);
		if(strip.hasClass('strip') && !strip.hasClass('active')){
			var strips = Ext.DomQuery.select('div.strip',this.head.dom);
			for(var i=0,l=strips.length;i<l;i++){
				var node = strips[i];
				if(node == e.target.parentNode){
					this.selectTab(i);
					break;
				}
			}
		}
	},
	showLoading : function(dom){
    	Ext.fly(dom).update('正在加载,请稍后...');
    	Ext.fly(dom).setStyle('text-align','center');
    	Ext.fly(dom).setStyle('line-height',5);
    },
    clearLoading : function(dom){
    	Ext.fly(dom).update('');
    	Ext.fly(dom).setStyle('text-align','');
    	Ext.fly(dom).setStyle('line-height','');
    },
	load : function(url,dom){
		this.showLoading(dom);
		var sf = this;
    	Ext.Ajax.request({
			url: url,
		   	success: function(response, options){
		    	sf.clearLoading(dom);
		    	var html = response.responseText;		    	
		    	Ext.fly(dom).update(html,true);
		    }
		});		
    }
});