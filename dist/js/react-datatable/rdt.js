/** @jsx React.DOM */
var React = require('react');
var DataSource = require("./datasource");
var Pager = require("./pager");

var RDTRow = require("./row");
var RDTColumn = require("./column");
var Paginator = require("./paginator");


var TABLE_CSS = {
    pure: {
        table: 'pure-table pure-table-bordered'
    },
    'pure-striped': {
        table: 'pure-table pure-table-bordered pure-table-striped'
    },
    bootstrap: {
        table: 'table table-bordered'
    },
    foundation: {
        table: ''
    }
}

/**
 * Simple Data Table using react.
 *
 *
 *  var datasource = {
 *       data: []
 *   };
 *
 *  var config = {
 *      style : 'pure',
 *       cols : [
 *           { editable: true, property: "path" , header: "First Name"  }
        ]
    };
 *
 */
var RDT = React.createClass({displayName: 'RDT',

    nextPage : function() {
        if ( this.pager ) {
            this.pager = this.pager.next();
            this.setState({ pager : this.pager.state() , records : this.ds.records });
        }
    },

    add : function(record) {
        this.datasource.records.push(record);
        var pagerState = null;
        if ( this.pager ) {
            pagerState = this.pager.state()
        }
        return { pager : pagerState , records: this.ds.records };
    },

    getInitialState: function () {

        this.ds = new DataSource(this.props.config,this.props.datasource);
        if ( this.props.config.pager ) {
            this.pager = new Pager(1,this.props.config.pager.rowsPerPage,this.ds);
            return { pager : this.pager.state() , records: this.ds.records }
        }
        return { pager : null , records: this.ds.records };
    },

    pagerUpdated : function(page) {
        if ( this.pager ) {
            this.pager = this.pager.toPage(page);
            this.setState({ pager : this.pager.state() });
        }
    },

    render: function () {
        var tableStyle = TABLE_CSS[this.props.config.style];
        var config = this.props.config;

        var paginator = null;
        if ( this.pager ) {
            paginator =  React.createElement(Paginator, {datasource: this.ds, config: this.props.config, pageChangedListener: this.pagerUpdated}) ;

        }
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "rdt-container", ref: "container"}, 
                    React.createElement("table", {className: tableStyle['table']}, 
                        React.createElement(RDTColumn, {config: config}), 
                        React.createElement("tbody", null, 
                        
                            this.ds.map(this.state.pager,function(data,idx,realIdx) {

                                //if this is a normal array map function, then realIdx here is the array
                                //ths is why we do the check here
                                //FIXME: we might want to move this
                                var id = idx;
                                if ( realIdx && !Array.isArray(realIdx)) {
                                    id = realIdx;
                                }
                                return  React.createElement(RDTRow, {ds: this.ds, key: id, data: data, config: config})
                            }.bind(this))
                        
                        )

                    )
                ), 
                paginator
            )
        )

    }
});


module.exports = RDT;