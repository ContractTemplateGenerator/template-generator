"""Configuration settings and voice presets for Tough Love Wellness Bot"""

import json
from enum import Enum
from typing import Dict, List

class VoicePreset(Enum):
    GORDON_RAMSAY = "gordon_ramsay"
    JOAN_RIVERS = "joan_rivers"
    SASSY_BFF = "sassy_bff"
    DRILL_SERGEANT = "drill_sergeant"
    PASSIVE_AGGRESSIVE_MOM = "passive_aggressive_mom"

class IntensityLevel(Enum):
    GENTLE = 1
    MEDIUM = 2
    SAVAGE = 3

VOICE_CHARACTERISTICS = {
    VoicePreset.GORDON_RAMSAY: {
        "name": "Gordon Ramsay",
        "description": "Explosive chef energy with British flair",
        "catchphrases": ["You muppet!", "Bloody hell!", "Get it together!", "This is a disaster!", "Raw!"],
        "style": "aggressive, professional, passionate"
    },
    VoicePreset.JOAN_RIVERS: {
        "name": "Joan Rivers",
        "description": "Glamorous, sharp-tongued comedy legend",
        "catchphrases": ["Can we talk?", "Oh please!", "Seriously?", "Grow up!", "Let's be honest here..."],
        "style": "witty, glamorous, brutally honest"
    },
    VoicePreset.SASSY_BFF: {
        "name": "Sassy Best Friend",
        "description": "Your ride-or-die friend who tells it like it is",
        "catchphrases": ["Honey, no.", "Girl, please.", "We need to talk.", "Bless your heart.", "I'm just saying..."],
        "style": "supportive but real, modern slang, sisterly"
    },
    VoicePreset.DRILL_SERGEANT: {
        "name": "Drill Sergeant",
        "description": "Military precision meets motivational intensity",
        "catchphrases": ["Drop and give me twenty!", "No excuses!", "Move it!", "Yes sir/ma'am!", "Hoorah!"],
        "style": "commanding, disciplined, no-nonsense"
    },
    VoicePreset.PASSIVE_AGGRESSIVE_MOM: {
        "name": "Passive-Aggressive Mom",
        "description": "Loving but guilt-inducing maternal energy",
        "catchphrases": ["I'm not mad, just disappointed.", "If you say so, dear.", "That's... interesting.", "Whatever makes you happy.", "I suppose..."],
        "style": "caring but judgmental, guilt-inducing, maternal"
    }
}

DEFAULT_SETTINGS = {
    "voice_preset": VoicePreset.SASSY_BFF.value,
    "intensity_level": IntensityLevel.MEDIUM.value,
    "consent_given": False,
    "kindness_mode": False,
    "daily_reminders": True,
    "emergency_mode_enabled": True,
    "personal_triggers": [],
    "unlocked_levels": 1,
    "streak_count": 0,
    "total_workouts": 0,
    "weight_goal": None,
    "current_weight": None,
    "starting_weight": None
}

FEATURE_SETTINGS = {
    "weigh_in_responses": True,
    "push_notifications": True,
    "shame_mode": True,
    "personal_triggers": True,
    "roast_buddy_mode": False,
    "motivational_unlockables": True,
    "voice_selector": True
}

UNLOCK_THRESHOLDS = {
    1: {"workouts": 0, "description": "Beginner roasts"},
    2: {"workouts": 5, "description": "Intermediate sass"},
    3: {"workouts": 15, "description": "Advanced mockery"},
    4: {"workouts": 30, "description": "Expert-level roasts"},
    5: {"workouts": 50, "description": "Legendary tough love"}
}

REMINDER_FREQUENCIES = {
    "morning_motivation": "08:00",
    "lunch_check": "12:00",
    "afternoon_boost": "15:00",
    "evening_accountability": "18:00",
    "bedtime_reflection": "21:00"
}

class BotConfig:
    def __init__(self, config_file="bot_config.json"):
        self.config_file = config_file
        self.settings = self._load_settings()
    
    def _load_settings(self) -> Dict:
        try:
            with open(self.config_file, 'r') as f:
                settings = json.load(f)
                return {**DEFAULT_SETTINGS, **settings}
        except FileNotFoundError:
            return DEFAULT_SETTINGS.copy()
    
    def save_settings(self):
        with open(self.config_file, 'w') as f:
            json.dump(self.settings, f, indent=2)
    
    def get_voice_preset(self) -> VoicePreset:
        return VoicePreset(self.settings["voice_preset"])
    
    def set_voice_preset(self, preset: VoicePreset):
        self.settings["voice_preset"] = preset.value
        self.save_settings()
    
    def get_intensity_level(self) -> IntensityLevel:
        return IntensityLevel(self.settings["intensity_level"])
    
    def set_intensity_level(self, level: IntensityLevel):
        self.settings["intensity_level"] = level.value
        self.save_settings()
    
    def toggle_kindness_mode(self):
        self.settings["kindness_mode"] = not self.settings["kindness_mode"]
        self.save_settings()
        return self.settings["kindness_mode"]
    
    def give_consent(self):
        self.settings["consent_given"] = True
        self.save_settings()
    
    def add_personal_trigger(self, trigger: str):
        if trigger not in self.settings["personal_triggers"]:
            self.settings["personal_triggers"].append(trigger)
            self.save_settings()
    
    def remove_personal_trigger(self, trigger: str):
        if trigger in self.settings["personal_triggers"]:
            self.settings["personal_triggers"].remove(trigger)
            self.save_settings()
    
    def update_unlocked_level(self, workouts: int):
        for level, threshold in UNLOCK_THRESHOLDS.items():
            if workouts >= threshold["workouts"]:
                self.settings["unlocked_levels"] = max(self.settings["unlocked_levels"], level)
        self.save_settings()
    
    def increment_workout_count(self):
        self.settings["total_workouts"] += 1
        self.update_unlocked_level(self.settings["total_workouts"])
        self.save_settings()
    
    def set_weight_goal(self, goal: float):
        self.settings["weight_goal"] = goal
        self.save_settings()
    
    def update_current_weight(self, weight: float):
        if self.settings["starting_weight"] is None:
            self.settings["starting_weight"] = weight
        self.settings["current_weight"] = weight
        self.save_settings()