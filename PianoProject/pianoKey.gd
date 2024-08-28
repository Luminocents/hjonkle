extends Node2D

var fading = false
var strang
var keySound

func _ready() -> void:
	strang = str(int($AnimatedSprite2D.get_parent().name.get_slice("key", 1)) + 1)
	keySound = load("pianoKeySounds/" + strang + ".mp3")
	$keySound.stream = keySound

func _process(delta: float) -> void:
	if fading:
		$keySound.volume_db += -60*delta
		
		if $keySound.volume_db <= -60:
			fading = false


func key_on(duration):
	$AnimatedSprite2D.animation = "on"
	$keySound.play()
	$keyTimer.start(duration)

func _on_key_timer_timeout() -> void:
	$AnimatedSprite2D.animation = "off"
	fading = true

func key_click():
	$AnimatedSprite2D.animation = "on"
	$keySound.volume_db = 0
	$keySound.play()
	
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
