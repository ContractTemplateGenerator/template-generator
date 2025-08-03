#!/usr/bin/env python3
"""
Tough Love Wellness Bot - Main Application
A humorous, self-motivational wellness accountability assistant
"""

import sys
import os
from typing import Optional
from datetime import datetime

from config import VoicePreset, IntensityLevel, BotConfig
from user_data import UserDataManager
from bot_responses import ToughLoveResponses

class ToughLoveBot:
    def __init__(self):
        self.user_data = UserDataManager()
        self.config = BotConfig()
        self.responses = ToughLoveResponses(self.user_data)
        
        # Check for first-time user
        if not self.user_data.data["settings"]["consent_given"]:
            self.setup_new_user()
    
    def setup_new_user(self):
        """Initial setup for new users with consent verification"""
        print("\n" + "="*60)
        print("🤖 WELCOME TO TOUGH LOVE WELLNESS BOT! 🤖")
        print("="*60)
        print("\nThis bot uses SARCASTIC, HUMOROUS tough love to help")
        print("you stay accountable to your fitness goals.")
        print("\n⚠️  IMPORTANT DISCLAIMER:")
        print("• This bot will make jokes about YOUR progress")
        print("• It uses comedic roasting as motivation")
        print("• You can toggle 'Kindness Mode' anytime")
        print("• This is for entertainment and motivation only")
        print("• You can adjust intensity or quit anytime")
        
        while True:
            consent = input("\nDo you consent to receive tough love motivation? (yes/no): ").strip().lower()
            if consent in ['yes', 'y']:
                self.user_data.give_consent()
                print("\n✅ Consent given! Let's get you set up...")
                break
            elif consent in ['no', 'n']:
                print("\nNo problem! This bot isn't for everyone. Goodbye! 👋")
                sys.exit(0)
            else:
                print("Please answer 'yes' or 'no'")
        
        # Basic user setup
        self.setup_user_profile()
        self.setup_voice_preference()
        
        print("\n🎉 Setup complete! Type 'help' to see what I can do!")
        print("Remember: Type 'kindness' anytime to toggle gentle mode! 💕")
    
    def setup_user_profile(self):
        """Set up basic user profile information"""
        print("\n📝 Let's set up your profile:")
        
        name = input("What should I call you? ").strip()
        if name:
            self.user_data.update_user_profile(name=name)
        
        try:
            current_weight = float(input("Current weight (optional, press Enter to skip): ").strip() or 0)
            if current_weight > 0:
                self.user_data.add_weight_entry(current_weight, "Initial weight")
        except ValueError:
            pass
        
        try:
            goal_weight = float(input("Goal weight (optional, press Enter to skip): ").strip() or 0)
            if goal_weight > 0:
                self.user_data.update_user_profile(goal_weight=goal_weight)
        except ValueError:
            pass
        
        goal = input("Fitness goal (optional, e.g., 'lose 20 pounds', 'run 5K'): ").strip()
        if goal:
            self.user_data.update_user_profile(fitness_goal=goal)
    
    def setup_voice_preference(self):
        """Let user choose their preferred voice/personality"""
        print("\n🎭 Choose your tough love personality:")
        voices = list(VoicePreset)
        
        for i, voice in enumerate(voices, 1):
            characteristics = self.responses._get_voice_style()
            print(f"{i}. {voice.value.replace('_', ' ').title()}")
        
        while True:
            try:
                choice = int(input(f"\nChoose (1-{len(voices)}): ").strip())
                if 1 <= choice <= len(voices):
                    selected_voice = voices[choice - 1]
                    self.user_data.data["settings"]["preferred_voice"] = selected_voice.value
                    self.user_data.save_data()
                    self.responses.voice_preset = selected_voice
                    print(f"\n✅ Voice set to: {selected_voice.value.replace('_', ' ').title()}")
                    break
                else:
                    print(f"Please choose a number between 1 and {len(voices)}")
            except ValueError:
                print("Please enter a valid number")
    
    def display_menu(self):
        """Display the main menu options"""
        print("\n" + "="*50)
        print("🏋️  TOUGH LOVE WELLNESS BOT MENU  🏋️")
        print("="*50)
        print("1. 📊 Log weight")
        print("2. 💪 Log workout")
        print("3. 🚨 SHAME MODE (emergency motivation)")
        print("4. 🎯 Add personal trigger")
        print("5. 💬 Add roast buddy message")
        print("6. 📈 View progress")
        print("7. ⚙️  Settings")
        print("8. 💕 Toggle kindness mode")
        print("9. 🔔 Get motivation reminder")
        print("10. ❓ Help")
        print("0. 👋 Quit")
        print("="*50)
    
    def log_weight(self):
        """Handle weight logging"""
        try:
            weight = float(input("Enter your weight: ").strip())
            previous_weight = None
            
            if self.user_data.data["weight_history"]:
                previous_weight = self.user_data.data["weight_history"][-1]["weight"]
            
            notes = input("Any notes? (optional): ").strip() or None
            
            self.user_data.add_weight_entry(weight, notes)
            response = self.responses.get_weight_response(weight, previous_weight)
            
            print(f"\n🤖 {response}")
            
            # Check for unlocks
            self.check_for_unlocks()
            
        except ValueError:
            print("❌ Please enter a valid number for weight.")
    
    def log_workout(self):
        """Handle workout logging"""
        workout_type = input("What type of workout? (e.g., cardio, weights, yoga): ").strip()
        if not workout_type:
            workout_type = "general"
        
        try:
            duration = int(input("Duration in minutes: ").strip())
            notes = input("Any notes? (optional): ").strip() or None
            
            self.user_data.add_workout_entry(workout_type, duration, notes)
            self.user_data.increment_workout_count()
            
            response = self.responses.get_workout_motivation(workout_type)
            print(f"\n🤖 Workout logged! {response}")
            
            # Check for unlocks
            self.check_for_unlocks()
            
        except ValueError:
            print("❌ Please enter a valid number for duration.")
    
    def shame_mode(self):
        """Emergency motivation mode"""
        print("\n🚨 SHAME MODE ACTIVATED 🚨")
        print("You pressed the panic button! Here's your emergency motivation:")
        
        context = input("What's the temptation? (snack/skip workout/other): ").strip().lower()
        if context not in ['snack', 'skip workout', 'other']:
            context = 'general'
        
        response = self.responses.get_shame_mode_response(context)
        print(f"\n🤖 {response}")
        
        follow_up = input("\nDid that help? (yes/no): ").strip().lower()
        if follow_up in ['no', 'n']:
            print("\n💕 Switching to kindness mode for support...")
            self.user_data.activate_kindness_mode()
            kind_response = self.responses._get_kindness_response("shame_button")
            print(f"\n🤖 {kind_response}")
    
    def add_personal_trigger(self):
        """Add a personal trigger/goal for customized responses"""
        trigger = input("Enter a personal trigger/goal (e.g., 'wedding dress', 'beach vacation'): ").strip()
        if trigger:
            self.user_data.add_personal_trigger(trigger)
            print(f"✅ Added trigger: '{trigger}'")
            print("I'll reference this in future motivation messages!")
        else:
            print("❌ Please enter a valid trigger.")
    
    def add_roast_buddy_message(self):
        """Add a message from a friend/partner for roast buddy mode"""
        sender_name = input("Who is this message from? ").strip()
        if not sender_name:
            print("❌ Please enter a sender name.")
            return
        
        message = input(f"Enter {sender_name}'s motivational message: ").strip()
        if not message:
            print("❌ Please enter a message.")
            return
        
        self.user_data.add_roast_buddy_message(message, sender_name)
        print(f"✅ Added roast buddy message from {sender_name}!")
        print("I'll deliver this when you need extra motivation!")
    
    def view_progress(self):
        """Display user progress and stats"""
        stats = self.user_data.get_user_stats()
        progress = stats["weight_progress"]
        
        print("\n📈 YOUR PROGRESS REPORT 📈")
        print("="*40)
        print(f"Current streak: {stats['streak']} days")
        print(f"Longest streak: {stats['longest_streak']} days")
        print(f"Total workouts: {stats['total_workouts']}")
        print(f"Shame button presses: {stats['shame_button_presses']}")
        
        if progress["total_loss"] != 0:
            print(f"Weight progress: {progress['total_loss']:.1f} lbs")
            print(f"Progress to goal: {progress['progress_percentage']:.1f}%")
        
        triggers = self.user_data.get_personal_triggers()
        if triggers:
            print(f"Personal triggers: {', '.join(triggers)}")
        
        # Get motivational summary
        summary = self.responses.get_progress_summary()
        print(f"\n🤖 {summary}")
    
    def settings_menu(self):
        """Display and handle settings"""
        while True:
            print("\n⚙️  SETTINGS MENU ⚙️")
            print("1. Change voice personality")
            print("2. Adjust intensity level")
            print("3. View personal triggers")
            print("4. Toggle features")
            print("5. Reset all data (⚠️  WARNING)")
            print("0. Back to main menu")
            
            choice = input("\nChoose an option: ").strip()
            
            if choice == '1':
                self.setup_voice_preference()
            elif choice == '2':
                self.adjust_intensity()
            elif choice == '3':
                self.manage_triggers()
            elif choice == '4':
                self.toggle_features()
            elif choice == '5':
                self.reset_data()
            elif choice == '0':
                break
            else:
                print("❌ Invalid choice. Please try again.")
    
    def adjust_intensity(self):
        """Adjust the intensity level of responses"""
        print("\n🔥 INTENSITY LEVELS:")
        print("1. Gentle (family-friendly)")
        print("2. Medium (standard sass)")
        print("3. Savage (maximum roast)")
        
        try:
            choice = int(input("Choose intensity (1-3): ").strip())
            if 1 <= choice <= 3:
                self.user_data.data["settings"]["intensity_level"] = choice
                self.user_data.save_data()
                self.responses.intensity = choice
                print(f"✅ Intensity set to level {choice}")
            else:
                print("❌ Please choose 1, 2, or 3")
        except ValueError:
            print("❌ Please enter a valid number")
    
    def manage_triggers(self):
        """Manage personal triggers"""
        triggers = self.user_data.get_personal_triggers()
        
        if not triggers:
            print("No personal triggers set.")
            return
        
        print("\n🎯 YOUR PERSONAL TRIGGERS:")
        for i, trigger in enumerate(triggers, 1):
            print(f"{i}. {trigger}")
        
        action = input("\nRemove a trigger? (y/n): ").strip().lower()
        if action in ['y', 'yes']:
            try:
                choice = int(input("Which number to remove? ")) - 1
                if 0 <= choice < len(triggers):
                    removed_trigger = triggers[choice]
                    self.user_data.remove_personal_trigger(removed_trigger)
                    print(f"✅ Removed: {removed_trigger}")
                else:
                    print("❌ Invalid choice")
            except ValueError:
                print("❌ Please enter a valid number")
    
    def toggle_features(self):
        """Toggle various features on/off"""
        print("\n🔧 FEATURE TOGGLES:")
        print("(Feature toggles would be implemented here)")
        print("Currently all features are enabled by default.")
    
    def reset_data(self):
        """Reset all user data (with confirmation)"""
        print("\n⚠️  WARNING: This will delete ALL your data!")
        confirmation = input("Type 'DELETE EVERYTHING' to confirm: ")
        
        if confirmation == "DELETE EVERYTHING":
            os.remove(self.user_data.data_file)
            print("✅ All data deleted. Restart the app to begin fresh.")
            sys.exit(0)
        else:
            print("❌ Reset cancelled.")
    
    def toggle_kindness_mode(self):
        """Toggle between tough love and kindness mode"""
        current_mode = self.user_data.data["settings"]["kindness_mode"]
        
        if current_mode:
            self.user_data.deactivate_kindness_mode()
            self.responses.kindness_mode = False
            print("🔥 Tough love mode activated! Prepare for sass!")
        else:
            self.user_data.activate_kindness_mode()
            self.responses.kindness_mode = True
            print("💕 Kindness mode activated! I'll be gentle and supportive.")
    
    def get_motivation_reminder(self):
        """Get a motivational reminder"""
        reminder_types = [
            "morning_motivation",
            "workout_time", 
            "snack_attack",
            "afternoon_boost"
        ]
        
        print("\n🔔 MOTIVATION TYPES:")
        for i, reminder_type in enumerate(reminder_types, 1):
            print(f"{i}. {reminder_type.replace('_', ' ').title()}")
        
        try:
            choice = int(input("Choose reminder type (1-4): ").strip())
            if 1 <= choice <= len(reminder_types):
                reminder_type = reminder_types[choice - 1]
                response = self.responses.get_reminder_message(reminder_type)
                print(f"\n🤖 {response}")
            else:
                print("❌ Invalid choice")
        except ValueError:
            print("❌ Please enter a valid number")
    
    def check_for_unlocks(self):
        """Check if user has unlocked new levels"""
        stats = self.user_data.get_workout_stats()
        current_level = self.user_data.data["settings"].get("unlocked_levels", 1)
        
        # Simple unlock logic based on workout count
        new_level = min(5, (stats["total_workouts"] // 5) + 1)
        
        if new_level > current_level:
            self.user_data.data["settings"]["unlocked_levels"] = new_level
            self.user_data.save_data()
            celebration = self.responses.get_unlock_celebration(new_level)
            print(f"\n🎉 {celebration}")
    
    def show_help(self):
        """Display help information"""
        print("\n❓ HELP & FEATURES")
        print("="*50)
        print("This bot helps you stay accountable with humor!")
        print("\n🎯 MAIN FEATURES:")
        print("• Weight tracking with sassy commentary")
        print("• Workout logging and motivation")
        print("• Emergency 'Shame Mode' for temptations")
        print("• Personal triggers for customized roasts")
        print("• Roast buddy messages from friends")
        print("• Unlockable content as you progress")
        print("• Multiple personality voices")
        print("\n💕 SAFETY FEATURES:")
        print("• Kindness mode (toggle anytime)")
        print("• Adjustable intensity levels")
        print("• Full consent system")
        print("\n⌨️  TIPS:")
        print("• Be honest with your logging")
        print("• Use shame mode when you're tempted")
        print("• Add personal triggers for better motivation")
        print("• Switch voices to keep it fresh")
        print("• Toggle kindness mode if you need support")
    
    def run(self):
        """Main application loop"""
        print(f"\n👋 Welcome back, {self.user_data.data['user_profile']['name'] or 'warrior'}!")
        
        # Check for roast buddy message
        buddy_message = self.responses.get_roast_buddy_response()
        if buddy_message:
            print(f"\n💌 {buddy_message}")
        
        while True:
            self.display_menu()
            choice = input("\nChoose an option: ").strip()
            
            if choice == '1':
                self.log_weight()
            elif choice == '2':
                self.log_workout()
            elif choice == '3':
                self.shame_mode()
            elif choice == '4':
                self.add_personal_trigger()
            elif choice == '5':
                self.add_roast_buddy_message()
            elif choice == '6':
                self.view_progress()
            elif choice == '7':
                self.settings_menu()
            elif choice == '8':
                self.toggle_kindness_mode()
            elif choice == '9':
                self.get_motivation_reminder()
            elif choice == '10':
                self.show_help()
            elif choice == '0':
                print("\n👋 Keep crushing those goals! See you next time!")
                break
            else:
                print("❌ Invalid choice. Please try again.")

def main():
    """Entry point for the application"""
    try:
        bot = ToughLoveBot()
        bot.run()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted! Keep up the good work!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        print("Please restart the application.")
        sys.exit(1)

if __name__ == "__main__":
    main()