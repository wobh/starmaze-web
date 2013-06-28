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

    // this.get_corner = function (path_ref) {
    //     return hypercube[path_ref];
    // };

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

    this.entrance =  0020;
    this.blackhole = 0000;
    this.home_base = 0757;
    this.shangrila = 0777;

    this.trail = [this.entrance];

    this.locus = function () {
        return this.trail[this.trail.length - 1];
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
};

    var locus_as_array_of_bits = function (maze_locus) {
	var bits = [];
	for (var power = 256; power >= 1; power /= 2) {
	    bits.push(Math.floor (maze_locus / power));
	    maze_locus = maze_locus % power;
	};
	return bits;
    };

    var locus_as_array_of_powers = function (maze_locus) {
	var powers = [];
	for (var power = 256; power >= 1; power /= 2) {
	    if (Math.floor(maze_locus / power) == 0) {
		powers.push(0);
	    } else {
		powers.push(power);
	    };
	    maze_locus = maze_locus % power;
	};
	return powers;
    };

    var locus_as_array_of_booleans = function (maze_locus) {
	var booleans = [];
	for (var power = 256; power >= 1; power /= 2) {
	    booleans.push(Boolean(Math.floor(maze_locus / power)));
	    maze_locus = maze_locus % power;
	};
	return booleans;

	var bits = locus_as_array_of_bits(maze_locus);
	return bits.map(Boolean);
    };

    var locus_as_string = function (maze_locus) {};

    var walk_error = new Error("No path that way");

    var walk_path = function (maze_locus, maze_path) {
	if (maze_locus & maze_path) {
	    return maze_locus ^ maze_path;
	} else {
	    throw walk_error;
	};
    };
    
}();


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
