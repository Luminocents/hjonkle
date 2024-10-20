extends Node2D

var music
var stream
var timer = Timer.new()
var strang
var sus = false

func _ready() -> void:
	strang = str(int($AnimatedSprite2D.get_parent().name.get_slice("key", 1)) + 1)
	stream = load("pianoKeySounds/" + strang + ".mp3")
	$AnimatedSprite2D.get_parent().add_child(timer)
	timer.timeout.connect(_on_timer_timeout)

func _process(delta: float) -> void:
	pass


func key_on(duration, velocity):
	music = AudioStreamPlayer2D.new()
	music.set_stream(stream)
	$AnimatedSprite2D.get_parent().add_child(music)
	
	$AnimatedSprite2D.animation = "on"
	music.volume_db = 0
	music.play()
	timer.start(duration)
	$AnimatedSprite2D.animation = "on"
	music.volume_db = -15 + (15 * velocity)

func _on_timer_timeout() -> void:
	$AnimatedSprite2D.animation = "off"
	if sus:
		var tween = create_tween()
		tween.tween_property(music, "volume_db", -80, 2)

func key_click():
	music = AudioStreamPlayer2D.new()
	music.set_stream(stream)
	$AnimatedSprite2D.get_parent().add_child(music)
	
	$AnimatedSprite2D.animation = "on"
	music.volume_db = 0
	music.play()
	
func key_clickOut():
	$AnimatedSprite2D.animation = "off"
	if sus:
		var tween = create_tween()
		tween.tween_property(music, "volume_db", -80, 2)

func sustain():
	if sus:
		sus = false
	else:
		sus = true

func _on_area_2d_input_event(viewport: Node, event: InputEvent, shape_idx: int) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed:
			if $AnimatedSprite2D.animation == "off":
				key_click()
			else:
				key_clickOut()
