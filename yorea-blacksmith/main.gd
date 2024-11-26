extends Node3D

var interface
var once = false
var thrown = false
var playerPos = Vector3.ZERO
var playerRot = Vector3.ZERO
var player
var throwNode

@onready var hammerNode = $"Hammer"

var arr = ["event1", "event2", "event3", "event4"]

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	interface = load("res://Player.tscn")
	add_child(interface.instantiate())
	
	player = $"Player"
	hammerNode.playerNode = player
	hammerNode.hammer = $Hammer/RigidBody3D
	hammerNode.hammerSpot = $"Player/Neck/Camera3D/HammerSpot"
	hammerNode.hammerHandle = $Hammer.get_child(2)
	
	


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if Input.is_action_just_released("ui_cancel"):
		if $Pause.visible:
			Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
			$Pause.visible = false
		else:
			Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
			$Pause.visible = true
	
	
	
	#if thrown:
		#var throwMass = throwNode.mass
		#var strength = player.realStrength
		#print(throwMass)
		#if snappedf(throwNode.linear_velocity.length(), 0.05) > 0.05:
			#throwNode.linear_velocity = throwNode.linear_velocity / throwMass
			#thrown = false
		#
		#if (snappedf(throwNode.linear_velocity.y, 0.05) == 0) and (snappedf(throwNode.angular_velocity.length(), 0.05) == 0):
			#throwNode.mass = throwMass


func _on_desktop_pressed() -> void:
	$Pause/VR.visible = true
	$Pause/Desktop.visible = false
	
	remove_child(interface)
	interface.queue_free()
	
	hammerNode.playerNode = $"Player"
	hammerNode.hammerSpot = $"Player/Neck/Camera3D/HammerSpot"

func _on_vr_pressed() -> void:
	$Pause/VR.hide()
	$Pause/Desktop.show()
	
	var VR = load("res://addons/godot-xr-tools/xr/start_xr.tscn").instantiate()
	add_child(VR)
	
	interface = load("res://vrplayer.tscn").instantiate()
	if !get_node("Player/Neck/Vrplayer"):
		get_node("Player/Neck").add_child(interface)
	hammerNode.player = $"Vrplayer"
