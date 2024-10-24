extends Node2D

var nopes = {}
var time_accuracy = .1
var timerStart = true
var timer = 0

func _process(delta: float) -> void:
	if timerStart:
		timer += 1 * delta

func _ready():
	OS.open_midi_inputs()

func add_note_to_main_array(nope):
	var time = str(snapped(nope["time"], time_accuracy))
	
	if !nopes.has(time):
		nopes[time] = []
	
	nopes[time].append([nope["midi"], nope["duration"], nope["velocity"], false])

func play_notes(nopes):
	for nope in nopes:
		var nope_number = str(nope[0] - 21)
		var duration = nope[1]
		var velocity = nope[2]
		
		if !nope[3]:
			get_node("key" + nope_number).key_on(duration, velocity)

func _on_timer_timeout():
	var temp = str(snapped(timer, time_accuracy))
	if nopes.has(temp):
		play_notes(nopes[temp])

func _on_turkey_button_pressed():
	var file = FileAccess.open("res://audio/turkish.txt", FileAccess.READ)
	var text = file.get_as_text()
	var music_json = JSON.new()
	music_json = JSON.parse_string(text)
	file.close()
	$Music.stream = load("res://audio/Turkish.mp3")
	start_music(music_json)

func _on_moon_button_pressed():
	nopes = {}
	var file = FileAccess.open("res://audio/moon.txt", FileAccess.READ)
	var text = file.get_as_text()
	var music_json = JSON.new()
	music_json = JSON.parse_string(text)
	file.close()
	$Music.stream = load("res://audio/Moony3rd.mp3")
	start_music(music_json)

func _on_ocarina_button_pressed():
	nopes = {}
	var file = FileAccess.open("res://audio/Ocarina.txt", FileAccess.READ)
	var text = file.get_as_text()
	var music_json = JSON.new()
	music_json = JSON.parse_string(text)
	file.close()
	$Music.stream = load("res://audio/occyWoccy.ogg")
	start_music(music_json)
	
func _on_e_button_pressed():
	nopes = {}
	var file = FileAccess.open("res://audio/rushE.txt", FileAccess.READ)
	var text = file.get_as_text()
	var music_json = JSON.new()
	music_json = JSON.parse_string(text)
	file.close()
	$Music.stream = load("res://audio/rushE.mp3")
	start_music(music_json)

func start_music(music_json):
	nopes = {}
	for track in music_json["tracks"]:
		for nope in track["notes"]:
			add_note_to_main_array(nope)
	timerStart = true
	timer = 0
	$Music.volume_db = -100
	$Timer.start(time_accuracy)
	
	if nopes.has("0"):
		play_notes(nopes["0"])


func _input(input_event):
	if input_event is InputEventMIDI:
		_print_midi_info(input_event)

func _print_midi_info(midi_event):
	var key = midi_event.pitch - 21
	var state = int(midi_event.message)
	var note = "err"
	var notes = ["A", "A#", "B", "C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
	"C", "C#", "D","D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"]
	if key >= 0 or key <= 87 and key % 1 != 0:
		if state == 9:
			note = notes[key]
			$Label.text = str(note)
			key = str(midi_event.pitch - 21)
			get_node("key" + key).key_click()
		else:
			note = notes[key]
			key = str(midi_event.pitch - 21)
			get_node("key" + key).key_clickOut()


func _on_sustain_pressed() -> void:
	for nope in 88:
		var nope_number = str(nope)
		get_node("key" + nope_number).sustain()
