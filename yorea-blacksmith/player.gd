extends CharacterBody3D

const SPEED = 5.0
var looking_at = false
var looking_pos = [0, 0, 0]
var holding = false
const JUMP_VELOCITY = 0.1
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

@export var acceleration = 12
@export var gravity = -10.0
@export var sensitivity = 0.002
@onready var neck := $Neck
@onready var camera := $Neck/Camera3D
@onready var marker = $Neck/Camera3D/Marker3D
@onready var rayCast = $Neck/Camera3D/RealArm
@onready var initialHeight = camera.position.y
@onready var crouchHeight = initialHeight / 20

func _ready() -> void:
	rayCast.add_exception($".")

# Mouse movement
func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	elif event.is_action_pressed("ui_cancel"):
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
	if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		if event is InputEventMouseMotion:
			mouseMovement = true
			relX = -event.relative.x
			relY = -event.relative.y
			if !lockTurn:
				if holding:
					holding.linear_velocity = Vector3(0, 0, 0)
					holding.angular_velocity = Vector3(0, 0, 0)
				neck.rotate_y(-event.relative.x * sensitivity)
				camera.rotate_x(-event.relative.y * sensitivity)
				camera.rotation.x = clamp(camera.rotation.x, deg_to_rad(-70), deg_to_rad(90))
	#			Rotate things attatched to character
				#for child in $Neck/Bean.get_children():
					#child.rotate_x(-event.relative.y * 0.01)
					#child.rotation.x = clamp(camera.rotation.x, deg_to_rad(-70), deg_to_rad(90))
		else:
			mouseMovement = false

func _physics_process(delta: float) -> void:
	if Input.is_action_just_pressed("mouse2"):
		rightClickHeld = true
	if Input.is_action_just_released("mouse2"):
		rightClickHeld = false
	# Holding Physics
	if holding:
		var target = marker.global_position
		var distance = (holding.global_position - marker.global_transform.origin).normalized()
		var distance_to_target = (holding.global_position - marker.global_transform.origin).length()
		var threshold = 0.1
		var min_speed = -5.0    # Minimum speed at the target
		
		# Calculate speed based on distance
		print(distance_to_target)
		var speed = lerp(SPEED, min_speed, -distance_to_target)
		
		if distance_to_target < 0.01:
			holding.linear_velocity = Vector3(0, 0, 0)
		else:
			holding.linear_velocity = lerp(-distance, distance * speed, -distance_to_target)
			
		#holding.look_at($".".global_position)
			
		# Turn Held Item
		if rightClickHeld:
			lockTurn = true
			holding.rotate_y(-relX * (sensitivity))
			holding.rotate_x(-relY * (sensitivity))
		else:
			lockTurn = false
		
	# Grabbing Code
	if rayCast.get_collider():
		looking_at = rayCast.get_collider()
		looking_pos = rayCast.get_collision_point()
	else:
		looking_at = false
	
	# If looking at an item, left click, are not currently holding an item, and item is a rigid body
	if looking_at and Input.is_action_just_pressed("mouse1") and !holding and looking_at.get_class() == "RigidBody3D":
		if looking_at.freeze == true:
			return
		holding = looking_at
		holding.gravity_scale = 0
		holding.linear_velocity = Vector3(0, 0, 0)
		marker.global_position = looking_pos
	
	# On release of left click and you are holding an item
	if Input.is_action_just_released("mouse1") and holding:
		holding.linear_velocity = Vector3(0, 0, 0)
		holding.angular_velocity = Vector3(0, 0, 0)
		holding.gravity_scale = 1
		holding = false
		looking_at = false
		
	# Jump Buffer & Jump
	if Input.is_action_just_pressed("jump") and !is_on_floor():
		jumpBuffer = true
	if is_on_floor():
		if Input.is_action_just_pressed("jump") or jumpBuffer:
			velocity.y = JUMP_VELOCITY / delta
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
	var input_dir := Input.get_vector("left", "right", "forward", "back")
	if jumped:
		input_dir = Vector2(0, -1)
	var direction = (neck.transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	if direction:
		if is_on_floor():
			# Smooths Movement
			if jumped and acceleration_z > 4.5:
				velocity.z = direction.z * acceleration_z
				acceleration_z = lerpf(acceleration_x, 20, acceleration * delta)
			if direction[0]:
				velocity.x = direction.x * acceleration_x
				acceleration_x = lerpf(acceleration_x, SPEED, acceleration * delta)
			if direction[2]:
				velocity.z = direction.z * acceleration_z
				acceleration_z = lerpf(acceleration_z, SPEED, acceleration * delta)
			jumped = false
	elif !direction and is_on_floor():
		velocity.x = lerpf(velocity.x, 0, acceleration * delta)
		velocity.z = lerpf(velocity.z, 0, acceleration * delta)
		acceleration_x = 0
		acceleration_z = 0
	
	# Gravity
	velocity.y += gravity * delta
	
	move_and_slide()


# the node that you want to move, and where you want to move the node
func move_node(node, new_parent): 
	node.get_parent().remove_child(node)
	new_parent.add_child(node)
	node.linear_velocity = Vector3(0, 0, 0)
