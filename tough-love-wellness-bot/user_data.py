"""User data management and persistence for Tough Love Wellness Bot"""

import json
import os
from datetime import datetime, date
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict

@dataclass
class WeightEntry:
    date: str
    weight: float
    notes: Optional[str] = None

@dataclass
class WorkoutEntry:
    date: str
    workout_type: str
    duration_minutes: int
    notes: Optional[str] = None

@dataclass
class RoastBuddyMessage:
    message: str
    sender_name: str
    date_created: str
    used: bool = False

class UserDataManager:
    def __init__(self, data_file="/Users/mac/Documents/GitHub/template-generator/tough-love-wellness-bot/user_data.json"):
        self.data_file = data_file
        self.data = self._load_data()
    
    def _load_data(self) -> Dict[str, Any]:
        default_data = {
            "user_profile": {
                "name": "",
                "age": None,
                "height": None,
                "starting_weight": None,
                "current_weight": None,
                "goal_weight": None,
                "fitness_goal": "",
                "created_date": datetime.now().isoformat()
            },
            "weight_history": [],
            "workout_history": [],
            "personal_triggers": [],
            "roast_buddy_messages": [],
            "achievements": [],
            "streak_data": {
                "current_streak": 0,
                "longest_streak": 0,
                "last_activity_date": None
            },
            "app_usage": {
                "total_sessions": 0,
                "shame_button_presses": 0,
                "motivational_unlocks": 0,
                "kindness_mode_activations": 0
            },
            "settings": {
                "preferred_voice": "sassy_bff",
                "intensity_level": 2,
                "daily_reminders": True,
                "consent_given": False,
                "kindness_mode": False
            }
        }
        
        if not os.path.exists(self.data_file):
            return default_data
        
        try:
            with open(self.data_file, 'r') as f:
                loaded_data = json.load(f)
                return {**default_data, **loaded_data}
        except (json.JSONDecodeError, FileNotFoundError):
            return default_data
    
    def save_data(self):
        with open(self.data_file, 'w') as f:
            json.dump(self.data, f, indent=2, default=str)
    
    def update_user_profile(self, **kwargs):
        for key, value in kwargs.items():
            if key in self.data["user_profile"]:
                self.data["user_profile"][key] = value
        self.save_data()
    
    def add_weight_entry(self, weight: float, notes: str = None) -> WeightEntry:
        entry = WeightEntry(
            date=date.today().isoformat(),
            weight=weight,
            notes=notes
        )
        self.data["weight_history"].append(asdict(entry))
        self.data["user_profile"]["current_weight"] = weight
        
        if self.data["user_profile"]["starting_weight"] is None:
            self.data["user_profile"]["starting_weight"] = weight
        
        self._update_streak("weight_entry")
        self.save_data()
        return entry
    
    def add_workout_entry(self, workout_type: str, duration_minutes: int, notes: str = None) -> WorkoutEntry:
        entry = WorkoutEntry(
            date=date.today().isoformat(),
            workout_type=workout_type,
            duration_minutes=duration_minutes,
            notes=notes
        )
        self.data["workout_history"].append(asdict(entry))
        self._update_streak("workout")
        self.data["app_usage"]["total_sessions"] += 1
        self.save_data()
        return entry
    
    def add_personal_trigger(self, trigger: str):
        if trigger not in self.data["personal_triggers"]:
            self.data["personal_triggers"].append({
                "trigger": trigger,
                "date_added": date.today().isoformat()
            })
            self.save_data()
    
    def remove_personal_trigger(self, trigger: str):
        self.data["personal_triggers"] = [
            t for t in self.data["personal_triggers"] 
            if t["trigger"] != trigger
        ]
        self.save_data()
    
    def add_roast_buddy_message(self, message: str, sender_name: str) -> RoastBuddyMessage:
        buddy_message = RoastBuddyMessage(
            message=message,
            sender_name=sender_name,
            date_created=datetime.now().isoformat()
        )
        self.data["roast_buddy_messages"].append(asdict(buddy_message))
        self.save_data()
        return buddy_message
    
    def get_unused_roast_buddy_message(self) -> Optional[RoastBuddyMessage]:
        for msg in self.data["roast_buddy_messages"]:
            if not msg["used"]:
                msg["used"] = True
                self.save_data()
                return RoastBuddyMessage(**msg)
        return None
    
    def press_shame_button(self):
        self.data["app_usage"]["shame_button_presses"] += 1
        self.save_data()
    
    def activate_kindness_mode(self):
        self.data["app_usage"]["kindness_mode_activations"] += 1
        self.data["settings"]["kindness_mode"] = True
        self.save_data()
    
    def deactivate_kindness_mode(self):
        self.data["settings"]["kindness_mode"] = False
        self.save_data()
    
    def give_consent(self):
        self.data["settings"]["consent_given"] = True
        self.save_data()
    
    def _update_streak(self, activity_type: str):
        today = date.today().isoformat()
        last_activity = self.data["streak_data"]["last_activity_date"]
        
        if last_activity == today:
            return
        
        if last_activity is None:
            self.data["streak_data"]["current_streak"] = 1
        else:
            last_date = datetime.fromisoformat(last_activity).date()
            days_diff = (date.today() - last_date).days
            
            if days_diff == 1:
                self.data["streak_data"]["current_streak"] += 1
            elif days_diff > 1:
                self.data["streak_data"]["current_streak"] = 1
        
        self.data["streak_data"]["last_activity_date"] = today
        
        if self.data["streak_data"]["current_streak"] > self.data["streak_data"]["longest_streak"]:
            self.data["streak_data"]["longest_streak"] = self.data["streak_data"]["current_streak"]
    
    def get_weight_progress(self) -> Dict[str, float]:
        if not self.data["weight_history"]:
            return {"progress": 0, "total_loss": 0, "progress_percentage": 0}
        
        starting_weight = self.data["user_profile"]["starting_weight"]
        current_weight = self.data["user_profile"]["current_weight"]
        goal_weight = self.data["user_profile"]["goal_weight"]
        
        if not all([starting_weight, current_weight, goal_weight]):
            return {"progress": 0, "total_loss": 0, "progress_percentage": 0}
        
        total_loss = starting_weight - current_weight
        total_needed = starting_weight - goal_weight
        progress_percentage = (total_loss / total_needed) * 100 if total_needed > 0 else 0
        
        return {
            "progress": total_loss,
            "total_loss": total_loss,
            "progress_percentage": min(progress_percentage, 100)
        }
    
    def get_recent_weight_trend(self, days: int = 7) -> str:
        if len(self.data["weight_history"]) < 2:
            return "insufficient_data"
        
        recent_entries = self.data["weight_history"][-days:]
        if len(recent_entries) < 2:
            return "insufficient_data"
        
        first_weight = recent_entries[0]["weight"]
        last_weight = recent_entries[-1]["weight"]
        
        difference = last_weight - first_weight
        
        if abs(difference) < 0.5:
            return "stable"
        elif difference > 0:
            return "gaining"
        else:
            return "losing"
    
    def get_workout_stats(self) -> Dict[str, Any]:
        if not self.data["workout_history"]:
            return {"total_workouts": 0, "total_minutes": 0, "average_duration": 0}
        
        total_workouts = len(self.data["workout_history"])
        total_minutes = sum(w["duration_minutes"] for w in self.data["workout_history"])
        average_duration = total_minutes / total_workouts if total_workouts > 0 else 0
        
        return {
            "total_workouts": total_workouts,
            "total_minutes": total_minutes,
            "average_duration": round(average_duration, 1)
        }
    
    def get_personal_triggers(self) -> List[str]:
        return [t["trigger"] for t in self.data["personal_triggers"]]
    
    def get_user_stats(self) -> Dict[str, Any]:
        return {
            "streak": self.data["streak_data"]["current_streak"],
            "longest_streak": self.data["streak_data"]["longest_streak"],
            "total_workouts": len(self.data["workout_history"]),
            "shame_button_presses": self.data["app_usage"]["shame_button_presses"],
            "weight_progress": self.get_weight_progress(),
            "recent_trend": self.get_recent_weight_trend()
        }