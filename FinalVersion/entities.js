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
 * @subpackage Entities
 * 
 * @copyright (c) 2012 The Development Manager Ltd
 * @license GNU Public License
 * 
 * @author Laurent David <laurent@tdm.info>
 */


/*
 * A player entity
 * This entity is the player's spaceship
 * It can move horizontally only.
 */
var PlayerEntity = me.ObjectEntity.extend({

	init : function(x, y) {
		settings = {}
		settings.image = "spaceship01";
		settings.spritewidth = 100;
		settings.spriteheight = 100;
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
		
		if (me.input.isKeyPressed('fire')) {
			// launch a missile when fire pressed
			me.game.add(new MissileEntity(this.pos.x + this.width / 2,
					this.pos.y), 3);
			me.game.sort();
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
	/*
	 * Callback when the player loose a life
	 */
	removeLife : function() {
		life=me.game.HUD.getItemValue("life");
		life--;
		me.game.HUD.setItemValue("life",life);
		if (life<=0)
		{
			me.state.change(me.state.GAMEOVER);
		}
	}

});

/*
 * a missile entity
 * Goes up and disappear..
 */
var MissileEntity = me.ObjectEntity.extend({

	init : function(x, y) {
		settings = {}
		settings.image = "missile01";
		settings.spritewidth = 5;
		settings.spriteheight = 18;
		// specific "hand crafted" ENTITY type
		settings.type = MISSILE_ENTITY;
		settings.collidable = true;
		// call the constructor
		this.parent(x, y, settings);
		// set the speed
		this.setVelocity(0, -3);
	},
	update : function() {
		if (this.pos.y > 0) {
			this.vel.y += this.accel.y * me.timer.tick;
			this.pos.add(this.vel);
			// update animation if necessary
			this.parent(this);
			return true;

		} else {
			me.game.remove(this);
			return false;
		}

	}
});

/*
 * an alien entity
 * This is the entity that "reacts" to collision.
 */
var AlienEntity = me.ObjectEntity.extend({
	
	init : function(x, y) {
		settings = {}
		settings.image = "alien01";
		settings.spritewidth = 82;
		settings.spriteheight = 41;
		settings.type = me.game.ENEMY_OBJECT;
		settings.collidable = true;
		// call the constructor
		this.parent(x, y, settings);
		// set the speed
		this.setVelocity(0, 0.12);
		this.setMaxVelocity(0, 1);
	},
	update : function() {
		collideres = me.game.collide(this);
		// Check the collision and acts on it.
		// might be an idea to put the collision code in the player
		if (collideres) {
			if (collideres.obj.type == MISSILE_ENTITY) {
				me.game.remove(this);
				return false;
			} else if (collideres.obj.type == PLAYER_ENTITY) {
				collideres.obj.removeLife();
				collideres.obj.flicker(30);
				me.game.remove(this);
				return false;
			}
		}
		arraycoord= alienUpdatePosition (this.pos.x, this.pos.y,this.vel.x,this.vel.y);
		this.vel.x= arraycoord["vx"];
		this.vel.y= arraycoord["vy"];
		this.pos.x= arraycoord["x"];
		this.pos.y= arraycoord["y"];
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
