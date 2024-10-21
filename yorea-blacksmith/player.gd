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

var bestSpeed = 0

@onready var hammerNode = $"../Hammer"
@onready var neck := $Neck
@onready var camera := $Neck/Camera3D
@onready var marker = $Neck/Camera3D/Marker3D
@onready var rayCast = $Neck/Camera3D/RealArm
@onready var initialHeight = camera.position.y
@onready var crouchHeight = initialHeight / 20
@export var hammerGrabButton = "b"
@export var acceleration = 12
@export var gravity = -10.0
@export var sensitivity = 0.002

func _ready() -> void:
	rayCast.add_exception($".")
	Input.use_accumulated_input = true
	set_physics_process(true)

# Mouse movement
func _unhandled_input(event: InputEvent) -> void:
	if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		if event is InputEventMouseMotion:
			neck.rotate_y(-event.relative.x * sensitivity)
			camera.rotate_x(-event.relative.y * sensitivity)
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
			hammerNode.hammer.set_collision_mask_value(1, false)
			hammerNode.hammer.set_collision_mask_value(2, true)
			hammerNode.gravity = 1
			hammerNode.mass = 1
			hammerNode.thrown = false
			holding_pinB = looking_at.get_parent().get_child(2)
		else:
			holding_pinB = looking_at
			holding_pinB.set_collision_mask_value(1, false)
			holding_pinB.set_collision_mask_value(2, true)
			holding_pinB.gravity_scale = 1
			holding_pinB.mass = 1
		
		if looking_at.freeze == true:
			return
		holding = looking_at
		marker.global_position = looking_pos
	
	# On release of left click and you are holding an item
	if Input.is_action_just_released("mouse1") and holding:
		holding = false
		if holding_pinB.get_parent().name == "Hammer":
			hammerNode.hammer.set_collision_mask_value(1, true)
			hammerNode.hammer.set_collision_mask_value(2, false)
			hammerNode.gravity = 8
			hammerNode.mass = 5
			hammerNode.thrown = true
		else:
			holding_pinB.set_collision_mask_value(1, true)
			holding_pinB.set_collision_mask_value(2, false)
			holding_pinB.gravity_scale = 3
			holding_pinB.mass = 1
		holding_pinB = false
	
	# Holding Physics
	if holding:
		var distance = (holding_pinB.global_position - marker.global_transform.origin).normalized()
		var distance_to_target = (holding_pinB.global_position - marker.global_transform.origin).length()
		var min_speed = -SPEED	# Minimum speed at the target
		if holding_pinB.linear_velocity.length() <= 4 and distance_to_target >= 1:
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
	print(bhop)
	if bhop:
		tempSpeed = SPEED * SPEED
		bhop = false
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
	
	move_and_slide()


# the node that you want to move, and where you want to move the node
func move_node(node, new_parent): 
	node.get_parent().remove_child(node)
	new_parent.add_child(node)
	node.linear_velocity = Vector3.ZERO
