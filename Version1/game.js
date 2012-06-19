/**
 * This is a small space shooter/arcade game aiming
 * at learning the basics of programming.
 * We have tried to hide as much as possible the 
 * "difficulties".
 * 
 * Inspired From "Step by Step Creation Tutorial"
 * Using melonJS  http://www.melonjs.org
 *   
 * @package SpaceShooter
 * @subpackage Game Engine
 * 
 * @copyright (c) 2012 The Development Manager Ltd
 * @license GNU Public License
 * 
 * @author Laurent David <laurent@tdm.info>
 */

/*
 * game resources
 * This global variables stores the game resource definition
 */ 
var g_resources = [ {
	name : "title_screen",
	type : "image",
	src : "data/GUI/title_screen.png"
},{
	name : "music_menu",
	type : "audio",
	src : "data/audio/",
	channel:1,
}, {
	name : "32x32_font",
	type : "image",
	src : "data/sprite/32x32_font.png"
}
];

/*
 * The main play screen
 * Here we had to use the internals of MelonJS as it is first intended to use a Map.
 * We wanted to leave the map creation for a more complex tutorials.
 */
var PlayScreen = me.ScreenObject.extend({

	init : function() {
		this.parent(true);
	},
	/*
	 * This is the reset function when we change state (game state).
	 */
	onResetEvent : function() {
		this.z=1;
	},

	/*
	 * Every frame update this method is called
	 */
	update : function() {
		return true;
	},
	/*
	 * This draw callback for every frame
	 */
	draw : function(context) {
		// we just display a black background
		me.video.clearSurface(context, "black");
	},
	/*
	 * action to perform when game is finished (state change)
	 */
	onDestroyEvent : function() {
	}

});

/*
 * This is the first screen when the game starts
 * Just displays a background image and some text
 * Mainly inspired from the tutorial (http://melonjs.org)
 */
var TitleScreen = me.ScreenObject
		.extend({
			// constructor
			init : function() {
				this.parent(true);
				// title screen image
				this.title = null;
				this.font = null;
			},

			// reset function
			onResetEvent : function() {
				if (this.title == null) {
					// init stuff if not yet done
					this.title = me.loader.getImage("title_screen");
					// font to display the menu items
					this.font = new me.BitmapFont("32x32_font", 32);
					this.font.set("left");
					me.audio.playTrack("music_menu",true);


				}
				// enable the keyboard
				me.input.bindKey(me.input.KEY.ENTER, "enter", true);

			},

			// update function
			update : function() {
				// enter pressed ?
				if (me.input.isKeyPressed('enter')) {
					me.state.change(me.state.PLAY);
				}
				return true;
			},

			// draw function
			draw : function(context) {
				context.drawImage(this.title, 0, 0);

				this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
			},

			// destroy function
			onDestroyEvent : function() {
				me.input.unbindKey(me.input.KEY.ENTER);
				me.audio.stopTrack();
			}

		});


/*
 * This is the main application
 * Mainly inspired from the tutorial (http://melonjs.org)
 */
var jsApp = {
	/*
	 * Initialize the jsApp
	 */
	onload : function() {

		// init the video
		if (!me.video.init('gameapp', 640, 480, false, 1.0)) {
			alert("Sorry but your browser does not support html 5 canvas.");
			return;
		}
		// initialize the "audio"
		me.audio.init("mp3,ogg");

		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);

		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},

	/*
	 * ---
	 * 
	 * callback when everything is loaded
	 * 
	 * ---
	 */
	loaded : function() {
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.MENU, new TitleScreen());
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());

		// enable the keyboard for later use
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.SPACE, "fire");

		// start the game by title screen
		me.state.change(me.state.MENU);

	}

};

// bootstrap
window.onReady(function() {
	jsApp.onload();
});

