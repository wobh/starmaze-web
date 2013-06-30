// -*- Mode:js2;coding:utf-8 -*-

// FILE: starmaze.js

// AUTHORS

// William H. Clifford <wobh@wobh.org>

// DESCRIPTION

// Based on the game described by John Cartan at:
// http://www.cartania.com/starmaze/intro.html

// NOTES

// In this one I try to write a Javascript StarMaze engine.

// Locations in the starmaze are treated as numbers and this code uses
// octal numbers to represent them because they easier to visualize
// the constellation expected.

var Mazes = {
    'classical': [0660, 0700, 0330, 0444, 0272, 0111, 0066, 0007, 0033],
    'aborigine': [0640, 0720, 0310, 0464, 0525, 0131, 0046, 0027, 0013],
    'moonscape': [0524, 0250, 0521, 0242, 0272, 0212, 0425, 0052, 0125],
    'pitchfork': [0504, 0270, 0501, 0262, 0525, 0232, 0405, 0072, 0105],
    'supernova': [0432, 0205, 0162, 0141, 0272, 0414, 0234, 0502, 0261],
    'jellyfish': [0412, 0225, 0142, 0161, 0525, 0434, 0214, 0522, 0241],
    'hypercube': [0764, 0255, 0731, 0343, 0272, 0616, 0467, 0552, 0137]
};

var Axes = {
    'major': [0400, 0200, 0100, 0040, 0020, 0010, 0004, 0002, 0001],
    'loshu': [0010, 0400, 0002, 0004, 0020, 0100, 0200, 0001, 0040],
     'ulam': [0020, 0010, 0004, 0040, 0001, 0002, 0100, 0200, 0400],
    'minor': [0001, 0002, 0004, 0010, 0020, 0040, 0100, 0200, 0400]
};

var Keys = {
     'number_row': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
     'number_pad': ['7', '8', '9', '4', '5', '6', '1', '2', '3'],
    'qwerty_left': ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c']
};

var Starmaze = function (maze_name, axes_name, keys_name) {
    var settings = {
        'maze_name': (typeof maze_name === 'undefined') ? 
            'classical' : maze_name,
        'axes_name': (typeof axes_name === 'undefined') ?
            'major' : axes_name,
        'keys_name': (typeof keys_name === 'undefined') ?
            'number_row' : keys_name
    };

    var that = this;

    var maze = Mazes[settings['maze_name']];

    var get_path = function (path_ref) {
	return maze[path_ref];
    };

    // TODO: Hypercube coordinate mappings. Not yet implemented.
    // var hypercube = Mazes['hypercube'];

    // this.corner = function (path_ref) {};

    var axes = Axes[settings['axes_name']];
    
    var get_axis = function (axis_ref) {
        return axes[axis_ref];
    };

    this.get_path_by_axis = function (axis) {
	return this.get_axis(axes.indexOf(axis));
    };

    this.keys = Keys[settings['keys_name']];

    this.get_axis_by_key = function (key) {
        return get_axis(this.keys.indexOf(key));
    };

    this.get_path_by_key = function (key) {
        return get_path(this.keys.indexOf(key));
    };

    var sky_names = {
        'entrance':  0020,
        'blackhole': 0000,
        'homebase':  0757,
        'shangrila': 0777
    };

    var named_skies = {
        0020: 'entrance',
        0000: 'blackhole',
        0757: 'homebase',
        0777: 'shangrila'
    };

    this.trail = [sky_names['entrance']];

    this.locus = function () {
        return this.trail[this.trail.length - 1];
    };

    this.sky_name = function() {
        return this.named_sky(this.locus());
    };

    var looker = function (axis) {
        return !((that.locus() & axis) === 0); 
    };

    var walker = function (path) {
        return that.locus() ^ path;
    };

    var no_star = new Error("No star there.");

    this.walk_path = function (key) {
        if (looker(this.get_axis_by_key(key))) {
            this.trail.push(walker(this.get_path_by_key(key)));
            return this.locus();
        } else {
            throw no_star;
        };
    };

    this.locus_as_array_of_bits = function () {
        var here = that.locus();
	var bits = [];
	for (var power = 256; power >= 1; power /= 2) {
	    bits.push(Math.floor (here / power));
	    here = here % power;
	};
	return bits;
    };

    this.locus_as_array_of_powers = function () {
        var here = that.locus();
	var powers = [];
	for (var power = 256; power >= 1; power /= 2) {
	    if (Math.floor(here / power) == 0) {
		powers.push(0);
	    } else {
		powers.push(power);
	    };
	    here = here % power;
	};
	return powers;
    };

    this.locus_as_array_of_booleans = function (maze_locus) {
        var here = that.locus();
	var booleans = [];
	for (var power = 256; power >= 1; power /= 2) {
	    booleans.push(Boolean(Math.floor(here / power)));
	    here = here % power;
	};
	return booleans;

	var bits = that.locus_as_array_of_bits(maze_locus);
	return bits.map(Boolean);
    };

    this.figures = {
        'star': [' ', '*'],
        'from': [' ', '+'],
        'near': [' ', 'o'],
        'symbols': ['void', 'star'],
        'yinyang': [function (str) { return '(' + str + ')'; },
                    function (str) { return '[' + str + ']'; }]
    };
    
    this.make_figure_getter = function (figures) {
        return function (index) { return figures[index]; };
    };

    this.locus_as_string = function (figure_name) {
        if (typeof figure_name === 'undefined') { 
            var figure = this.figures['star'];
        } else {
            figure = this.figures[figure_name];
        };
        
        var get_figure = this.make_figure_getter(figure);
        var stars = this.locus_as_array_of_bits();
        return stars.map(get_figure);
    };
};


var view = function () {

    // use HTML5 canvas if available
    var sky = document.getElementById ('starmaze');
    if (sky.getContext) {
	var context = sky.getContext('2d');
    } else {
	// use d3?
    };

    var draw_maze_locus = function (maze_locus) {
    };
}();
