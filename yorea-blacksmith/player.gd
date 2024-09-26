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
var rayCast
var spring

@export var acceleration = 12
@export var gravity = -10.0
@export var sensitivity = 0.002
@onready var neck := $Neck
@onready var camera := $Neck/Camera3D

func _ready() -> void:
	spring = $Neck/Camera3D/SpringArm3D
	rayCast = $Neck/Camera3D/RealArm
	rayCast.add_exception($".")

# Mouse movement
func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	elif event.is_action_pressed("ui_cancel"):
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
	if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		if event is InputEventMouseMotion:
			neck.rotate_y(-event.relative.x * sensitivity)
			camera.rotate_x(-event.relative.y * sensitivity)
			camera.rotation.x = clamp(camera.rotation.x, deg_to_rad(-70), deg_to_rad(90))
#			Rotate things attatched to character
			#for child in $Neck/Bean.get_children():
				#child.rotate_x(-event.relative.y * 0.01)
				#child.rotation.x = clamp(camera.rotation.x, deg_to_rad(-70), deg_to_rad(90))

func _physics_process(delta: float) -> void:
	print(looking_pos)
	if rayCast.get_collider() and !holding:
		looking_at = rayCast.get_collider()
		looking_pos = rayCast.get_collision_point()
	# Grabbing Code
	if looking_at and Input.is_action_just_pressed("mouse1") and !holding and !looking_at.freeze:
		pass
		holding = looking_at
		var interact = $Neck/Camera3D/InteractPos
		interact.global_position = looking_pos
		spring.global_position = looking_pos
		move_node(holding, $Neck/Camera3D/SpringArm3D)
	if Input.is_action_just_released("mouse1") and holding:
		pass
		var orgPos = holding.global_position
		var orgRot = holding.global_rotation
		move_node(holding, $"..")
		holding.global_position = orgPos
		holding.global_rotation = orgRot
		holding = false
		looking_at = false
		
		#	Jump Buffer & Jump
	if Input.is_action_just_pressed("jump") and !is_on_floor():
		jumpBuffer = true
	if is_on_floor():
		if Input.is_action_just_pressed("jump") or jumpBuffer:
			velocity.y = JUMP_VELOCITY / delta
			jumped = true
			jumpBuffer = false
#	Movement Inputs
	var input_dir := Input.get_vector("left", "right", "forward", "back")
	if jumped:
		input_dir = Vector2(0, -1)
	var direction = (neck.transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	if direction:
		if is_on_floor():
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
	
	velocity.y += gravity * delta
	
	move_and_slide()



func move_node(node, new_parent): # node - the node that you want to move, new_parent - where you want to move the node
	node.linear_velocity = Vector3(0, 0, 0)
	node.get_parent().remove_child(node)
	new_parent.add_child(node)
