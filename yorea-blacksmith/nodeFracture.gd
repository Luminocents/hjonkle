extends Node3D


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	for rig in self.get_children():
		if rig.get_class() != 'RigidBody3D':
			return
		rig.freeze = true
		var area = Area3D.new()
		var dup = rig.get_child(0).duplicate()
		area.add_child(dup)
		rig.add_child(area)
		area.connect('body_entered', Callable(self, "_on_body_entered").bind(rig))


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass

func _on_body_entered(body, rig):
	print(rig)
	if body.get_parent().name == 'Hammer':
		print(body.linear_velocity.length())
		if body.get_parent().fastest > 30:
			rig.freeze = false
