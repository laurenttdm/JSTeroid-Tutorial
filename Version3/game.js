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
}, {
	name : "music_game",
	type : "audio",
	src : "data/audio/",
	channel:1,
},  {
	name : "spaceship01",
	type : "image",
	src : "data/sprite/spaceship01.png"
}, {
	name : "missile01",
	type : "image",
	src : "data/sprite/missile01.png"
}, {
	name : "alien01",
	type : "image",
	src : "data/sprite/alien01.png"
}
];

/*
 * an alien entity
 * This is the entity that "reacts" to collision.
 */
var AlienEntity = me.ObjectEntity.extend({
	
	init : function(x, y) {
		settings = {}
		settings.image = "alien01";
		settings.spritewidth = 45;
		settings.spriteheight = 41;
		settings.type = me.game.ENEMY_OBJECT;
		settings.collidable = true;
		// call the constructor
		this.parent(x, y, settings);
	},
	update : function() {
		collideres = me.game.collide(this);
		// Check the collision and acts on it.
		// might be an idea to put the collision code in the player
		if (collideres) {
			if (collideres.obj.type == PLAYER_ENTITY) {
				collideres.obj.flicker(30);
				me.game.remove(this);
				return false;
			}
		}
		this.vel.x= 0;
		this.vel.y= 4;
		this.pos.x+= this.vel.x;
		this.pos.y+= this.vel.y;
		if (this.pos.y < me.video.getHeight()) {
			// update animation if necessary
			this.parent(this);
			return true;

		} else {
			me.game.remove(this);
			if (me.state.current().enemySpriteCount != undefined)
			{
				me.state.current().enemySpriteCount--;
			}
			return false;
		}
	}
});
/*
 * A player entity
 * This entity is the player's spaceship
 * It can move horizontally only.
 */
var PLAYER_ENTITY = 100;
var PlayerEntity = me.ObjectEntity.extend({

	init : function(x, y) {
		settings = {}
		settings.image = "spaceship01";
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.type = PLAYER_ENTITY;
		// If you want collision detection
		settings.collidable = true;
		// call the constructor to initialise
		this.parent(x, y, settings);

		// set the speed
		this.setVelocity(3, 1);

	},

	update : function() {

		if (me.input.isKeyPressed('left')) {
			this.vel.x += -this.accel.x * me.timer.tick;
		} else if (me.input.isKeyPressed('right')) {
			this.vel.x += this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}
		
		// we manually update the movement as updateMovement function relies on a map to be loaded
		this.pos.add(this.vel);
		if (this.pos.x < 0 || this.pos.x > (me.video.getWidth() - this.width)) {
			this.pos.add(this.vel.negate());
		}

		// update animation if necessary
		this.parent(this);
		return true;
	},
});


/*
 * The main play screen
 * Here we had to use the internals of MelonJS as it is first intended to use a Map.
 * We wanted to leave the map creation for a more complex tutorials.
 */
var PlayScreen = me.ScreenObject.extend({

	init : function() {
		this.parent(true);
		me.debug.renderHitBox = true;	
	},

	/*
	 * This is the reset function when we change state (game state).
	 */
	onResetEvent : function() {
		// We need to reset a couple of things on state change: zorder and the HUD
		this.z=1;
		// we have to manually add th playern entity here
		me.game.add(new PlayerEntity(0, 400), 3);
		// sorting is necessary if you want to be able to "see" the player
		me.game.sort();
		me.audio.playTrack("music_game",true);
	},

	/*
	 * Every frame update this method is called
	 */
	update : function() {
		// Randomly add an ennemy
		if ((Math.random() * 100) > 95) {
			me.game.add(
					new AlienEntity(Math.random() * me.video.getWidth(), 0, this),
					3);
			me.game.sort();
			this.enemySpriteCount++;
			return true;
		}
		return false;
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
		me.audio.stopTrack();
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

