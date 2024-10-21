extends Node3D

var holding_at_pos = [0, 0, 0]
var holding = false
var holding_at
var holding_pinB = false
var trigger = false
var SPEED = 5.0

@onready var hammerNode = $"../../Hammer"
@onready var marker = $RHammerSpot

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
	# Holding Physics
	if holding:
		var distance = (holding_pinB.global_position - marker.global_transform.origin).normalized()
		var distance_to_target = (holding_pinB.global_position - marker.global_transform.origin).length()
		var min_speed = -5.0    # Minimum speed at the target
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

func _on_r_hammer_spot_body_entered(body: Node3D) -> void:
	pass # Replace with function body.
	if body.get_class() == "RigidBody3D" and body.name != "Player" or "Vrplayer":
		holding_at = body
		holding_at_pos = holding_at.global_position
		print(body)


func _on_r_hammer_spot_body_exited(body: Node3D) -> void:
	if body == holding_at:
		holding_at = null

func _on_button_pressed(name: String) -> void:
	# If looking at an item, left click, are not currently holding an item, and item is a rigid body
	if holding_at and !holding and holding_at.get_class() == "RigidBody3D" and name == "trigger_click":
		if holding_at.get_parent().name == "Hammer":
			hammerNode.hammer.set_collision_mask_value(1, false)
			hammerNode.hammer.set_collision_mask_value(2, true)
			hammerNode.gravity = 1
			hammerNode.mass = 1
			hammerNode.thrown = false
			holding_pinB = holding_at.get_parent().get_child(2)
		else:
			holding_pinB = holding_at
			holding_pinB.set_collision_mask_value(1, false)
			holding_pinB.set_collision_mask_value(2, true)
			holding_pinB.gravity_scale = 1
			holding_pinB.mass = 1
		
		if holding_at.freeze == true:
			return
		holding = holding_at
		marker.global_position = holding_at_pos
		
	if holding_at and !holding and holding_at.get_class() == "RigidBody3D" and name == "grip_click":
		if holding_at.get_parent().name == "Hammer":
			hammerNode.hammer.set_collision_mask_value(1, false)
			hammerNode.hammer.set_collision_mask_value(2, true)
			hammerNode.gravity = 1
			hammerNode.mass = 1
			hammerNode.thrown = false
			holding_pinB = holding_at.get_parent().get_child(0)
		else:
			holding_pinB = holding_at
			holding_pinB.set_collision_mask_value(1, false)
			holding_pinB.set_collision_mask_value(2, true)
			holding_pinB.gravity_scale = 1
			holding_pinB.mass = 1
			
		if holding_at.freeze == true:
			return
		holding = holding_at
		marker.global_position = holding_at_pos


func _on_button_released(name: String) -> void:
	# On release of left click and you are holding an item
	if (name == "grip_click" or name == "trigger_click") and holding:
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
