extends CharacterBody3D

const SPEED = 5.0
var looking_at = false
var looking_pos = [0, 0, 0]
var holding = false
var holding_pinB = false
const JUMP_VELOCITY = 5.0
var acceleration_x = 0
var acceleration_z = 0
var jumpBuffer = false
var jumped = false
var rightClickHeld = false
var lockTurn = false
var relX = 0
var relY = 0
var crouching = false
var holdingCollision = false
var mouseMovement = false
var currentFrame = 0
var bhop = false
var tempSpeed = SPEED
var realStrength = 100
var strength
var orMass = 1

var bestSpeed = 0

@onready var hammerNode = $"../Hammer"
@onready var neck := $Neck
@onready var camera := $Neck/Camera3D
@onready var marker = $Neck/Camera3D/Marker3D
@onready var rayCast = $Neck/Camera3D/RealArm
@onready var initialHeight = camera.position.y
@onready var crouchHeight = initialHeight / 20
@onready var main = self.get_parent()
@export var hammerGrabButton = "b"
@export var acceleration = 12
@export var gravity = -10.0
@export var sensitivity = 0.002

func _ready() -> void:
	rayCast.add_exception($".")
	Input.use_accumulated_input = true
	set_physics_process(true)
	
	strength = 100 / realStrength

# Mouse movement
func _unhandled_input(event: InputEvent) -> void:
	if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		if event is InputEventMouseMotion:
			var tempSens = sensitivity / orMass
			neck.rotate_y(-event.relative.x * tempSens)
			camera.rotate_x(-event.relative.y * tempSens)
			camera.rotation.x = clamp(camera.rotation.x, deg_to_rad(-70), deg_to_rad(120))
	#		Rotate things attatched to character
			#for child in $Neck/Bean.get_children():
				#child.rotate_x(-event.relative.y * 0.01)
				#child.rotation.x = clamp(camera.rotation.x, deg_to_rad(-70), deg_to_rad(90))

# Physics
func _physics_process(delta: float) -> void:
	# Right Click
	if Input.is_action_just_pressed("mouse2"):
		rightClickHeld = true
	if Input.is_action_just_released("mouse2"):
		rightClickHeld = false
	
	# Initial Grab Code
	if rayCast.get_collider():
		looking_at = rayCast.get_collider()
		looking_pos = rayCast.get_collision_point()
	else:
		looking_at = false
	
	# If looking at an item, left click, are not currently holding an item, and item is a rigid body
	if looking_at and Input.is_action_just_pressed("mouse1") and !holding and looking_at.get_class() == "RigidBody3D":
		if looking_at.get_parent().name == "Hammer":
			hammerNode.holding = true
			hammerNode.mass = strength
			hammerNode.thrown = false
			holding_pinB = looking_at.get_parent().get_child(2)
		else:
			main.thrown = false
			holding_pinB = looking_at
			orMass = holding_pinB.mass / realStrength
			holding_pinB.set_collision_layer_value(1, false)
			holding_pinB.set_collision_layer_value(2, true)
		
		if looking_at.freeze == true:
			return
		holding = looking_at
		marker.global_position = looking_at.global_position
	
	# On release of left click and you are holding an item
	if Input.is_action_just_released("mouse1") and holding:
		holding = false
		if holding_pinB.get_parent().name == "Hammer":
			hammerNode.holding = false
			hammerNode.hammer.set_collision_layer_value(1, true)
			hammerNode.hammer.set_collision_layer_value(2, false)
			holding_pinB.gravity_scale = 1
			hammerNode.mass = 5
			hammerNode.thrown = true
		else:
			main.throwNode = holding_pinB
			print(holding_pinB.mass)
			main.thrown = true
			holding_pinB.set_collision_layer_value(1, true)
			holding_pinB.set_collision_layer_value(2, false)
			holding_pinB.gravity_scale = 1
			holding_pinB.mass = orMass
		orMass = 1
		holding_pinB = false
	
	# Holding Physics
	if holding:
		var distance = (holding_pinB.global_position - marker.global_transform.origin).normalized()
		var distance_to_target = (holding_pinB.global_position - marker.global_transform.origin).length()
		var min_speed = -SPEED	# Minimum speed at the target
		if holding_pinB.linear_velocity.length() <= 4 and distance_to_target >= 1.5:
			holding = false
		
		# Calculate speed based on distance
		var speed = lerp(SPEED, min_speed, -distance_to_target)
		if distance_to_target < 0.01 && holding_pinB:
			holding_pinB.gravity_scale = 0
			holding_pinB.linear_velocity = lerp(-distance, distance * speed, -distance_to_target) / speed
		else:
			holding_pinB.gravity_scale = 1
			holding_pinB.linear_velocity = lerp(-distance, distance * speed, -distance_to_target)
	
	# Jump Buffer & Jump
	if Input.is_action_just_pressed("jump") and !is_on_floor():
		currentFrame = Engine.get_physics_frames()
		jumpBuffer = true
		bhop = true
	if is_on_floor():
		if hammerNode.thrown:
			hammerNode.flying = false
			hammerNode.thrown = false
		if jumpBuffer and Engine.get_physics_frames() - currentFrame < 10:
			velocity.y = JUMP_VELOCITY + JUMP_VELOCITY * delta
			jumped = true
			jumpBuffer = false
		elif Input.is_action_just_pressed("jump"):
			velocity.y = JUMP_VELOCITY + JUMP_VELOCITY * delta
			
			jumped = true
			jumpBuffer = false
	
	# Crouching
	if Input.is_action_just_pressed("crouch"):
		$PlayerShape.disabled = true
		crouching = true
	if Input.is_action_just_released("crouch"):
		$PlayerShape.disabled = false
		crouching = false
	if crouching:
		camera.position.y = lerpf(camera.position.y, crouchHeight, acceleration * delta)
	elif camera.position.y < initialHeight:
		camera.position.y = lerpf(camera.position.y, initialHeight, acceleration * delta)
	
#	Movement Inputs
	var input_dir := Vector3.ZERO
	input_dir.x = Input.get_axis("left", "right")
	input_dir.z = Input.get_axis("forward", "back")
	input_dir = input_dir.limit_length(1.0)
	input_dir.y = velocity.y
	var direction = (neck.transform.basis * Vector3(input_dir.x, 0, input_dir.z)).normalized()
	# Jump Stuff
	if bhop:
		tempSpeed = SPEED * SPEED
		bhop = false
	tempSpeed = tempSpeed / orMass
	if is_on_floor() and direction:
		if direction[0]:
			velocity.x = lerpf(velocity.x, tempSpeed * direction[0], acceleration * delta)
		if direction[2]:
			velocity.z = lerpf(velocity.z, tempSpeed * direction[2], acceleration * delta)
		tempSpeed = SPEED
	elif !is_on_floor() and direction:
		if direction[0]:
			velocity.x = lerpf(velocity.x, tempSpeed * direction[0], 1 * delta)
		if direction[2]:
			velocity.z = lerpf(velocity.z, tempSpeed * direction[2], 1 * delta)
		tempSpeed = SPEED
	# Smooths Movement
	elif !direction and is_on_floor() and !bhop:
		velocity.x = lerpf(velocity.x, 0, acceleration * delta)
		velocity.z = lerpf(velocity.z, 0, acceleration * delta)
	
	# Gravity
	velocity.y += gravity * delta
	_push_away_rigid_bodies()
	
	move_and_slide()


# the node that you want to move, and where you want to move the node
func move_node(node, new_parent): 
	node.get_parent().remove_child(node)
	new_parent.add_child(node)
	node.linear_velocity = Vector3.ZERO

# CC0/public domain/use for whatever you want no need to credit
# Call this function directly before move_and_slide() on your CharacterBody3D script
func _push_away_rigid_bodies():
	for i in get_slide_collision_count():
		var c := get_slide_collision(i)
		if c.get_collider() is RigidBody3D and c.get_collider().get_child(1).get_name() == 'light':
			var push_dir = -c.get_normal()
			# How much velocity the object needs to increase to match player velocity in the push direction
			var velocity_diff_in_push_dir = self.velocity.dot(push_dir) - c.get_collider().linear_velocity.dot(push_dir)
			# Only count velocity towards push dir, away from character
			velocity_diff_in_push_dir = max(0., velocity_diff_in_push_dir)
			# Objects with more mass than us should be harder to push. But doesn't really make sense to push faster than we are going
			const MY_APPROX_MASS_KG = 80.0
			var mass_ratio = min(1., MY_APPROX_MASS_KG / c.get_collider().mass)
			# Optional add: Don't push object at all if it's 4x heavier or more
			if mass_ratio < 0.25:
				continue
			# Don't push object from above/below
			push_dir.y = 0
			# 5.0 is a magic number, adjust to your needs
			var push_force = mass_ratio * 1.0
			c.get_collider().apply_impulse(push_dir * velocity_diff_in_push_dir * push_force, c.get_position() - c.get_collider().global_position)
