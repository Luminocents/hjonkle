extends Node3D


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	for shape in self.get_children():
		var area = Area3D.new()
		var dup = shape.duplicate()
		area.add_child(dup)
		add_child(area)
		area.body_entered.connect(_on_body_entered)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass

func _on_body_entered(body):
	if body.get_parent().name == 'Hammer':
		print(body)
