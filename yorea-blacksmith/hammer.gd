extends Node3D

var SPEED = 5.0
var flying = false
var thrown = false
var bring = false
var floating = false
var gravity = 8
var mass = 5
var initialDistance = 0
var playerNode
var hammer
var hammerSpot
var hammerHandle
var holding = false

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if flying and playerNode.is_on_floor():
		flying = false
		mass = 5
	if Input.is_action_just_pressed("b") and !flying and !playerNode.holding:
		bring = true
		thrown = false
		var new_transform = hammerHandle.transform.looking_at(hammerSpot.transform.origin, Vector3.UP)
		hammerHandle.transform = hammerHandle.transform.interpolate_with(new_transform, 25 * delta)
	elif Input.is_action_pressed("b") and flying and !playerNode.holding:
		thrown = false
		floating = true
		bring = true
		
	
	if floating:
		hammer.linear_velocity = lerp(playerNode.velocity, -Vector3.UP, SPEED * delta)
		hammerHandle.linear_velocity = lerp(playerNode.velocity, -Vector3.UP, SPEED * delta)
		playerNode.velocity = lerp(playerNode.velocity, -Vector3.UP, SPEED * delta)
	
	if bring:
		if !flying:
			hammer.angular_velocity = Vector3.ZERO
			hammerHandle.angular_velocity = Vector3.ZERO
		else:
			bring = false
		var distance = (hammer.global_position - hammerSpot.global_transform.origin).normalized()
		var distance_to_target = (hammer.global_position - playerNode.global_transform.origin).length()
		
		hammer.linear_velocity = lerp(-distance, (distance * SPEED * SPEED) * delta, -distance_to_target)
		
		if distance_to_target < 2.5 and !flying:
			bring = false
		
	
	#Flying and Thrown Physics
	if thrown:
		if abs(hammer.linear_velocity.x) > 30 or abs(hammer.linear_velocity.z) > 30 or flying:
			flying = true
			mass = 5
			var distance = (playerNode.global_position - hammer.global_transform.origin).normalized()
			var distance_to_target = (playerNode.global_position - hammer.global_transform.origin).length()
			
			# Calculate speed based on distance
			playerNode.velocity = lerp(-distance, distance * 10, -distance_to_target)
		else:
			flying = false
			mass = 5
	if (snappedf(hammer.linear_velocity.y, 0.05) == 0) and (snappedf(hammer.angular_velocity.length(), 0.05) == 0) and !holding and !bring:
		flying = false
		mass = 100
	
	if floating:
		mass = 1
		floating = false
	
	hammer.gravity_scale = gravity
	hammer.mass = mass
#If the hammer takes too long to return, teleport behind the player
func _on_timer_timeout() -> void:
	pass # Replace with function body.
