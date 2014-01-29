var SlurpSearch = Search.extend({
    initialize: function(){
        _.extend(this.validation,{
            url:{
                pattern: 'url',
                required: false,
            }    
        })
    },
    slurp: function(){
        model=this;
        this.set('state','busy');
        $.get('/slurp/',{url: this.get("url")} ).done(function(data){
            model.set({
                "text"                : _(data.content).stripTags().trim().unescapeHTML().value(),
                "title"               : data.title,
                "metaData.source"     : data.url,
                "metaData.published"  : moment(data.data_published).format('YYYY-MM-DD'),
            })
            model.set('state','');
            model.execute();
        }).fail(function() {
            model.set('state','error');
        });
    }
})

var SearchView = Marionette.ItemView.extend({
    template: '#searchTemplate',
    events:{
        'click #search' : 'search',
        /*      'click #save'   : 'save', */
        /*        'click #slurp'  : 'slurp', */
        'keyup'         : 'showErrors',
    },
    modelEvents: {
        'change:state'  : 'showState'
    },
    ui:{
        'buttons': '#search',
        'busy': '.busy-indicator',
        'error': '.error-indicator',
        'fields': '#url, #text'
    },
    // Stickit configuration
    bindings: {
        '#text': 'text',
        '#title': 'title',
        '#source': 'metaData.source',
        '#published': 'metaData.published',
        '#textEntered': {
            observe:'text',
            updateMethod: 'html',
            onGet: function(val) { return _.lines(_.prune(val,800)).map(function(l){return "<p>"+l+"</p>"}); }
        },
        '#search':{
            observe: ['text','url'],
            update: function($el, val, model, options){
                valid1=_.isEmpty(model.preValidate('text',model.get('text')));
                valid2=(!_.isEmpty(model.get("url")))&&(_.isEmpty(model.preValidate('url',model.get('url'))))
                $el.attr("disabled",!(valid1 || valid2));
            },

        },
        '#url': 'url',
        /*
        '#slurp':{
        observe: 'url',
        update: function($el, val, model, options){
        valid=(!_.isEmpty(model.get("url")))&&(_.isEmpty(model.preValidate('url',model.get('url'))))
        $el.attr("disabled",!valid);
        }
        }
        */
    },
    onDomRefresh: function(){
        Backbone.Validation.bind(this);
        this.stickit();
        this.showErrors();
        this.$el.tooltip({selector:':input',trigger:'focus',animation:false});
        this.showState();
    },
    showErrors: function(){
        el=this.$el;
        el.find('*').removeClass('has-error');
        _.each(this.model.validate(),function(k,v){
            el.find('#'+_.ltrim(v,"metaData.")).parent().addClass('has-error');
        });
    },
    search: function(e){
        e.preventDefault();
        this.trigger("search")
    },
    showState: function(e) {
        // update the view to reflect the current state of the request (ie busy indicators, error messages...)
        var state = this.model.get('state');
        // guards around ui elements, because view might not be rendered yet (sigh...)
        if(this.ui.busy.show !== undefined) {
            if(state == 'busy') {
                // a request is in-flight...
                this.ui.busy.show();
                this.ui.buttons.hide();
                this.ui.fields.prop('disabled', true);
            } else {
                this.ui.busy.hide();
                this.ui.buttons.show();
                this.ui.fields.prop('disabled', false);
            }
        }
        if( this.ui.error.show !== undefined) {
            if(state == 'error') {
                this.ui.error.show();
            } else {
                this.ui.error.hide();
            }
        }
    }
})

var SideBarView = Marionette.ItemView.extend({
    template: '#extensionPromoTemplate',
});

var ResultView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#resultTemplate',
    ui:{
        visualisation: '#visualisation'
    },
    templateHelpers:function(){
        search=this.options.search;
        return {
            shortTitle: function(){
                return _.prune(this.title,80)
            },
            permalink: function(){
                return _.first(this.metaData.permalink)
            },
            journalisted: function(){
                return "http://journalisted.com/article/"+Number(_.first(this.metaData.id)).toString(36)
            },
            journalists: function(){
                return _.join(",",this.metaData.journalists)
            },
            source: function(){
                return _.first(this.metaData.source)
            },
            published: function(){
                return moment(_.first(this.metaData.published)).format('Do MMMM YYYY')
            },
            score: function(){
                return Number((this.leftCharacters/this.parent.get('text').length+this.rightCharacters/this.characters)*1.5).toFixed(0)
            },
            cut: function(){
                return Number(this.leftCharacters/this.parent.get('text').length*100).toFixed(0)
            },
            paste: function(){
                return Number(this.rightCharacters/this.characters*100).toFixed(0)
            },
            overlap: function(){
                return this.leftCharacters
            }
        }
    },
    onRender: function(){
        vis=Raphael(this.ui.visualisation.get(0),180,60);
        this.buildMiniChurn(vis,this.model.get('leftFragments'),this.model.get('parent').get('text').length);
        this.buildMiniChurn(vis,this.model.get('rightFragments'),this.model.get('characters')).transform("t100,0");
    },
    buildMiniChurn: function(vis,fragments,length){
        vis.setStart();
        _.each([80,80,80,80,80,60],function(val,i){
            vis.rect(0,i*7,val,5).attr({fill:'black',stroke:'none'})
        })
        _.each(fragments,function(val){
            start=Math.floor(val[0]/length*460);
            end=Math.ceil((val[0]+val[1])/length*460);
            row=Math.floor(start/80);
            while (start<end){
                rowStart=start%80;
                rowLength=Math.min(80-rowStart,end-start);
                vis.rect(rowStart,row*7,rowLength,5).attr({fill:'orange',stroke:'none'});
                start+=rowLength;
                row++;
            }
        })
        return vis.setFinish();
    }
})

var ResultsGroupView = Marionette.CompositeView.extend({
    template: '#resultsGroupTemplate',
    itemView: ResultView,
    itemViewContainer: "tbody",
    initialize: function(options){
        this.collection=this.model.get("associations");
    },
    templateHelpers:{
        title: function(){
            count=this["associations"].length;
            return count+" "+_.humanize(this["name"])+((count>1)?"s":"");
        }
    }
})

var ResultsView = Marionette.CompositeView.extend({
    template: '#resultsTemplate',
    itemView: ResultsGroupView,
    itemViewContainer: ".result-group-container",
    initialize: function(options){
        //console.log(this.model);
        this.collection=this.model.groupedAssociations("type");
    },
    getTemplate: function() {
        if( this.model.hasResults() ) {
            if( this.model.numResults() >0 ) {
                return "#resultsTemplate";
            } else {
                return "#noResultsTemplate";
            }
        } else {
            // placeholder - search hasn't been performed yet.
            return "#nullResultsTemplate";
        }
    },
    templateHelpers:{
        shareURL: function() {
            if( this.url ) {
                return window.location.href;
            } else {
                return null;
            }
        },
        shareTwitter: function() { return "http://twitter.com/share?url=" + encodeURIComponent(this.url); },
        shareFacebook: function() { return "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.url); },
        shareStumbleupon: function() { return "http://www.stumbleupon.com/submit?url=" + encodeURIComponent(this.url); },
        shareGooglePlus: function() { return "https://plus.google.com/share?url=" + encodeURIComponent(this.url); },
    }
})

var App = new Marionette.Application();

App.addInitializer(function(options){
    App.addRegions({
        main: '#region-main',
        bottom: '#region-bottom'
    });
});

App.on("initialize:after", function(){
    if (Backbone.history){ Backbone.history.start({pushState:true}); }
});

var AppRouter=Marionette.AppRouter.extend({
    appRoutes: {
        ""                      : "check",
        "check"                  : "check"
        //":doctype/:docid(/)"    : "results",
        //":left#:right(/)"       : "sidebyside",
    }
});

var Controller=Marionette.Controller.extend({
    initialize: function(){
        App.Search=new SlurpSearch(doc,{parse:true});
        App.Search.on({
            "executed":function(){
                //console.log("EXECUTED");
                // forge a sharable url if available
                var u = App.Search.get("url");
                if (u) {
                    router.navigate("check?url="+u,{trigger:false});
                }
                // if there are results, show em. Otherwise, rely on the search view to show the "none found message"
             //   if( App.Search.numResults() > 0 ) {
                    App.main.show(new ResultsView({model: App.Search}));
             //   }
            },
        });
        App.SearchView=new SearchView({ model:App.Search});
        App.SearchView.on({
            "search":function(){
                var model = App.Search;
                if( model.get('text').length > 0 ) {
                    // text is filled out, so do a search
                    //console.log("start text search");
                    App.Search.execute();
                } else {
                    // else, assume it's just a url, so slurp it
                    //console.log("start slurp search");
                    App.Search.slurp();
                }
            }
        });
    },
    check: function() {
        // fn to grab a parameter from the page URL
        // (from http://stackoverflow.com/a/523293 )
        var getParameter = function(paramName) {
            var searchString = window.location.search.substring(1),
            i, val, params = searchString.split("&");

            for (i=0;i<params.length;i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return val[1]
                }
            }
            return null;
        };

        App.Search.unset("associations");
        App.bottom.close();
         App.Search.set("metaData",{
            type: "search",
            published: moment().format('YYYY-MM-DD'),
            source: ""
        });
        App.Search.set({mode:"search"});

        var u = getParameter("url");
        if( u != null ) {
            //start search immediately
            App.Search.set({url:u});
            App.SearchView.trigger("search");
        }
        App.main.show(App.SearchView);
    }
});

var router = new AppRouter({controller:new Controller()});

$(function(){
    App.start();
});
