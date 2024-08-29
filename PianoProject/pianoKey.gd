extends Node2D

var music = AudioStreamPlayer2D.new()
var timer = Timer.new()
var fading = false
var strang
var noteDuration

func _ready() -> void:
	strang = str(int($AnimatedSprite2D.get_parent().name.get_slice("key", 1)) + 1)
	var stream = load("pianoKeySounds/" + strang + ".mp3")
	music.set_stream(stream)
	music.max_polyphony = 2
	$AnimatedSprite2D.get_parent().add_child(music)
	$AnimatedSprite2D.get_parent().add_child(timer)
	timer.timeout.connect(_on_timer_timeout)

func _process(delta: float) -> void:
	pass
	#if fading:
		#music.volume_db += -.01 * noteDuration - .01
		#
		#if music.volume_db <= -80:
			#fading = false


func key_on(duration, velocity):
	$AnimatedSprite2D.animation = "on"
	music.volume_db = -15 + (15 * velocity)
	noteDuration = duration
	music.play()
	timer.start(duration)
	

func _on_timer_timeout() -> void:
	$AnimatedSprite2D.animation = "off"
	fading = true

func key_click():
	$AnimatedSprite2D.animation = "on"
	music.volume_db = 0
	print(strang)
	music.play()
	
func key_clickOut():
	$AnimatedSprite2D.animation = "off"
	fading = true

func _on_area_2d_input_event(viewport: Node, event: InputEvent, shape_idx: int) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed:
			if $AnimatedSprite2D.animation == "off":
				key_click()
			else:
				key_clickOut()
