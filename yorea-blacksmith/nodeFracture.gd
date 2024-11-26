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
		dup.scale = Vector3(1.01, 1.01, 1.01)
		area.connect('body_entered', Callable(self, "_on_body_entered").bind(rig))
		area.connect('body_exited', Callable(self, "_on_body_entered").bind(rig))


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass

func _on_body_entered(body, rig):
	if body.get_parent().name == 'Hammer':
		print(body.linear_velocity.length())
		if body.get_parent().fastest > 30:
			rig.freeze = false
	if 'Node' in body.get_parent().get_name():
		print(body)

func _on_body_exited(body, rig):
	if 'Node' in body.get_parent().get_name() and body.globa_position.y < rig.global_position.y:
		rig.freezze = false
