extends Node3D

var rigs = []
var pieces = 10

@onready var staticEnv = get_tree().get_root().get_node("Main/Static Environment")

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	for rig in self.get_children():
		if rig.get_class() != 'RigidBody3D':
			return
		rig.freeze = true
		rigs.append(rig)
		var area = Area3D.new()
		var dup = rig.get_child(0).duplicate()
		area.add_child(dup)
		rig.add_child(area)
		rig.scale = Vector3(1.002, 1.002, 1.002)
		dup.scale = Vector3(1.01, 1.01, 1.01)
		area.connect('body_entered', Callable(self, "_on_body_entered").bind(rig))

func _on_body_entered(body, rig):
	if body.get_parent().name == 'Hammer':
		if body.get_parent().fastest > 20 and rig.freeze == true and pieces > 5:
			rig.freeze = false
			rig.call_deferred("reparent", staticEnv)
			body.linear_velocity = Vector3.ZERO
			pieces -= 1
	if pieces <= 5:
		for tRig in rigs:
			tRig.freeze = false
			tRig.call_deferred("reparent", staticEnv)
		self.queue_free()
